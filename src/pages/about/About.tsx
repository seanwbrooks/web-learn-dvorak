import React, { JSX } from 'react'
import Site from '../site/Site'
import '../site/Button.css'
import '../site/reading.css'

function About(): JSX.Element {
  return (
    <Site current="about">
      <main className="page">
        <h1>About the Dvorak layout</h1>
        <p className="page-lede">
          The Dvorak Simplified Keyboard is an alternative to QWERTY, arranged
          so typing takes less effort. It uses the same keys as any keyboard;
          only the letters they produce move.
        </p>

        <section>
          <h2>Where it came from</h2>
          <p>
            August Dvorak, an education professor at the University of
            Washington, and his brother-in-law William Dealey designed the
            layout in the early 1930s and patented it in 1936. They studied
            which letters and letter pairs English uses most and placed them
            where fingers rest. QWERTY dates from Christopher Sholes&apos;s
            typewriters of the 1870s, long before anyone studied typing comfort.
            The American National Standards Institute recognized Dvorak as an
            alternative standard layout in 1982.
          </p>
        </section>

        <section>
          <h2>How it&apos;s arranged</h2>
          <ul>
            <li>
              All five vowels sit under the left hand on the home row (A O E U
              I), and the most common consonants under the right (D H T N S).
            </li>
            <li>
              Roughly 70% of English keystrokes land on the home row, compared
              with about 32% on QWERTY, so fingers travel less.
            </li>
            <li>
              Common words tend to alternate hands, so one hand reaches for its
              next key while the other types.
            </li>
            <li>
              The least common letters (Q J K X) share the left hand&apos;s
              bottom row, and punctuation such as , . &apos; moves to the top
              left.
            </li>
          </ul>
        </section>

        <section>
          <h2>Does it make you faster?</h2>
          <p>
            Many people find Dvorak more comfortable because their fingers move
            less. Whether it makes typists faster is still debated: early
            studies, including Dvorak&apos;s own, reported large gains, while
            later reviews found the difference small. Comfort is the surer
            benefit; speed comes from practice on either layout.
          </p>
        </section>

        <section>
          <h2>Switching your computer to Dvorak</h2>
          <p>
            You don&apos;t need a new keyboard. Change the layout in your system
            settings, and the keys produce Dvorak letters while their printed
            labels still show QWERTY. Many learners stop looking down and follow
            the on-screen keyboard instead.
          </p>
          <ul>
            <li>
              <strong>Mac:</strong> System Settings › Keyboard › Text Input,
              then add the Dvorak input source.
            </li>
            <li>
              <strong>Windows:</strong> Settings › Time &amp; language ›
              Language &amp; region, then add the United States-Dvorak keyboard
              to your language.
            </li>
            <li>
              <strong>Linux and ChromeOS:</strong> look for US Dvorak in the
              keyboard or input settings.
            </li>
          </ul>
        </section>

        <a className="page-action restart-button" href="./">
          Start practicing
        </a>
      </main>
    </Site>
  )
}

export default About
