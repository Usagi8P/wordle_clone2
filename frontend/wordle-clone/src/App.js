import './App.css';

import {useEffect, useState} from 'react';


function KeyboardListener({ onKeyPress, gameOver }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
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
      return 'Square wrong_letter';
    case 'correct_letter':
      return 'Square correct_letter';
    case 'correct_location':
      return 'Square correct_location';
    case null:
    case '':
      return 'Square'
    default:
      return 'Square'
  }
}

function Board( {guessHistory, hintHistory} ) {
  return (
    <>
      <div className='guessRow'>
        <div className={setLetterClass(hintHistory[0][0])}>{guessHistory[0][0]}</div>
        <div className={setLetterClass(hintHistory[0][1])}>{guessHistory[0][1]}</div>
        <div className={setLetterClass(hintHistory[0][2])}>{guessHistory[0][2]}</div>
        <div className={setLetterClass(hintHistory[0][3])}>{guessHistory[0][3]}</div>
        <div className={setLetterClass(hintHistory[0][4])}>{guessHistory[0][4]}</div>
      </div>
      <div className='guessRow'>
        <div className={setLetterClass(hintHistory[1][0])}>{guessHistory[1][0]}</div>
        <div className={setLetterClass(hintHistory[1][1])}>{guessHistory[1][1]}</div>
        <div className={setLetterClass(hintHistory[1][2])}>{guessHistory[1][2]}</div>
        <div className={setLetterClass(hintHistory[1][3])}>{guessHistory[1][3]}</div>
        <div className={setLetterClass(hintHistory[1][4])}>{guessHistory[1][4]}</div>
      </div>
      <div className='guessRow'>
        <div className={setLetterClass(hintHistory[2][0])}>{guessHistory[2][0]}</div>
        <div className={setLetterClass(hintHistory[2][1])}>{guessHistory[2][1]}</div>
        <div className={setLetterClass(hintHistory[2][2])}>{guessHistory[2][2]}</div>
        <div className={setLetterClass(hintHistory[2][3])}>{guessHistory[2][3]}</div>
        <div className={setLetterClass(hintHistory[2][4])}>{guessHistory[2][4]}</div>
      </div>
      <div className='guessRow'>
        <div className={setLetterClass(hintHistory[3][0])}>{guessHistory[3][0]}</div>
        <div className={setLetterClass(hintHistory[3][1])}>{guessHistory[3][1]}</div>
        <div className={setLetterClass(hintHistory[3][2])}>{guessHistory[3][2]}</div>
        <div className={setLetterClass(hintHistory[3][3])}>{guessHistory[3][3]}</div>
        <div className={setLetterClass(hintHistory[3][4])}>{guessHistory[3][4]}</div>
      </div>
      <div className='guessRow'>
        <div className={setLetterClass(hintHistory[4][0])}>{guessHistory[4][0]}</div>
        <div className={setLetterClass(hintHistory[4][1])}>{guessHistory[4][1]}</div>
        <div className={setLetterClass(hintHistory[4][2])}>{guessHistory[4][2]}</div>
        <div className={setLetterClass(hintHistory[4][3])}>{guessHistory[4][3]}</div>
        <div className={setLetterClass(hintHistory[4][4])}>{guessHistory[4][4]}</div>
      </div>
      <div className='guessRow'>
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
  const [isWin, setIsWin] = useState(false);
  
  const resetGame = () => {
    setGuessIndex(0);
    setGameOver(false);
    setIsWin(false);
    const newGuessHistory = Array(6).fill(Array(5).fill(null));
    setGuessHistory(newGuessHistory);
    const newHintHistory = Array(6).fill(Array(5).fill(null));
    setHintHistory(newHintHistory);
  }

  const showFlashMessage = (message, duration = 2000) => {
    setFlashMessage(message);
    setShowFlash(true);

    setTimeout(() => {
      setShowFlash(false);
    }, duration);
  };

  const validateGuess = async(currentGuess) => {
    if (currentGuess.findIndex(element => element === null) !== -1) {
      showFlashMessage('Too Short');
      return;
    }
    
    try {
      const response = await fetch('/validate-guess',{
        method:'POST',
        headers:{'Content-Type':'application/json',},
        body: JSON.stringify({ currentGuess })
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
  
    console.log(key);

    if (!isLetter & !isBackspace & !isEnter) {
      return null;
    }
    
    const newGuessIndex = currentGuess.findIndex(element => element === null);
    const newGuess = [...currentGuess];

    if (isEnter) {
      validateGuess(currentGuess)
        .then(data => {
          console.log(data.result)
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
            setIsWin(true);
          } else if (data.result === 'not valid') {
            showFlashMessage('Not in word list')
          }
        })
        .catch(error => {
          console.error('Error:', error);
        })
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
    if (isWin && gameOver) {
      return(
        <div>
          <div>
            "Congratulations!"
          </div>
          <button onClick={resetGame}>"Play Again"</button>
        </div>)
    }
    if (!isWin && gameOver) {
      return(
        <div>
          <div>
            "Too bad! Try again :)"
          </div>
          <button onClick={resetGame}>"Play Again"</button>
        </div>)
    }
  }

  return (
    <>
      {!gameOver && <KeyboardListener onKeyPress={handleKeyboardInput} /> }
      <div>
        {showFlash && (
          <div> {flashMessage} </div>
        )}</div>
      <div>{JSON.stringify(response)}</div>
      <Board guessHistory={guessHistory} hintHistory={hintHistory}/>
      <button onClick={resetGame}>"Reset Game"</button>
      {gameOverText()}
    </>
  );
}

export default App;
