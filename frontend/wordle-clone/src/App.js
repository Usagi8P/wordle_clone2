import './App.css';

import {useEffect, useState} from 'react';


function KeyboardListener({ onKeyPress }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Backspace') {
        event.preventDefault()
      }
      if (event.key === 'Enter') {
        event.preventDefault();
      }

      onKeyPress(event);
    };

    window.addEventListener('keydown',handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  },[onKeyPress]);

  return null;
}

function setLetterClass(result) {
  switch(result) {
    case 'wrong_letter':
      return 'animate-scaleIn size-16 border-2 border-solid border-slate-700 text-center content-center m-1 bg-gray-400';
    case 'correct_letter':
      return 'animate-scaleIn size-16 border-2 border-solid border-slate-700 text-center content-center m-1 bg-yellow-400';
    case 'correct_location':
      return 'animate-scaleIn size-16 border-2 border-solid border-slate-700 text-center content-center m-1 bg-green-400';
    case null:
    case '':
    default:
      return 'size-16 border-2 border-solid border-slate-700 text-center content-center m-1'
  }
}

function Board( {guessHistory, hintHistory} ) {
  return (
    <>
      <div className='flex w-full'>
        <div className={setLetterClass(hintHistory[0][0])}>{guessHistory[0][0]}</div>
        <div className={setLetterClass(hintHistory[0][1])}>{guessHistory[0][1]}</div>
        <div className={setLetterClass(hintHistory[0][2])}>{guessHistory[0][2]}</div>
        <div className={setLetterClass(hintHistory[0][3])}>{guessHistory[0][3]}</div>
        <div className={setLetterClass(hintHistory[0][4])}>{guessHistory[0][4]}</div>
      </div>
      <div className='flex w-full'>
        <div className={setLetterClass(hintHistory[1][0])}>{guessHistory[1][0]}</div>
        <div className={setLetterClass(hintHistory[1][1])}>{guessHistory[1][1]}</div>
        <div className={setLetterClass(hintHistory[1][2])}>{guessHistory[1][2]}</div>
        <div className={setLetterClass(hintHistory[1][3])}>{guessHistory[1][3]}</div>
        <div className={setLetterClass(hintHistory[1][4])}>{guessHistory[1][4]}</div>
      </div>
      <div className='flex w-full'>
        <div className={setLetterClass(hintHistory[2][0])}>{guessHistory[2][0]}</div>
        <div className={setLetterClass(hintHistory[2][1])}>{guessHistory[2][1]}</div>
        <div className={setLetterClass(hintHistory[2][2])}>{guessHistory[2][2]}</div>
        <div className={setLetterClass(hintHistory[2][3])}>{guessHistory[2][3]}</div>
        <div className={setLetterClass(hintHistory[2][4])}>{guessHistory[2][4]}</div>
      </div>
      <div className='flex w-full'>
        <div className={setLetterClass(hintHistory[3][0])}>{guessHistory[3][0]}</div>
        <div className={setLetterClass(hintHistory[3][1])}>{guessHistory[3][1]}</div>
        <div className={setLetterClass(hintHistory[3][2])}>{guessHistory[3][2]}</div>
        <div className={setLetterClass(hintHistory[3][3])}>{guessHistory[3][3]}</div>
        <div className={setLetterClass(hintHistory[3][4])}>{guessHistory[3][4]}</div>
      </div>
      <div className='flex w-full'>
        <div className={setLetterClass(hintHistory[4][0])}>{guessHistory[4][0]}</div>
        <div className={setLetterClass(hintHistory[4][1])}>{guessHistory[4][1]}</div>
        <div className={setLetterClass(hintHistory[4][2])}>{guessHistory[4][2]}</div>
        <div className={setLetterClass(hintHistory[4][3])}>{guessHistory[4][3]}</div>
        <div className={setLetterClass(hintHistory[4][4])}>{guessHistory[4][4]}</div>
      </div>
      <div className='flex w-full'>
        <div className={setLetterClass(hintHistory[5][0])}>{guessHistory[5][0]}</div>
        <div className={setLetterClass(hintHistory[5][1])}>{guessHistory[5][1]}</div>
        <div className={setLetterClass(hintHistory[5][2])}>{guessHistory[5][2]}</div>
        <div className={setLetterClass(hintHistory[5][3])}>{guessHistory[5][3]}</div>
        <div className={setLetterClass(hintHistory[5][4])}>{guessHistory[5][4]}</div>
      </div>
    </>
  );
}

function App() {
  const [guessHistory, setGuessHistory] = useState(Array(6).fill(Array(5).fill(null)));
  const [hintHistory, setHintHistory] = useState(Array(6).fill(Array(5).fill(null)));
  const [guessIndex, setGuessIndex] = useState(0);
  const currentGuess = guessHistory[guessIndex];
  const [response, setResponse] = useState({});
  const [flashMessage, setFlashMessage] = useState('');
  const [showFlash, setShowFlash] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const resetGame = async() => {
    try {
      const response = await fetch('/reset-game',{
        method:'POST',
        headers:{'Content-Type':'application/json'}
      });
      
      const data = await response.json();
      
      setGuessIndex(0);
      setGameOver(false);
      const newGuessHistory = Array(6).fill(Array(5).fill(null));
      setGuessHistory(newGuessHistory);
      const newHintHistory = Array(6).fill(Array(5).fill(null));
      setHintHistory(newHintHistory);

    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const showFlashMessage = (message, duration = 2000) => {
    setFlashMessage(message);
    setShowFlash(true);

    setTimeout(() => {
      setShowFlash(false);
    }, duration);
  };

  const validateGuess = async(currentGuess, guessIndex) => {    
    try {
      const response = await fetch('/validate-guess',{
        method:'POST',
        headers:{'Content-Type':'application/json',},
        body: JSON.stringify({ currentGuess, guessIndex })
      });
      
      const data = await response.json();
      setResponse(data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  function handleKeyboardInput(keyboardInput) {
    const key = keyboardInput.key;
    const isLetter = /^[a-zA-Z]$/.test(key);
    const isBackspace = key === 'Backspace';
    const isEnter = key === 'Enter';
  
    if (!isLetter & !isBackspace & !isEnter) {
      return null;
    }
    
    const newGuessIndex = currentGuess.findIndex(element => element === null);
    const newGuess = [...currentGuess];

    if (isEnter) {
      if (currentGuess.findIndex(element => element === null) !== -1) {
        showFlashMessage('Too short');
        return;
      } else {
          validateGuess(currentGuess, guessIndex)
            .then(data => {
              if (data.result === 'valid') {
                const newHintHistory = [...hintHistory];
                newHintHistory[guessIndex] = [data.letter0, data.letter1, data.letter2, data.letter3, data.letter4];
                setHintHistory(newHintHistory); 
                const newGuessIndex = guessIndex + 1;
                setGuessIndex(newGuessIndex);
                if (newGuessIndex === 6) {
                  setGameOver(true);
                }
              } else if (data.result === 'correct') {
                const newHintHistory = [...hintHistory];
                newHintHistory[guessIndex] = [data.letter0, data.letter1, data.letter2, data.letter3, data.letter4];
                setHintHistory(newHintHistory); 
                const newGuessIndex = guessHistory.length - 1;
                setGuessIndex(newGuessIndex);
                setGameOver(true);
              } else if (data.result === 'not valid') {
                showFlashMessage('Not in word list')
              }
            })
            .catch(error => {
              console.error('Error:', error);
            })
        }
      }

    
    if (isBackspace) {
      if (newGuessIndex === 0){
        return null;
      }
      if (newGuessIndex === -1) {
        const backspaceIndex = 4;
        newGuess[backspaceIndex] = null;
      } else {
        const backspaceIndex = newGuessIndex - 1;
        newGuess[backspaceIndex] = null;
      }
    }
    
    if (isLetter & newGuessIndex !== -1) {
      newGuess[newGuessIndex] = key.toUpperCase();
    }

    const newGuessHistory = [...guessHistory];
    newGuessHistory[guessIndex] = newGuess;
    setGuessHistory(newGuessHistory);
  }

  const gameOverText = () => {
    let gameOverMessage = "Try again!"
    if (response.result === 'correct' && gameOver) {
      gameOverMessage = "Congratulations!"
    }
    return(
      <div className='absolute top-0 left-0 w-full z-10 flex justify-center items-center translate-y-1/2 font-serif'>
        <div className='w-fit h-fit bg-white rounded-md border-solid border-2 border-slate-700'>
          <div className='font-black w-full text-5xl mt-5 p-5'>
            <div>{gameOverMessage}</div>
            <div>The answer was: {response.solutionWord}</div>
          </div>
          <div className='p-3'>
            <button onClick={resetGame} className='border-solid border-slate-700 text-slate-950 border-2 font-serif text-xl rounded-md px-1.5 py-1'>
              Play Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {!gameOver && <KeyboardListener onKeyPress={handleKeyboardInput} /> }
      {gameOver && gameOverText()}
      <div className='font-serif'>
        <div className='flex justify-center font-black text-5xl mt-5'>
          <h1>Wordle-Clone</h1>
        </div>
        <div className='flex justify-center text-xl mb-3'>
          <h2>(A copy of the popular game by the NY Times)</h2>
        </div>
        {showFlash && (
          <div className='absolute left-1/2 -translate-x-1/2 bg-gray-500 text-gray-50 text-xl rounded-md py-0.5 px-1'>
            {flashMessage}
          </div>
        )}
      </div>
      <div className='flex w-full justify-center'>
        <div className='flex flex-col items-start'>
          <div className='font-serif text-4xl font-black mt-8 mb-5'>
            <Board guessHistory={guessHistory} hintHistory={hintHistory}/>
          </div>
          <div>
            <button onClick={resetGame} className='border-solid border-slate-700 text-slate-950 border-2 font-serif text-xl rounded-md px-1.5 py-1'>
              Reset Game
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
