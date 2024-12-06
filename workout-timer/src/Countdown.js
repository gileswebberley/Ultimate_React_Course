import { useEffect, useState } from 'react';
import { useTimeContext } from './TimeContext';
import clickSound from './ClickSound.m4a';

function Countdown({ allowSound }) {
  const { workoutDuration } = useTimeContext();
  const [runTime, setRunTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(
    function () {
      let id = null;
      if (running) {
        id = setInterval(function () {
          setRunTime((runTime) => runTime + 1);
        }, 1000);
      } else {
        clearInterval(id);
      }

      return () => clearInterval(id);
    },
    [running]
  );

  const playSound = function () {
    if (!allowSound) return;
    const sound = new Audio(clickSound);
    sound.play();
  };

  let currentTimeRemaining = workoutDuration * 60 - runTime;
  if (currentTimeRemaining <= 0 && running) {
    setRunning(false);
    setRunTime(0);
  }

  const mins = Math.floor(currentTimeRemaining / 60);
  const seconds = currentTimeRemaining - mins * 60;

  if (running && seconds % 10 === 0) playSound();

  function handleReset(e) {
    e.stopPropagation();
    setRunTime(0);
  }

  return (
    <>
      <div
        className="countdown"
        onClick={() => setRunning((running) => !running)}
      >
        <p>
          {mins < 10 && '0'}
          {mins}:{seconds < 10 && '0'}
          {seconds}
        </p>
        <button onClick={handleReset}>Reset</button>
      </div>
      <div></div>
    </>
  );
}

export default Countdown;
