import { useEffect, useState } from 'react';

function Timer({ dispatch, numQuestions, SECS }) {
  //centralised the time per question which is why the SECS constant is being passed in rather than local
  //in the original version this timer was running globally in the App component which causes
  //the entire app to re-render every second which felt ridiculous to me and instead a better
  //candidate for a local re-render
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
      //remember to clear up the setInterval with the clear-up function otherwise there'll be loads running
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
