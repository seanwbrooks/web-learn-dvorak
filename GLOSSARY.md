# Learn Dvorak

A typing tutor that teaches the Dvorak keyboard layout by having the learner type generated text and showing them where they're slow or inaccurate.

## Language

**Test**:
One pass through a freshly generated Passage, ending in a WPM result.
_Avoid_: Game, round, attempt (for the live run)

**Practice Test**:
A shorter Test whose Passage is weighted toward the learner's Weak Keys. It counts toward Weak Keys but never toward WPM history or Personal Best.
_Avoid_: Drill, lesson

**Passage**:
The generated mix of words, numbers and punctuation the learner types during one Test. A normal Passage is 25 or 50 words, whichever the learner chose last; a Practice Passage is always 25.
_Avoid_: Display words, word list

**Typed Portion**:
The part of the Passage the learner has already typed correctly.
_Avoid_: Good words

**Attempt**:
A Test the learner finished, as recorded in their history with its WPM, date, and per-key Missed Keys and Wrong Keypresses. Practice Tests are Attempts too, marked as Practice. Abandoned Tests are never Attempts.
_Avoid_: Score, run

**Personal Best**:
The highest WPM across all of the learner's Attempts, excluding Practice Tests.
_Avoid_: Best score, high score

**WPM**:
Words per minute, where a word is any five correctly typed characters (spaces included), timed from the first correct character.
_Avoid_: Speed, score

**Missed Key**:
A position in the Passage where the learner made at least one Wrong Keypress, counted against the physical Dvorak key that position needed.
_Avoid_: Bad key, error

**Wrong Keypress**:
A single press of anything other than the character the Passage needed; one Missed Key can have several.
_Avoid_: Miss, mistake

**Miss Rate**:
For one key, the number of Missed Keys divided by the number of times that key was needed in the Passage; always between 0% and 100%.
_Avoid_: Error rate, accuracy

**Weak Key**:
A key with a high Miss Rate across the learner's last 10 Attempts.
_Avoid_: Problem key, keys to practice
