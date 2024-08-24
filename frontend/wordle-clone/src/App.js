import logo from './logo.svg';
import './App.css';

import {useEffect, useState} from 'react';


function KeyboardListener({ onKeyPress }) {
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

function Board( {guessHistory} ) {
  return (
    <>
      <div className='guessRow'>
        <div className='Square'>{guessHistory[0][0]}</div>
        <div className='Square'>{guessHistory[0][1]}</div>
        <div className='Square'>{guessHistory[0][2]}</div>
        <div className='Square'>{guessHistory[0][3]}</div>
        <div className='Square'>{guessHistory[0][4]}</div>
      </div>
      <div className='guessRow'>
        <div className='Square'>{guessHistory[1][0]}</div>
        <div className='Square'>{guessHistory[1][1]}</div>
        <div className='Square'>{guessHistory[1][2]}</div>
        <div className='Square'>{guessHistory[1][3]}</div>
        <div className='Square'>{guessHistory[1][4]}</div>
      </div>
      <div className='guessRow'>
        <div className='Square'>{guessHistory[2][0]}</div>
        <div className='Square'>{guessHistory[2][1]}</div>
        <div className='Square'>{guessHistory[2][2]}</div>
        <div className='Square'>{guessHistory[2][3]}</div>
        <div className='Square'>{guessHistory[2][4]}</div>
      </div>
      <div className='guessRow'>
        <div className='Square'>{guessHistory[3][0]}</div>
        <div className='Square'>{guessHistory[3][1]}</div>
        <div className='Square'>{guessHistory[3][2]}</div>
        <div className='Square'>{guessHistory[3][3]}</div>
        <div className='Square'>{guessHistory[3][4]}</div>
      </div>
      <div className='guessRow'>
        <div className='Square'>{guessHistory[4][0]}</div>
        <div className='Square'>{guessHistory[4][1]}</div>
        <div className='Square'>{guessHistory[4][2]}</div>
        <div className='Square'>{guessHistory[4][3]}</div>
        <div className='Square'>{guessHistory[4][4]}</div>
      </div>
      <div className='guessRow'>
        <div className='Square'>{guessHistory[5][0]}</div>
        <div className='Square'>{guessHistory[5][1]}</div>
        <div className='Square'>{guessHistory[5][2]}</div>
        <div className='Square'>{guessHistory[5][3]}</div>
        <div className='Square'>{guessHistory[5][4]}</div>
      </div>
    </>
  );
}

function App() {
  // The array is one element longer to hide user input when the game is over.
  const [guessHistory, setGuessHistory] = useState(Array(7).fill(Array(5).fill(null)));
  const [guessIndex, setGuessIndex] = useState(0);
  const currentGuess = guessHistory[guessIndex];
  const [responseMessage, setResponseMessge] = useState('');
  
  const validateGuess = async(currentGuess) => {
    try {
      const response = await fetch('/validate-guess',{
        method:'POST',
        headers:{'Content-Type':'application/json',},
        body: JSON.stringify({ currentGuess })
      });
      
      const data = await response.json();
      setResponseMessge(data.result);
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
            const newGuessIndex = guessIndex + 1;
            setGuessIndex(newGuessIndex);
          } else if (data.result === 'correct') {
            const newGuessIndex = guessHistory.length - 1;
            setGuessIndex(newGuessIndex);
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
  
  const [hello, setHello] = useState('test');
  useEffect (() => {
    fetch('/hello').then(res => res.json()).then(data => {
      setHello(data.return);
    });
  },[]);


  return (
    <>
      <KeyboardListener onKeyPress={handleKeyboardInput} />
      <div>{hello}</div>
      <Board guessHistory={guessHistory} />
      <div>{responseMessage}</div>
    </>
  );
}

export default App;
