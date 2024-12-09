import { useCallback, useEffect, useRef, useState } from 'react';
import clickSound from './ClickSound.m4a';
import { useSoundContext } from './contexts/SoundContext';

function Countdown({ workoutDuration }) {
  //how many seconds has the timer been running - this keeps it relevant when changing the duration whilst running
  const [runTime, setRunTime] = useState(0);
  //bool for interval control
  const [running, setRunning] = useState(false);
  //state shared across this component and is set by a sibling of our parent
  const { allowSound } = useSoundContext();
  //stop repeated sounds when other components force a re-render whilst we are at the number of seconds we're supposed to make a click
  const playOnce = useRef(false);
  //safe place for the interval ids
  const interval = useRef(null);

  //when running changes state start the timer or clear up the interval
  useEffect(
    function () {
      if (running) {
        interval.current = setInterval(function () {
          setRunTime((runTime) => runTime + 1);
        }, 1000);
        console.log(`create interval ${interval.current}`);
      }

      return () => {
        if (interval.current !== null) {
          console.log(`clear-up interval ${interval.current}`);
          clearInterval(interval.current);
          interval.current = null;
        }
      };
    },
    [running]
  );

  const playSound = useCallback(
    function () {
      if (!allowSound || playOnce.current) return;
      playOnce.current = true;
      const sound = new Audio(clickSound);
      sound.play();
    },
    [allowSound]
  );

  let currentTimeRemaining = workoutDuration * 60 - runTime;
  if (currentTimeRemaining <= 0 && running) {
    setRunning(false);
    setRunTime(0);
  }

  const mins = Math.floor(currentTimeRemaining / 60);
  const seconds = currentTimeRemaining - mins * 60;

  if (running && currentTimeRemaining % 10 === 0) {
    playSound();
  } else if (running && currentTimeRemaining % 10 !== 0 && playOnce.current) {
    playOnce.current = false;
  }

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
