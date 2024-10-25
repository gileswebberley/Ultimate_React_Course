import { useEffect } from 'react';

function Timer({ dispatch, timeRemaining }) {
  useEffect(
    function () {
      const interval = setInterval(() => dispatch({ type: 'countdown' }), 1000);
      return () => clearInterval(interval);
    },
    [dispatch]
  );

  return (
    <div className="timer">
      0{Math.floor(timeRemaining / 60)}:{Number(timeRemaining % 60)}
    </div>
  );
}

export default Timer;
