import React from 'react';
import './Performance.css';

function Performance({ wpm }) {
  if (!wpm) return null;

  const getColor = () => {
    if (wpm >= 60) return 'green';
    if (wpm >= 40) return 'orange';
    return 'red';
  };

  return (
    <div className="performance">
      <div className="wpm" style={{ color: getColor() }}>
        {wpm} wpm
      </div>
    </div>
  );
}

export default Performance;
