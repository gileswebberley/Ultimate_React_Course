import { useEffect, useState } from 'react';
import { startTime, formatTime } from './scripts/timeUtility';

function Timer() {
  const [time, setTime] = useState(startTime);

  useEffect(function () {
    const id = setInterval(function () {
      setTime(formatTime(new Date()));
    }, 1000);

    return () => clearInterval(id);
  }, []);
  return <time>For your workout on {time}</time>;
}

export default Timer;
