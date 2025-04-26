// import all the necessary resources
import React, { useState, useEffect, useRef } from 'react';
import AnimatedRunner from './AnimatedRunner';
import useSound from './useSound';
import { sentences } from '../data/sentences';
import startSound from '/public/assets/runner/start.mp3';
import runLoop from '/public/assets/runner/run-loop.mp3';
import applause from '/public/assets/runner/applause.mp3';


const Game = () => {
  const [sentence, setSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);
  const [wpm, setWpm] = useState(null);
  
  const { play: playStart } = useSound(startSound);
  const { play: playRun, stop: stopRun } = useSound(runLoop, true);
  const { play: playApplause } = useSound(applause);

  useEffect(() => {
    let timerInterval;
  
    if (isRunning && startTime) {
      timerInterval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 100); // updates every 0.1 second
    }
  
    if (!isRunning) {
      clearInterval(timerInterval);
    }
  
    return () => clearInterval(timerInterval);
  }, [isRunning, startTime]);
  

  const getHighlightedSentence = () => {
    return sentence.split('').map((char, index) => {
      let color = '#000'; // default
  
      if (index < userInput.length) {
        color = userInput[index] === char ? 'green' : 'red';
      }
  
      return (
        <span key={index} style={{ color }}>
          {char}
        </span>
      );
    });
  };
  
  useEffect(() => {
    setSentence(sentences[Math.floor(Math.random() * sentences.length)]);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
  
    if (!startTime && value.length === 1) {
      const start = Date.now();
      setStartTime(start);
      setIsRunning(true);
      playStart();
      playRun();
    }
  
    if (value === sentence) {
      const end = Date.now();
      setEndTime(end);
      setIsRunning(false);
      stopRun();
      playApplause();
  
      const timeTakenMinutes = (end - startTime) / 1000 / 60;
      const wordsTyped = sentence.length / 5;
      const calculatedWPM = Math.floor(wordsTyped / timeTakenMinutes);
      setWpm(calculatedWPM);
    }
  };
  
  const handleReset = () => {
    setSentence(sentences[Math.floor(Math.random() * sentences.length)]);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsRunning(false);
  };

  const timeTaken = endTime && startTime ? ((endTime - startTime) / 1000).toFixed(2) : null;

  return (
    <div>
      <AnimatedRunner
        isRunning={isRunning}
        progress={(userInput.length / sentence.length) * 100}
      />


      <div className="timer">
      {startTime && !endTime && currentTime && (
       <span>Time: {((currentTime - startTime) / 1000).toFixed(2)}s</span>
)}
        {
        timeTaken && <>
        <span>Completed in: {timeTaken}s</span> <br />
        <span className="timer"> Your Speed: {wpm} WPM</span>
        </>
        }
      </div>

      <div className="typing-box">
      <p>{getHighlightedSentence()}</p>
        <textarea
          value={userInput}
          onChange={handleChange}
          rows="3"
          placeholder="Start typing..."
        />
      </div>

      {timeTaken && (
  <>
    <button onClick={handleReset}>Play Again</button>
  </>
)}

    </div>
  );
};

export default Game;