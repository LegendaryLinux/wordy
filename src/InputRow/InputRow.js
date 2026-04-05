import React from 'react';
import './InputRow.css';

export const InputRow = ({numLetters, currentGuess, attempt}) => {
  const letters = currentGuess.split('');
  while (letters.length < numLetters) {
    letters.push(null);
  }

  return (
    <div className="input-row">
      {
        letters.map((letter, index) => {
          const active = (index === currentGuess.length || 0) ? 'active' : '';
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