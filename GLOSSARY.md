# Learn Dvorak

A typing tutor that teaches the Dvorak keyboard layout by having the learner type generated text and showing them where they're slow or inaccurate.

## Language

**Test**:
One pass through a freshly generated Passage, ending in a WPM result.
_Avoid_: Game, round, attempt (for the live run)

**Practice Test**:
A Test whose Passage favours the learner's Weak Keys; it never affects Personal Best.
_Avoid_: Drill, lesson

**Passage**:
The generated mix of words, numbers and punctuation the learner types during one Test.
_Avoid_: Display words, word list

**Typed Portion**:
The part of the Passage the learner has already typed correctly.
_Avoid_: Good words

**Attempt**:
A Test the learner finished, as recorded in their history with its WPM and date. Per-key Miss Rates are planned but are not currently recorded. Abandoned Tests are never Attempts.
_Avoid_: Score, run

**Personal Best**:
The highest WPM across all of the learner's Attempts.
_Avoid_: Best score, high score

**WPM**:
Words per minute, where a word is any five correctly typed characters (spaces included), timed from the first correct character.
_Avoid_: Speed, score

**Missed Key**:
The physical Dvorak key the learner should have pressed when they made a wrong keypress; every wrong keypress counts once.
_Avoid_: Bad key, wrong key

**Miss Rate**:
For one key, the number of Missed Keys divided by the number of times that key was needed in the Passage.
_Avoid_: Error count, accuracy

**Weak Key**:
A key with a high Miss Rate across the learner's last 10 Attempts.
_Avoid_: Problem key, keys to practice
