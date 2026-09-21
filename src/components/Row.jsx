import React from 'react';

const Row = ({ letters, statuses, index, currentRow, guess, setGuess, submitGuess, words, invalidWord, flipped }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (guess.length === 5) {
        // Check if word is valid
        const normalizedGuess = guess.toLowerCase();
        if (words.validas.includes(normalizedGuess) || words.respostas.includes(normalizedGuess)) {
          submitGuess();
        }
        // Invalid word - shake effect will be handled by invalidWord prop
      }
    } else if (e.key === 'Backspace') {
      setGuess(guess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key) && guess.length < 5) {
      setGuess(guess + e.key.toLowerCase());
    }
  };

  // Ensure we always have 5 columns
  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < 5; i++) {
      const letter = letters[i] ?? '';
      const status = statuses[i] ?? '';
      cells.push(
        <div
          key={i}
          className={`w-10 h-10 flex items-center justify-center text-lg font-bold rounded border border-gray-300 ${status === 'correct'
            ? 'bg-green-500 text-white'
            : status === 'present'
            ? 'bg-yellow-500 text-white'
            : status === 'absent'
            ? 'bg-gray-300 text-black'
            : 'bg-white text-gray-600'} transition-all duration-300 ${index === currentRow && guess.length > i ? 'animate-pulse' : ''} ${flipped ? 'flip-in-horizontal' : ''}`}
        >
          {letter}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className={`flex space-x-1 mb-2 ${invalidWord && index === currentRow ? 'animate-shake' : ''} ${flipped ? 'flip-animation' : ''}`}>
      {renderCells()}
    </div>
  );
};

export default Row;