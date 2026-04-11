import React, {useState, useEffect, useCallback, useRef} from 'react';
import possibleWordsEn from '../public/static/possibleWords.json';
import validWordsEn from '../public/static/validWords.json';
import possibleWordsEs from '../public/static/possibleWords.es.json';
import validWordsEs from '../public/static/validWords.es.json';
import {GuessRow} from './GuessRow/GuessRow';
import {BlankRow} from './BlankRow/BlankRow';
import {InputRow} from './InputRow/InputRow';
import {Keyboard} from './Keyboard/Keyboard';
import './Wordy.css';

const LANGUAGES = {
  en: {
    label: 'English',
    keyboardRows: [
      ['q','w','e','r','t','y','u','i','o','p'],
      ['a','s','d','f','g','h','j','k','l'],
      ['z','x','c','v','b','n','m'],
    ],
    possibleWords: possibleWordsEn,
    validWords: validWordsEn,
  },
  es: {
    label: 'Español',
    keyboardRows: [
      ['q','w','e','r','t','y','u','i','o','p'],
      ['a','s','d','f','g','h','j','k','l','ñ'],
      ['z','x','c','v','b','n','m'],
    ],
    possibleWords: possibleWordsEs,
    validWords: validWordsEs,
  },
};

const DEFAULT_LANGUAGE = 'en';
const LANGUAGE_STORAGE_KEY = 'selectedLanguage';

const chooseRandomWord = (words) => words[Math.floor(Math.random() * words.length)];

const getStoredLanguage = () => {
  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return LANGUAGES[storedLanguage] ? storedLanguage : DEFAULT_LANGUAGE;
};

export const Wordy = () => {
  const initialLanguage = useRef(getStoredLanguage());
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage.current);
  const [currentWord, setCurrentWord] = useState(() => chooseRandomWord(LANGUAGES[initialLanguage.current].possibleWords));
  const [numAttempts, setNumAttempts] = useState(6);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [guesses, setGuesses] = useState(new Array(numAttempts).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const inputRowRef = useRef(null);
  const language = LANGUAGES[selectedLanguage];

  const chooseNewWord = useCallback((languageKey = selectedLanguage) => {
    const nextLanguage = LANGUAGES[languageKey];
    setCurrentWord(chooseRandomWord(nextLanguage.possibleWords));
    setCurrentAttempt(0);
    setGuesses(new Array(numAttempts).fill(null));
    setCurrentGuess('');
    setIsSolved(false);
  }, [numAttempts, selectedLanguage]);

  const handleLanguageChange = (evt) => {
    const nextLanguage = evt.target.value;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    setSelectedLanguage(nextLanguage);
    chooseNewWord(nextLanguage);
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

      if (evt.key.length === 1 && /[A-Za-zÑñ]/.test(evt.key)) {
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
        if (currentGuess.length !== 5 || !language.validWords.includes(currentGuess)) {
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
  }, [currentWord, currentGuess, currentAttempt, isSolved, language.validWords, numAttempts]);

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, currentGuess, currentWord]);

  return (
    <div id="wordy">
      <h1>Wordy</h1>

      <label className="language-select">
        <select value={selectedLanguage} onChange={handleLanguageChange}>
          {
            Object.entries(LANGUAGES).map(([languageKey, {label}]) => (
              <option key={languageKey} value={languageKey}>{label}</option>
            ))
          }
        </select>
      </label>

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

      <Keyboard currentWord={currentWord} guesses={guesses} keyboardRows={language.keyboardRows} />

      {
        isSolved ? (
          <div className="success-message">
            <h2>Congratulations!</h2>
            <br />
            <button onClick={() => chooseNewWord()}>New Word</button>
          </div>
        ) : null
      }

      {
        (!isSolved && (currentAttempt === numAttempts)) ? (
          <div className="failure-message">
            Sorry! The correct word was:
            <h3>{currentWord}</h3>
            <button onClick={() => chooseNewWord()}>Try Again</button>
          </div>
        ) : null
      }
    </div>
  );
};
