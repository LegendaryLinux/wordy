import React from 'react';
import './Keyboard.css';

export const Keyboard = ({currentWord, guesses}) => {
  const triedLetters = new Set();
  for (let guess of guesses) {
    if (!guess) {continue;}
    for (let letter of guess.split('')) {
      triedLetters.add(letter);
    }
  }

  const getLetterCorrectnessClass = (letter) => {
    const wordLetters = currentWord.split('');
    let letterClass = 'wrong';

    for (let guess of guesses) {
      if (!guess) {continue;}
      const guessLetters = guess.split('');
      for (let i=0; i < guessLetters.length; i++) {
        if (guessLetters[i] !== letter) {
          continue;
        }

        if (guessLetters[i] === wordLetters[i]) {
          return 'correct';
        }

        if (wordLetters.includes(guessLetters[i])) {
          letterClass = 'included';
          break;
        }
      }
    }

    return letterClass;
  };

  return (
    <div className="keyboard">
      <div className="q-row">
        {
          ['q','w','e','r','t','y','u','i','o','p'].map((letter) => {
            const letterClass = triedLetters.has(letter) ?
              getLetterCorrectnessClass(letter) :
              '';
            return (
              <div key={letter} className={`letter-key ${letterClass}`}>
                {letter}
              </div>
            );
          })
        }
      </div>

      <div className="a-row">
        {
          ['a','s','d','f','g','h','j','k','l'].map((letter) => {
            const letterClass = triedLetters.has(letter) ?
              getLetterCorrectnessClass(letter) :
              '';
            return (
              <div key={letter} className={`letter-key ${letterClass}`}>
                {letter}
              </div>
            );
          })
        }
      </div>

      <div className="z-row">
        {
          ['z','x','c','v','b','n','m'].map((letter) => {
            const letterClass = triedLetters.has(letter) ?
              getLetterCorrectnessClass(letter) :
              '';
            return (
              <div key={letter} className={`letter-key ${letterClass}`}>
                {letter}
              </div>
            );
          })
        }
      </div>
    </div>
  );
};
