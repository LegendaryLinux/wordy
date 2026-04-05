import React from 'react';
import './GuessRow.css';

export const GuessRow = ({word, guess, attempt}) => {
  const wordLetters = word.split('');
  const guessLetters = guess.split('');

  return (
    <div className="guess-row">
      {
        wordLetters.map((wordLetter, index) => {
          const correct = (wordLetter === guessLetters[index]) ?
            'correct' :
            wordLetters.includes(guessLetters[index]) ?
              'included' :
              'wrong'

          return (
            <div className={`guess-cell ${correct}`} key={`guess-${attempt}-${index}`}>
              {guessLetters[index]}
            </div>
          );
        })
      }
    </div>
  );
};
