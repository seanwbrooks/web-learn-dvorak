import React from 'react';
import './TypingDisplay.css';

function TypingDisplay({ goodWords, displayWords }) {
  return (
    <div className="typing-display">
      <span className="good-words">{goodWords}</span>
      <span className="display-words">{displayWords}</span>
    </div>
  );
}

export default TypingDisplay;
