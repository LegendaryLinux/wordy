import React, {useState, useEffect, useCallback} from 'react';
import fiveLetterWords from '../public/static/five_letter_words.json';
import {GuessRow} from './GuessRow/GuessRow';
import {BlankRow} from './BlankRow/BlankRow';
import {InputRow} from './InputRow/InputRow';
import './Wordy.css';

export const Wordy = () => {
  const [currentWord, setCurrentWord] = useState(fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)]);
  const [numAttempts, setNumAttempts] = useState(6);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [guesses, setGuesses] = useState(new Array(numAttempts).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  useEffect(() => {
    setGuesses(new Array(numAttempts).fill(null));
    setCurrentAttempt(0);
  }, [numAttempts]);

  const handleKeyDown = useCallback((evt) => {
    if (evt.key) {
      if (evt.key === 'Backspace') {
        return setCurrentGuess((prev) => {
          return prev.length === 0 ?
            prev : // No change
            prev.substring(0, prev.length - 1) // Remove one character
        });
      }

      if (evt.key.length === 1 && /[A-z]/.test(evt.key)) {
        return setCurrentGuess((prev) => {
          return (prev.length < currentWord.length) ?
            `${prev}${evt.key.toLowerCase()}` : // Append character
            prev.length === currentWord.length ?
              `${prev.substring(0, currentWord.length - 1)}${evt.key.toLowerCase()}` : // Replace last character
              prev; // No change
        });
      }

      if (evt.key === 'Enter') {
        // Check that guess is five letters
        if (currentGuess.length !== 5) {
          alert('Word must be five letters.');
          return;
        }

        // Check that word exists in list
        if (!fiveLetterWords.includes(currentGuess)) {
          alert('Unknown word.');
          return;
        }

        // Add word to guesses
        setGuesses((prev) => {});

        // Increment currentAttempt

        // Reset currentGuess
      }
    }
  }, [currentWord]);

  return (
    <div id="wordy">
      <h1>Wordy</h1>
      <h3>{currentWord}</h3>

      {
        guesses.map((guess, index) => {
          if (guess) {
            return 'Guess Row';
          }

          if (index === currentAttempt) {
            return (
              <InputRow
                numLetters={currentWord.length}
                attempt={index}
                currentGuess={currentGuess}
              />
            );
          }

          return <BlankRow numLetters={currentWord.length} attempt={index} />
        })
      }
    </div>
  );
};
