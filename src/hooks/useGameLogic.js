import { useState, useEffect, useRef } from 'react';
import { removeAccents } from '../utils/normalize.js';
import wordsData from '../data/words.json';

const NORMALIZED_RESPOSTAS = wordsData.respostas.map(removeAccents);
const NORMALIZED_VALIDAS   = wordsData.validas.map(removeAccents);

const useGameLogic = (mode = 'termo') => {
  const modeConfig = {
    termo:    { boards: 1, maxAttempts: 6 },
    dueto:    { boards: 2, maxAttempts: 7 },
    quarteto: { boards: 4, maxAttempts: 9 },
  };
  const { boards: numBoards, maxAttempts } = modeConfig[mode] || modeConfig.termo;

  const [targetWords,         setTargetWords]         = useState([]);
  const [targetWordsOriginal, setTargetWordsOriginal] = useState([]);
  const [guesses,             setGuesses]             = useState([]);
  const [currentRows,         setCurrentRows]         = useState([]);
  const [gameStatus,          setGameStatus]          = useState('playing');
  const [usedLetters,         setUsedLetters]         = useState({});
  const [guess,               setGuess]               = useState('');
  const [invalidWord,         setInvalidWord]         = useState(false);
  const [solvedBoards,        setSolvedBoards]        = useState([]);

  // Refs para acessar estado atual dentro de callbacks sem stale closure
  const stateRef = useRef({
    gameStatus, guess, guesses, currentRows, solvedBoards, usedLetters, targetWords, numBoards, maxAttempts
  });

  // Keep refs in sync with state
  useEffect(() => {
    stateRef.current.gameStatus = gameStatus;
  }, [gameStatus]);

  useEffect(() => {
    stateRef.current.guess = guess;
  }, [guess]);

  useEffect(() => {
    stateRef.current.guesses = guesses;
  }, [guesses]);

  useEffect(() => {
    stateRef.current.currentRows = currentRows;
  }, [currentRows]);

  useEffect(() => {
    stateRef.current.solvedBoards = solvedBoards;
  }, [solvedBoards]);

  useEffect(() => {
    stateRef.current.usedLetters = usedLetters;
  }, [usedLetters]);

  useEffect(() => {
    stateRef.current.targetWords = targetWords;
  }, [targetWords]);

  useEffect(() => { initGame(); }, [mode]);

  const initGame = () => {
    const pool = [...wordsData.respostas];
    const targets = [], targetsOrig = [];
    for (let i = 0; i < numBoards; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      targetsOrig.push(pool[idx]);
      targets.push(removeAccents(pool[idx]));
      pool.splice(idx, 1);
    }
    setTargetWords(targets);
    setTargetWordsOriginal(targetsOrig);
    setGuesses(Array.from({ length: numBoards }, () => []));
    setCurrentRows(Array(numBoards).fill(0));
    setGameStatus('playing');
    setUsedLetters({});
    setGuess('');
    setInvalidWord(false);
    setSolvedBoards(Array(numBoards).fill(false));
  };

  const submitGuess = () => {
    const { gameStatus, guess, guesses, currentRows, solvedBoards, usedLetters, targetWords, numBoards, maxAttempts } = stateRef.current;

    if (gameStatus !== 'playing') return;
    if (guess.length !== 5) return;

    const normalizedGuess = removeAccents(guess);

    const isValid =
      NORMALIZED_RESPOSTAS.includes(normalizedGuess) ||
      NORMALIZED_VALIDAS.includes(normalizedGuess);

    if (!isValid) {
      setInvalidWord(true);
      setTimeout(() => setInvalidWord(false), 600);
      return;
    }

    const newGuesses      = guesses.map(b => [...b]);
    const newCurrentRows  = [...currentRows];
    const newSolvedBoards = [...solvedBoards];
    const newUsedLetters  = { ...usedLetters };

    for (let bi = 0; bi < numBoards; bi++) {
      if (newSolvedBoards[bi]) continue;
      if (newCurrentRows[bi] >= maxAttempts) continue;

      const target   = targetWords[bi];
      const statuses = Array(5).fill('absent');
      const counts   = {};
      for (const ch of target) counts[ch] = (counts[ch] || 0) + 1;

      for (let i = 0; i < 5; i++) {
        if (normalizedGuess[i] === target[i]) {
          statuses[i] = 'correct';
          counts[normalizedGuess[i]]--;
        }
      }
      for (let i = 0; i < 5; i++) {
        if (statuses[i] === 'absent' && counts[normalizedGuess[i]] > 0) {
          statuses[i] = 'present';
          counts[normalizedGuess[i]]--;
        }
      }

      for (let i = 0; i < 5; i++) {
        const ch = normalizedGuess[i], st = statuses[i], cur = newUsedLetters[ch];
        if (!cur || st === 'correct' || (st === 'present' && cur === 'absent')) {
          newUsedLetters[ch] = st;
        }
      }

      newGuesses[bi].push(guess);

      if (normalizedGuess === target) {
        newSolvedBoards[bi] = true;
      } else {
        newCurrentRows[bi]++;
      }
    }

    setGuesses(newGuesses);
    setCurrentRows(newCurrentRows);
    setUsedLetters(newUsedLetters);
    setSolvedBoards(newSolvedBoards);
    setGuess('');

    const allWon  = newSolvedBoards.every(Boolean);
    const anyLost = newCurrentRows.some((row, i) => !newSolvedBoards[i] && row >= maxAttempts);

    if (allWon)       setGameStatus('won');
    else if (anyLost) setGameStatus('lost');
  };

  const handleKeyPress = (e) => {
    const { gameStatus, guess } = stateRef.current;
    if (gameStatus !== 'playing') return;

    const key = e.key;
    if (key === 'Enter') {
      submitGuess();
    } else if (key === 'Backspace') {
      setGuess(g => g.slice(0, -1));
    } else if (/^[a-zA-ZÀ-ÿ]$/.test(key) && guess.length < 5) {
      setGuess(g => g + key.toLowerCase());
    }
  };

  const getRemainingAttempts = () => {
    let min = maxAttempts;
    for (let i = 0; i < numBoards; i++) {
      if (!solvedBoards[i]) {
        const rem = maxAttempts - currentRows[i];
        if (rem < min) min = rem;
      }
    }
    return Math.max(0, min);
  };

  return {
    words: wordsData, targetWords, targetWordsOriginal, guesses, currentRows,
    gameStatus, usedLetters, guess, setGuess, submitGuess, handleKeyPress,
    resetGame: initGame, invalidWord, solvedBoards, numBoards, maxAttempts,
    getRemainingAttempts,
  };
};

export default useGameLogic;