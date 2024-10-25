import { useEffect, useState } from 'react';

function Timer({ dispatch, numQuestions }) {
  const SECS = 1;
  const [timeRemaining, setTimeRemaining] = useState(numQuestions * SECS);
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
      0{Math.floor(timeRemaining / 60)}:{Number(timeRemaining % 60)}
    </div>
  );
}

export default Timer;
