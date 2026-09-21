import React from 'react';
import useGameLogic from './hooks/useGameLogic';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import Header from './components/Header';

function App() {
  const [mode, setMode] = React.useState('termo'); // termo, dueto, quarteto

  const {
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
  } = useGameLogic(mode);

  // Add keyboard listener for physical keyboard
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Determine mode label
  const modeLabels = {
    termo: 'Termo (1 tabuleiro)',
    dueto: 'Dueto (2 tabuleiros)',
    quarteto: 'Quarteto (4 tabuleiros)'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        mode={mode}
        setMode={setMode}
        modeLabels={modeLabels}
        resetGame={resetGame}
        gameStatus={gameStatus}
      />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Game Boards */}
          <div className="space-y-4">
            {/* Responsive grid layout based on mode and screen size */}
            <div className={
              `grid gap-4 ` +
              (mode === 'dueto'    ? 'grid-cols-1 md:grid-cols-2' : '') +
              (mode === 'quarteto' ? 'grid-cols-2 lg:grid-cols-4' : '') +
              (mode === 'termo'    ? 'grid-cols-1' : '')
            }>
              {targetWordsOriginal.map((targetWordOriginal, boardIndex) => (
                <Board
                  key={boardIndex}
                  boardIndex={boardIndex}
                  targetWord={targetWords[boardIndex]}
                  targetWordOriginal={targetWordOriginal}
                  guesses={guesses[boardIndex]}
                  currentRow={currentRows[boardIndex]}
                  guess={guess}
                  words={words}
                  handleKeyPress={handleKeyPress}
                  setGuess={setGuess}
                  submitGuess={submitGuess}
                  solvedBoard={solvedBoards[boardIndex]}
                  maxAttempts={maxAttempts}
                  invalidWord={invalidWord}
                />
              ))}
            </div>
          </div>

          {/* Virtual Keyboard */}
          <div className="mt-6">
            <Keyboard usedLetters={usedLetters} handleKeyPress={handleKeyPress} />
          </div>

          {/* Game Status & Info */}
          {gameStatus !== 'playing' && (
            <div className="text-center py-8">
              {gameStatus === 'won' ? (
                <div className="space-y-4">
                  <div className="text-green-600">
                    <p className="text-2xl font-bold">Parabéns! Você venceu!</p>
                    <p className="text-lg">
                      {numBoards === 1 ?
                        `A palavra era: ${targetWordsOriginal[0].toUpperCase()}` :
                        `As palavras eram: ${targetWordsOriginal.map(w => w.toUpperCase()).join(', ')}`
                      }
                    </p>
                    {/* Celebration emojis for win */}
                    <div className="text-4xl mt-2">🎉🏆✨</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-red-600">
                    <p className="text-2xl font-bold">Game Over!</p>
                    <p className="text-lg">
                      {numBoards === 1 ?
                        `A palavra era: ${targetWordsOriginal[0].toUpperCase()}` :
                        `As palavras eram: ${targetWordsOriginal.map(w => w.toUpperCase()).join(', ')}`
                      }
                    </p>
                    {/* Sad emojis for loss */}
                    <div className="text-4xl mt-2">😔💔</div>
                  </div>
                </div>
              )}
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Jogar Novamente
              </button>
            </div>
          )}

          {/* Attempts counter */}
          {!gameStatus && numBoards > 1 && (
            <div className="text-center text-sm text-gray-500">
              Tentativas restantes: {getRemainingAttempts()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;