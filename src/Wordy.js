import React, {useState, useEffect, useCallback, useRef} from 'react';
import possibleWords from '../public/static/possibleWords.json';
import validWords from '../public/static/validWords.json';
import {GuessRow} from './GuessRow/GuessRow';
import {BlankRow} from './BlankRow/BlankRow';
import {InputRow} from './InputRow/InputRow';
import {Keyboard} from './Keyboard/Keyboard';
import './Wordy.css';

export const Wordy = () => {
  const [currentWord, setCurrentWord] = useState(possibleWords[Math.floor(Math.random() * possibleWords.length)]);
  const [numAttempts, setNumAttempts] = useState(6);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [guesses, setGuesses] = useState(new Array(numAttempts).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const inputRowRef = useRef(null);

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, currentGuess, currentWord]);

  const chooseNewWord = () => {
    setCurrentWord(possibleWords[Math.floor(Math.random() * possibleWords.length)]);
    setCurrentAttempt(0);
    setGuesses(new Array(numAttempts).fill(null));
    setCurrentGuess('');
    setIsSolved(false);
  };

  const handleKeyDown = useCallback((evt) => {
    if (isSolved || (currentAttempt === numAttempts)) {return;}

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
        // Check that guess is five letters and is valid
        if (currentGuess.length !== 5 || !validWords.includes(currentGuess)) {
          if (inputRowRef.current) {
            inputRowRef.current.classList.remove('shake');
            void inputRowRef.current.offsetWidth;
            inputRowRef.current.classList.add('shake');
          }
          return;
        }

        // Add word to guesses
        setGuesses((prev) => {
          prev[currentAttempt] = currentGuess;
          return prev;
        });

        // Increment currentAttempt
        setCurrentAttempt((prev) => prev + 1);

        if (currentWord === currentGuess) {
          setIsSolved(true);
        }

        // Reset currentGuess
        setCurrentGuess('');
      }
    }
  }, [currentWord, currentGuess, isSolved]);

  return (
    <div id="wordy">
      <h1>Wordy</h1>

      {
        guesses.map((guess, index) => {
          if (guess) {
            return <GuessRow word={currentWord} guess={guess} attempt={currentAttempt} />;
          }

          if (!isSolved && (index === currentAttempt)) {
            return (
              <InputRow
                ref={inputRowRef}
                numLetters={currentWord.length}
                attempt={index}
                currentGuess={currentGuess}
              />
            );
          }

          return <BlankRow numLetters={currentWord.length} attempt={index} />
        })
      }

      <Keyboard currentWord={currentWord} guesses={guesses} />

      {
        isSolved ? (
          <div className="success-message">
            <h2>Congratulations!</h2>
            <br />
            <button onClick={chooseNewWord}>New Word</button>
          </div>
        ) : null
      }

      {
        (!isSolved && (currentAttempt === numAttempts)) ? (
          <div className="failure-message">
            Sorry! The correct word was:
            <h3>{currentWord}</h3>
            <button onClick={chooseNewWord}>Try Again</button>
          </div>
        ) : null
      }
    </div>
  );
};
