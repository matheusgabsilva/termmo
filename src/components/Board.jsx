import React, { useState } from 'react';
import Row from './Row';

const Board = ({
  boardIndex,
  targetWord,
  targetWordOriginal,
  guesses,
  currentRow,
  guess,
  words,
  handleKeyPress,
  setGuess,
  submitGuess,
  solvedBoard,
  maxAttempts,
  invalidWord
}) => {
  const [flippedRows, setFlippedRows] = useState(new Set());

  // Calculate statuses for a guess word
  const calculateStatuses = (guessWord, targetWord) => {
    if (!guessWord || guessWord.length !== 5) return Array(5).fill('');

    const normalizedGuess = guessWord.toLowerCase();
    const normalizedTarget = targetWord.toLowerCase();

    // Remove accents for comparison
    const removeAccents = (str) => {
      return str
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase();
    };

    const cleanGuess = removeAccents(normalizedGuess);
    const cleanTarget = removeAccents(normalizedTarget);

    const letterStatuses = Array(5).fill('absent');
    const targetLetterCounts = {};

    // Count letters in target word
    for (const letter of cleanTarget) {
      targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
    }

    // First pass: correct letters
    for (let i = 0; i < 5; i++) {
      if (cleanGuess[i] === cleanTarget[i]) {
        letterStatuses[i] = 'correct';
        targetLetterCounts[cleanGuess[i]]--;
      }
    }

    // Second pass: present letters
    for (let i = 0; i < 5; i++) {
      if (
        letterStatuses[i] === 'absent' &&
        targetLetterCounts[cleanGuess[i]] > 0
      ) {
        letterStatuses[i] = 'present';
        targetLetterCounts[cleanGuess[i]]--;
      }
    }

    return letterStatuses;
  };

  // Handle when a guess is submitted - flip the row that was just completed
  React.useEffect(() => {
    // This effect runs when guesses changes
    // Find newly completed rows and flip them
    const newGuesses = guesses;
    const flipped = new Set(flippedRows);

    newGuesses.forEach((guessWord, rowIndex) => {
      // If this row has a guess and hasn't been flipped yet, flip it
      if (guessWord && guessWord.length === 5 && !flipped.has(rowIndex)) {
        flipped.add(rowIndex);
      }
    });

    setFlippedRows(flipped);
  }, [guesses]);

  return (
    <div className="space-y-2">
      {/* Render exactly maxAttempts rows */}
      {Array.from({ length: maxAttempts }, (_, i) => {
        // Determine the guess word for this row
        let guessWord = '';
        if (i < guesses.length) {
          guessWord = guesses[i];
        } else if (i === currentRow) {
          guessWord = guess;
        }
        // else guessWord remains empty string

        // Determine statuses for this row
        const statuses =
          i < guesses.length
            ? calculateStatuses(guessWord, targetWord)
            : Array(5).fill('');

        // Determine if this row should shake (invalid word on current row)
        const showShake =
          invalidWord && !solvedBoard && i === currentRow;

        // Determine if this row is flipped (only completed guesses flip)
        const isFlipped = flippedRows.has(i);

        return (
          <Row
            key={i}
            letters={guessWord.split('')}
            statuses={statuses}
            index={i}
            currentRow={currentRow}
            guess={guessWord}
            setGuess={setGuess}
            submitGuess={submitGuess}
            words={words}
            invalidWord={showShake}
            flipped={isFlipped}
          />
        );
      })}

      {/* Win/Lost indicator for this specific board */}
      {solvedBoard && (
        <div className="text-center text-sm text-green-600 mt-1">
          ✓ Resolvido
        </div>
      )}
    </div>
  );
};

export default Board;