import { useEffect, useState } from 'react';
import { useTimeContext } from './TimeContext';

function Timer() {
  const { formatTime, startTime } = useTimeContext();
  const [time, setTime] = useState(startTime);

  useEffect(
    function () {
      const id = setInterval(function () {
        setTime(formatTime(new Date()));
      }, 1000);

      return () => clearInterval(id);
    },
    [formatTime]
  );
  return <time>For your workout on {time}</time>;
}

export default Timer;
