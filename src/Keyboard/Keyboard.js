import React from 'react';
import './Keyboard.css';

const DEFAULT_KEYBOARD_ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m'],
];

const DEFAULT_ACTION_LABELS = {
  backspace: 'Delete',
  enter: 'Enter',
};

export const Keyboard = ({
  currentWord,
  guesses,
  keyboardRows = DEFAULT_KEYBOARD_ROWS,
  actionLabels = DEFAULT_ACTION_LABELS,
}) => {
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

  const handleKeyClick = (letter) => {
    document.body.dispatchEvent(new KeyboardEvent('keydown', {
      key: letter,
      bubbles: true,
    }));
  };

  return (
    <div className="keyboard">
      <div className="q-row">
        {
          keyboardRows[0].map((letter) => {
            const letterClass = triedLetters.has(letter) ?
              getLetterCorrectnessClass(letter) :
              '';
            return (
              <div key={letter} className={`kb-key letter-key ${letterClass}`} onClick={() => handleKeyClick(letter)}>
                {letter}
              </div>
            );
          })
        }
      </div>

      <div className="a-row">
        {
          keyboardRows[1].map((letter) => {
            const letterClass = triedLetters.has(letter) ?
              getLetterCorrectnessClass(letter) :
              '';
            return (
              <div key={letter} className={`kb-key letter-key ${letterClass}`} onClick={() => handleKeyClick(letter)}>
                {letter}
              </div>
            );
          })
        }
      </div>

      <div className="z-row">
        <div key="Backspace" className="kb-key delete-key" onClick={() => handleKeyClick('Backspace')}>
          {actionLabels.backspace}
        </div>
        {
          keyboardRows[2].map((letter) => {
            const letterClass = triedLetters.has(letter) ?
              getLetterCorrectnessClass(letter) :
              '';
            return (
              <div key={letter} className={`kb-key letter-key ${letterClass}`} onClick={() => handleKeyClick(letter)}>
                {letter}
              </div>
            );
          })
        }
        <div key="Enter" className="kb-key enter-key" onClick={() => handleKeyClick('Enter')}>
          {actionLabels.enter}
        </div>
      </div>
    </div>
  );
};
