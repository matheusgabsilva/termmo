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
      {/* Past guesses */}
      {guesses.map((guessWord, rowIndex) => (
        <Row
          key={rowIndex}
          letters={guessWord.split('')}
          statuses={calculateStatuses(guessWord, targetWord)}
          index={rowIndex}
          currentRow={currentRow}
          guess={guess}
          setGuess={setGuess}
          submitGuess={submitGuess}
          words={words}
          flipped={flippedRows.has(rowIndex)}
        />
      ))}

      {/* Current row for input */}
      <Row
        letters={guess.split('')}
        statuses={Array(5).fill('')}
        index={currentRow}
        currentRow={currentRow}
        guess={guess}
        setGuess={setGuess}
        submitGuess={submitGuess}
        words={words}
        invalidWord={invalidWord && !solvedBoard && currentRow === guesses.length} // Only show shake for current row if invalid
        flipped={false} // Current row doesn't flip until submitted
      />

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