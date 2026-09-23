import React from 'react';

const Row = ({ letters, statuses, isActive, isInvalid, isRevealed }) => {
  return (
    <div className={`flex gap-1 ${isInvalid ? 'animate-shake' : ''}`}>
      {Array.from({ length: 5 }, (_, i) => {
        const letter = letters[i] || '';
        const status = statuses[i] || '';
        let bg = 'bg-white border-2 border-gray-300', text = 'text-gray-800';

        if      (status === 'correct') { bg = 'bg-green-500  border-green-500';  text = 'text-white'; }
        else if (status === 'present') { bg = 'bg-yellow-500 border-yellow-500'; text = 'text-white'; }
        else if (status === 'absent')  { bg = 'bg-gray-400   border-gray-400';   text = 'text-white'; }
        else if (isActive && letter)   { bg = 'bg-white border-2 border-gray-500'; }

        return (
          <div
            key={i}
            className={`w-12 h-12 flex items-center justify-center text-xl font-bold
                        rounded uppercase select-none transition-colors
                        ${bg} ${text} ${isRevealed && status ? 'animate-flip' : ''}`}
          >
            {letter.toUpperCase()}
          </div>
        );
      })}
    </div>
  );
};

export default Row;