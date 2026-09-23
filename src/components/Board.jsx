import React, { useState, useEffect, useRef } from 'react';
import Row from './Row';
import { removeAccents } from '../utils/normalize.js';

const calcStatuses = (normalizedGuess, normalizedTarget) => {
  const statuses = Array(5).fill('absent');
  const counts   = {};
  for (const ch of normalizedTarget) counts[ch] = (counts[ch] || 0) + 1;
  for (let i = 0; i < 5; i++) {
    if (normalizedGuess[i] === normalizedTarget[i]) {
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
  return statuses;
};

const Board = ({ targetWord, guesses, guess, solvedBoard, maxAttempts, invalidWord }) => {
  const [revealedRows, setRevealedRows] = useState(new Set());
  const prevLen = useRef(0);

  useEffect(() => {
    if (guesses.length > prevLen.current) {
      const newRow = guesses.length - 1;
      setRevealedRows(prev => new Set([...prev, newRow]));
      prevLen.current = guesses.length;
    }
  }, [guesses.length]);

  return (
    <div className="flex flex-col items-center gap-1">
      {Array.from({ length: maxAttempts }, (_, rowIndex) => {
        const isCompleted = rowIndex < guesses.length;
        const isActive    = rowIndex === guesses.length && !solvedBoard;
        let letters = [], statuses = Array(5).fill('');

        if (isCompleted) {
          letters  = guesses[rowIndex].split('');
          statuses = calcStatuses(removeAccents(guesses[rowIndex]), targetWord);
        } else if (isActive) {
          letters = guess.split('');
        }

        return (
          <Row
            key={rowIndex}
            letters={letters}
            statuses={statuses}
            isActive={isActive}
            isInvalid={isActive && invalidWord}
            isRevealed={revealedRows.has(rowIndex)}
          />
        );
      })}
      {solvedBoard && (
        <div className="text-green-600 text-sm font-semibold mt-1">✓ Resolvido!</div>
      )}
    </div>
  );
};

export default Board;