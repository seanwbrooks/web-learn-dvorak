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
import Site from '../site/Site'
import { generatePassage, generatePracticePassage } from '../../passage'
import { findWeakKeys } from '../../weakKeys'
import {
  loadIntroSeen,
  saveIntroSeen,
  loadPassageLength,
  savePassageLength,
  PassageLength,
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
  | { type: 'start'; passage: string; practiceKeys: string[] | null }
  | { type: 'press'; key: string; now: number }

const testReducer = (test: Test, action: TestAction): Test =>
  action.type === 'start'
    ? startTest(action.passage, action.practiceKeys)
    : press(test, action.key, action.now)

function Home() {
  const [passageLength, setPassageLength] = useState(loadPassageLength)
  const [test, dispatch] = useReducer(testReducer, passageLength, (length) =>
    startTest(generatePassage(length))
  )
  const [history, setHistory] = useState(loadLearnerHistory)
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null)
  const [introOpen, setIntroOpen] = useState(() => !loadIntroSeen())

  const weakKeys = useMemo(() => findWeakKeys(history.attempts), [history])
  const { attempt, practiceKeys, latestWrongKeypress } = test

  const startNewTest = (passage: string, keys: string[] | null = null) =>
    dispatch({ type: 'start', passage, practiceKeys: keys })
  const restartTest = () => startNewTest(generatePassage(passageLength))
  // Switching lengths starts a fresh Test; the abandoned one isn't recorded
  const changePassageLength = (length: PassageLength) => {
    setPassageLength(length)
    savePassageLength(length)
    startNewTest(generatePassage(length))
  }
  const startPractice = () =>
    startNewTest(generatePracticePassage(weakKeys, 25), weakKeys)

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
      // The intro is covering the Passage
      if (introOpen) return
      // A key pressed on a button (the length toggle, the nav bar's ?) works
      // that control; it isn't typing
      if (e.target instanceof Element && e.target.closest('button, a')) return
      dispatch({ type: 'press', key: e.key, now: Date.now() })
    }
    window.addEventListener('keyup', handleKeyUp)
    return () => window.removeEventListener('keyup', handleKeyUp)
  }, [introOpen])

  return (
    <Site
      current="home"
      onHelp={() => setIntroOpen(true)}
      outside={
        <IntroModal
          open={introOpen}
          onClose={() => {
            setIntroOpen(false)
            saveIntroSeen()
          }}
        />
      }
    >
      {/* Results take the finished Passage's place, so the page fits one
         screen with the keyboard (and its Weak Keys) still in view */}
      {attempt ? (
        <>
          <Performance
            wpm={attempt.wpm}
            personalBest={history.personalBest}
            isComplete
            isPractice={practiceKeys !== null}
            onRestart={restartTest}
            onPractice={weakKeys.length > 0 ? startPractice : null}
          />
          {practiceKeys === null && (
            <Progress
              attempts={history.attempts}
              personalBest={history.personalBest}
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
        />
      )}

      <Keyboard highlightedKey={highlightedKey} weakKeys={weakKeys} />
    </Site>
  )
}

export default Home
