import React from 'react';

const Keyboard = ({ usedLetters, handleKeyPress }) => {
  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '←']
  ];

  return (
    <div className="space-y-2">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-wrap justify-center space-x-1">
          {row.map((key, keyIndex) => {
            const isWide = key === 'Enter' || key === '←';
            const letter = key.toLowerCase();
            const status = usedLetters[letter];

            let bgColor = 'bg-gray-200';
            let textColor = 'text-gray-800';

            if (status === 'correct') {
              bgColor = 'bg-green-500';
              textColor = 'text-white';
            } else if (status === 'present') {
              bgColor = 'bg-yellow-500';
              textColor = 'text-white';
            } else if (status === 'absent') {
              bgColor = 'bg-gray-500';
              textColor = 'text-white';
            }

            const handleClick = () => {
              if (key === 'Enter') {
                handleKeyPress({ key: 'Enter' });
              } else if (key === '←') {
                handleKeyPress({ key: 'Backspace' });
              } else {
                handleKeyPress({ key });
              }
            };

            return (
              <button
                key={`${rowIndex}-${keyIndex}`}
                onClick={handleClick}
                className={`flex-1 min-w-[2.5rem] h-10 flex items-center justify-center rounded font-semibold ${bgColor} ${textColor} hover:opacity-90 transition-colors`}
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