import React, { useState, useEffect, useCallback } from 'react';
import Keyboard from './components/Keyboard';
import TypingDisplay from './components/TypingDisplay';
import Performance from './components/Performance';
import { generateDisplayWords, calculateWPM } from './utils';
import { keyMap, specialKeys } from './data';
import './App.css';

function App() {
  const [displayWords, setDisplayWords] = useState('');
  const [goodWords, setGoodWords] = useState('');
  const [goodIndex, setGoodIndex] = useState(0);
  const [highlightedKey, setHighlightedKey] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setDisplayWords(generateDisplayWords(50));
  }, []);

  const highlightKey = useCallback((key) => {
    setHighlightedKey(key);
    setTimeout(() => {
      setHighlightedKey(null);
    }, 2000);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Start timing on first key press
      if (!started) {
        setStartTime(Date.now());
        setStarted(true);
      }

      // Handle backspace
      if (e.key === 'Backspace') {
        if (goodIndex === 0) {
          return;
        }
        setGoodIndex(prev => prev - 1);
        setGoodWords(prev => prev.slice(0, -1));
        return;
      }

      // Ignore special keys
      if (specialKeys.includes(e.key)) {
        return;
      }

      // Check if the key matches the expected character
      if (e.key === displayWords.charAt(goodIndex)) {
        const newGoodWords = goodWords + e.key;
        const newGoodIndex = goodIndex + 1;
        
        setGoodWords(newGoodWords);
        setGoodIndex(newGoodIndex);

        // Check if completed
        if (newGoodIndex >= displayWords.length) {
          const endTime = Date.now();
          const elapsedTimeInMins = (endTime - startTime) / 60000;
          const calculatedWpm = Math.round(50 / elapsedTimeInMins);
          setWpm(calculatedWpm);
        }
      } else {
        // Highlight the correct key
        let keyToHit = displayWords.charAt(goodIndex).toLowerCase();
        if (keyMap.hasOwnProperty(keyToHit)) {
          keyToHit = keyMap[keyToHit];
        }
        highlightKey(keyToHit);
      }
    };

    window.addEventListener('keyup', handleKeyPress);
    return () => window.removeEventListener('keyup', handleKeyPress);
  }, [displayWords, goodWords, goodIndex, started, startTime, highlightKey]);

  const remainingWords = displayWords.substring(goodIndex);

  return (
    <div className="app">
      <div className="title">
        <h1>Learn Dvorak</h1>
      </div>

      <Keyboard highlightedKey={highlightedKey} />

      <TypingDisplay goodWords={goodWords} displayWords={remainingWords} />

      <Performance wpm={wpm} />
    </div>
  );
}

export default App;
