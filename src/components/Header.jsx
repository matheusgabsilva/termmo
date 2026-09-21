import React from 'react';

const Header = ({ mode, setMode, modeLabels, resetGame, gameStatus }) => {
  const handleModeChange = (e) => {
    setMode(e.target.value);
    resetGame(); // Reset game when mode changes
  };

  return (
    <header className="text-center py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Termo Infinito</h1>
      <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o modo:</label>
          <select
            value={mode}
            onChange={handleModeChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={gameStatus !== 'playing'}
          >
            {Object.entries(modeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {!gameStatus && (
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Novo Jogo
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;