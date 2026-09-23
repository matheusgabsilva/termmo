import React, { useEffect, useRef } from 'react';
import useGameLogic from './hooks/useGameLogic';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import Header from './components/Header';

function App() {
  const [mode, setMode] = React.useState('termo');

  const {
    targetWords, targetWordsOriginal, guesses, currentRows,
    gameStatus, usedLetters, guess, handleKeyPress, resetGame,
    invalidWord, solvedBoards, numBoards, maxAttempts, getRemainingAttempts,
  } = useGameLogic(mode);

  // Padrão "latest ref": registra o listener UMA VEZ, mas sempre chama a versão atual
  const handleKeyRef = useRef(handleKeyPress);
  useEffect(() => { handleKeyRef.current = handleKeyPress; });

  useEffect(() => {
    const handler = (e) => handleKeyRef.current(e);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []); // [] = registra só uma vez

  const gridCols =
    numBoards === 1 ? 'grid-cols-1' :
    numBoards === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                     'grid-cols-2';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header mode={mode} setMode={setMode} resetGame={resetGame} gameStatus={gameStatus} />

      <main className="flex-1 flex flex-col items-center px-4 py-6 gap-6">

        <div className={`grid ${gridCols} gap-6 w-full max-w-3xl justify-items-center`}>
          {targetWords.map((targetWord, bi) => (
            <Board
              key={bi}
              targetWord={targetWord}
              guesses={guesses[bi] || []}
              currentRow={currentRows[bi]}
              guess={guess}
              solvedBoard={solvedBoards[bi]}
              maxAttempts={maxAttempts}
              invalidWord={invalidWord && !solvedBoards[bi]}
            />
          ))}
        </div>

        {gameStatus === 'playing' && numBoards > 1 && (
          <p className="text-sm text-gray-500">
            Tentativas restantes: <strong>{getRemainingAttempts()}</strong>
          </p>
        )}

        <div className="w-full max-w-lg">
          <Keyboard usedLetters={usedLetters} handleKeyPress={handleKeyPress} />
        </div>

        {gameStatus !== 'playing' && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm w-full mx-4">
              {gameStatus === 'won' ? (
                <>
                  <div className="text-5xl">🎉</div>
                  <h2 className="text-2xl font-bold text-green-600">Você venceu!</h2>
                </>
              ) : (
                <>
                  <div className="text-5xl">😔</div>
                  <h2 className="text-2xl font-bold text-red-600">Que pena!</h2>
                </>
              )}
              <p className="text-gray-600 text-center text-sm">
                {numBoards === 1 ? 'A palavra era: ' : 'As palavras eram: '}
                <strong>{targetWordsOriginal.map(w => w.toUpperCase()).join(', ')}</strong>
              </p>
              <button
                onClick={resetGame}
                className="mt-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors w-full"
              >
                Jogar Novamente
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;