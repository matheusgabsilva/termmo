import React from 'react';

const ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

const STATUS_CLS = {
  correct: 'bg-green-500  text-white border-green-500',
  present: 'bg-yellow-500 text-white border-yellow-500',
  absent:  'bg-gray-500   text-white border-gray-500',
  default: 'bg-gray-200   text-gray-800 border-gray-300',
};

const Keyboard = ({ usedLetters, handleKeyPress }) => {
  const onKey = (key) => {
    if (key === 'ENTER') handleKeyPress({ key: 'Enter' });
    else if (key === '⌫') handleKeyPress({ key: 'Backspace' });
    else handleKeyPress({ key: key.toLowerCase() });
  };

  return (
    <div className="flex flex-col items-center gap-1 w-full max-w-lg mx-auto select-none">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1 justify-center w-full">
          {row.map((key) => {
            const isWide = key === 'ENTER' || key === '⌫';
            const cls    = STATUS_CLS[usedLetters[key.toLowerCase()] || 'default'];
            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                className={`flex items-center justify-center h-14 rounded border
                            font-semibold text-sm transition-colors active:scale-95
                            ${isWide ? 'px-3 min-w-[3.5rem]' : 'w-9 sm:w-10'} ${cls}`}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;