import { useEffect, useState } from 'react';

function Timer({ dispatch, numQuestions, SECS }) {
  //const SECS = 1;
  const [timeRemaining, setTimeRemaining] = useState(numQuestions * SECS);
  //quickly format the time
  let minutes = Math.floor(timeRemaining / 60);
  if (minutes < 10) minutes = '0' + minutes;
  let seconds = Math.floor(timeRemaining % 60);
  if (seconds < 10) seconds = '0' + seconds;
  useEffect(
    function () {
      if (timeRemaining === 0) {
        alert("Oh no, you've run out of time to complete the quiz");
        dispatch({ type: 'finish' });
      }
      const interval = setInterval(() => setTimeRemaining((t) => t - 1), 1000);
      return () => clearInterval(interval);
    },
    [dispatch, timeRemaining]
  );

  return (
    <div className="timer">
      {minutes}:{seconds}
    </div>
  );
}

export default Timer;
