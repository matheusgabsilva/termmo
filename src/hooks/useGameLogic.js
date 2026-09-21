import { useState, useEffect } from 'react';
import { removeAccents } from '../utils/normalize.js';
import wordsData from '../data/words.json';

const useGameLogic = (mode = 'termo') => {
  // Mode configuration: { boards, maxAttempts }
  const modeConfig = {
    termo: { boards: 1, maxAttempts: 6 },
    dueto: { boards: 2, maxAttempts: 7 },
    quarteto: { boards: 4, maxAttempts: 9 }
  };

  const { boards: numBoards, maxAttempts } = modeConfig[mode] || modeConfig.termo;

  const [words, setWords] = useState(wordsData);
  const [targetWords, setTargetWords] = useState([]); // Array of target words (without accents)
  const [targetWordsOriginal, setTargetWordsOriginal] = useState([]); // Array of target words (with original accents for display)
  const [guesses, setGuesses] = useState(Array(numBoards).fill().map(() => Array(maxAttempts).fill(''))); // [board][attempt]
  const [currentRows, setCurrentRows] = useState(Array(numBoards).fill(0)); // Current row for each board
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
  const [usedLetters, setUsedLetters] = useState({}); // { letter: status } - aggregated across all boards
  const [guess, setGuess] = useState('');
  const [invalidWord, setInvalidWord] = useState(false);
  const [solvedBoards, setSolvedBoards] = useState(Array(numBoards).fill(false)); // Which boards are solved

  // Initialize game with random words
  useEffect(() => {
    initGame();
  }, [mode, numBoards, maxAttempts]);

  const initGame = () => {
    // Select random words from respostas
    const selectedTargetWords = [];
    const selectedTargetWordsOriginal = [];

    for (let i = 0; i < numBoards; i++) {
      const randomIndex = Math.floor(Math.random() * words.respostas.length);
      const selectedWord = words.respostas[randomIndex];
      selectedTargetWords.push(removeAccents(selectedWord));
      selectedTargetWordsOriginal.push(selectedWord);
    }

    setTargetWords(selectedTargetWords);
    setTargetWordsOriginal(selectedTargetWordsOriginal);
    setGuesses(Array(numBoards).fill().map(() => Array(maxAttempts).fill('')));
    setCurrentRows(Array(numBoards).fill(0));
    setGameStatus('playing');
    setUsedLetters({});
    setGuess('');
    setInvalidWord(false);
    setSolvedBoards(Array(numBoards).fill(false));
  };

  const submitGuess = () => {
    if (gameStatus !== 'playing') return;

    const normalizedGuess = removeAccents(guess.toLowerCase());

    // Check if word is valid
    const isValid = words.validas.includes(normalizedGuess) || words.respostas.includes(normalizedGuess);

    if (!isValid) {
      setInvalidWord(true);
      // Reset after shake animation completes
      setTimeout(() => setInvalidWord(false), 500);
      return;
    }

    // Process guess for each active (unsolved) board
    const newGuesses = [...guesses];
    const newCurrentRows = [...currentRows];
    const newSolvedBoards = [...solvedBoards];
    const newUsedLetters = { ...usedLetters };

    let anyBoardUpdated = false;

    for (let boardIndex = 0; boardIndex < numBoards; boardIndex++) {
      // Skip if board is already solved
      if (solvedBoards[boardIndex]) continue;

      // Skip if we've used all attempts for this board
      if (currentRows[boardIndex] >= maxAttempts) continue;

      anyBoardUpdated = true;

      const targetWord = targetWords[boardIndex];

      // Calculate letter statuses for this board
      const letterStatuses = Array(5).fill('absent');
      const wordLetterCounts = {};

      // Count letters in target word for yellow/green logic
      for (const letter of targetWord) {
        wordLetterCounts[letter] = (wordLetterCounts[letter] || 0) + 1;
      }

      // First pass: check for correct letters (green)
      for (let i = 0; i < 5; i++) {
        if (normalizedGuess[i] === targetWord[i]) {
          letterStatuses[i] = 'correct';
          wordLetterCounts[normalizedGuess[i]]--;
        }
      }

      // Second pass: check for present letters (yellow)
      for (let i = 0; i < 5; i++) {
        if (letterStatuses[i] === 'absent' && wordLetterCounts[normalizedGuess[i]] > 0) {
          letterStatuses[i] = 'present';
          wordLetterCounts[normalizedGuess[i]]--;
        }
      }

      // Update guesses for this board
      newGuesses[boardIndex][currentRows[boardIndex]] = guess;

      // Update used letters with priority logic (across all boards)
      for (let i = 0; i < 5; i++) {
        const letter = normalizedGuess[i];
        const status = letterStatuses[i];

        // Priority: correct > present > absent
        if (!newUsedLetters[letter] ||
            (status === 'correct' && newUsedLetters[letter] !== 'correct') ||
            (status === 'present' && newUsedLetters[letter] === 'absent')) {
          newUsedLetters[letter] = status;
        }
      }

      // Check if this board is now solved
      if (guess.toLowerCase() === targetWord) {
        newSolvedBoards[boardIndex] = true;
      } else {
        // Move to next row for this board
        newCurrentRows[boardIndex] = currentRows[boardIndex] + 1;
      }
    }

    // Only update state if we actually processed the guess
    if (anyBoardUpdated) {
      setGuesses(newGuesses);
      setCurrentRows(newCurrentRows);
      setUsedLetters(newUsedLetters);
      setSolvedBoards(newSolvedBoards);

      // Check win/lose conditions
      const allBoardsSolved = solvedBoards.every(solved => solved);
      const attemptsExhausted = currentRows.some((row, index) =>
        !solvedBoards[index] && row >= maxAttempts
      );

      if (allBoardsSolved) {
        setGameStatus('won');
      } else if (attemptsExhausted) {
        setGameStatus('lost');
      }

      setGuess('');
    }
  };

  const handleKeyPress = (e) => {
    if (gameStatus !== 'playing') return;

    if (e.key === 'Enter') {
      if (guess.length === 5) {
        submitGuess();
      }
    } else if (e.key === 'Backspace') {
      setGuess(guess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key) && guess.length < 5) {
      setGuess(guess + e.key.toLowerCase());
    }
  };

  const resetGame = () => {
    initGame();
  };

  // Calculate remaining attempts (minimum across all active boards)
  const getRemainingAttempts = () => {
    let minAttempts = maxAttempts;
    for (let i = 0; i < numBoards; i++) {
      if (!solvedBoards[i]) {
        const attemptsUsed = currentRows[i];
        const remaining = maxAttempts - attemptsUsed;
        if (remaining < minAttempts) minAttempts = remaining;
      }
    }
    return Math.max(0, minAttempts);
  };

  return {
    words,
    targetWords,
    targetWordsOriginal,
    guesses,
    currentRows,
    gameStatus,
    usedLetters,
    guess,
    setGuess,
    submitGuess,
    handleKeyPress,
    resetGame,
    invalidWord,
    solvedBoards,
    numBoards,
    maxAttempts,
    getRemainingAttempts
  };
};

export default useGameLogic;