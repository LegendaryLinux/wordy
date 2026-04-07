import React from 'react';
import './InputRow.css';

export const InputRow = ({numLetters, currentGuess, attempt, ref}) => {
  const letters = currentGuess.split('');
  while (letters.length < numLetters) {
    letters.push(null);
  }

  return (
    <div className="input-row" ref={ref}>
      {
        letters.map((letter, index) => {
          let active = (
            (index === (currentGuess.length || 0)) ||
            (index === 4 && currentGuess.length === 5)
          ) ? 'active' : '';
          return (
            <div key={`input-${attempt}-${index}`} className={`input-cell ${active}`}>
              {letter}
            </div>
          );
        })
      }
    </div>
  );
};