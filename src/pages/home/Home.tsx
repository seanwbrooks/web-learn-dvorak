import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
} from 'react'
import Keyboard from '../../components/Keyboard'
import TypingDisplay from '../../components/TypingDisplay'
import Performance from '../../components/Performance'
import Progress from '../../components/Progress'
import IntroModal from '../../components/IntroModal'
import KeyboardWarning from '../../components/KeyboardWarning'
import Site from '../site/Site'
import { generatePassage, generatePracticePassage } from '../../passage'
import { findWeakKeys } from '../../weakKeys'
import {
  loadIntroSeen,
  saveIntroSeen,
  loadPassageLength,
  savePassageLength,
  PassageLength,
  loadLevel,
  saveLevel,
  Level,
  loadLearnerHistory,
  recordAttempt,
} from '../../learnerHistory'
import {
  Test,
  startTest,
  press,
  typedPortion,
  remainingPassage,
} from '../../typingTest'

type TestAction =
  | {
      type: 'start'
      passage: string
      practiceKeys: string[] | null
      level: Level
    }
  | { type: 'press'; key: string; now: number }

const testReducer = (test: Test, action: TestAction): Test =>
  action.type === 'start'
    ? startTest(action.passage, action.practiceKeys, action.level)
    : press(test, action.key, action.now)

// A phone or tablet, whose main input is a finger rather than a mouse
const onTouchscreen = () =>
  window.matchMedia?.('(hover: none) and (pointer: coarse)').matches ?? false

function Home() {
  const [passageLength, setPassageLength] = useState(loadPassageLength)
  const [level, setLevel] = useState(loadLevel)
  const [test, dispatch] = useReducer(testReducer, null, () =>
    startTest(generatePassage(passageLength, level), null, level)
  )
  const [history, setHistory] = useState(loadLearnerHistory)
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null)
  const [introOpen, setIntroOpen] = useState(() => !loadIntroSeen())
  const [keyboardWarningOpen, setKeyboardWarningOpen] = useState(onTouchscreen)

  const weakKeys = useMemo(() => findWeakKeys(history.attempts), [history])
  const { attempt, practiceKeys, latestWrongKeypress } = test

  const startNewTest = (
    length: PassageLength = passageLength,
    testLevel: Level = level
  ) =>
    dispatch({
      type: 'start',
      passage: generatePassage(length, testLevel),
      practiceKeys: null,
      level: testLevel,
    })
  const restartTest = () => startNewTest()
  // Switching lengths or Levels starts a fresh Test; the abandoned one isn't
  // recorded
  const changePassageLength = (length: PassageLength) => {
    setPassageLength(length)
    savePassageLength(length)
    startNewTest(length)
  }
  const changeLevel = (newLevel: Level) => {
    setLevel(newLevel)
    saveLevel(newLevel)
    startNewTest(passageLength, newLevel)
  }
  const startPractice = () =>
    dispatch({
      type: 'start',
      passage: generatePracticePassage(weakKeys, 25),
      practiceKeys: weakKeys,
      level,
    })

  // A finished Test becomes an Attempt in the learner's history, before the
  // results paint, so they never show without the Personal Best
  useLayoutEffect(() => {
    if (attempt) setHistory((current) => recordAttempt(current, attempt))
  }, [attempt])

  // Light the key that was needed for 2 seconds after a Wrong Keypress
  useEffect(() => {
    setHighlightedKey(latestWrongKeypress?.neededKey ?? null)
    if (!latestWrongKeypress) return
    const timer = setTimeout(() => setHighlightedKey(null), 2000)
    return () => clearTimeout(timer)
  }, [latestWrongKeypress])

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      // A dialog is covering the Passage
      if (introOpen || keyboardWarningOpen) return
      // A key pressed on a button (the toggles, the nav bar's ?) works
      // that control; it isn't typing
      if (e.target instanceof Element && e.target.closest('button, a')) return
      dispatch({ type: 'press', key: e.key, now: Date.now() })
    }
    window.addEventListener('keyup', handleKeyUp)
    return () => window.removeEventListener('keyup', handleKeyUp)
  }, [introOpen, keyboardWarningOpen])

  return (
    <Site
      current="home"
      onHelp={() => setIntroOpen(true)}
      outside={
        <>
          <KeyboardWarning
            open={keyboardWarningOpen}
            onClose={() => setKeyboardWarningOpen(false)}
          />
          {/* On a first visit, the intro follows the warning */}
          <IntroModal
            open={introOpen && !keyboardWarningOpen}
            onClose={() => {
              setIntroOpen(false)
              saveIntroSeen()
            }}
          />
        </>
      }
    >
      {/* Results take the finished Passage's place, so the page fits one
         screen with the keyboard (and its Weak Keys) still in view */}
      {attempt ? (
        <>
          <Performance
            wpm={attempt.wpm}
            personalBest={history.personalBests[level]}
            isComplete
            isPractice={practiceKeys !== null}
            onRestart={restartTest}
            onPractice={weakKeys.length > 0 ? startPractice : null}
          />
          {practiceKeys === null && (
            <Progress
              attempts={history.attempts}
              personalBest={history.personalBests[level]}
              level={level}
            />
          )}
        </>
      ) : (
        <TypingDisplay
          practiceKeys={practiceKeys}
          typedPortion={typedPortion(test)}
          remainingPassage={remainingPassage(test)}
          passageLength={passageLength}
          onPassageLength={changePassageLength}
          level={level}
          onLevel={changeLevel}
        />
      )}

      <Keyboard highlightedKey={highlightedKey} weakKeys={weakKeys} />
    </Site>
  )
}

export default Home
