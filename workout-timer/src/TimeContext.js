import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const TimeContext = createContext();

function TimeContextProvider({ children }) {
  const formatTime = useCallback(function formatTime(date) {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  }, []);

  const startTime = useMemo(() => formatTime(new Date()), [formatTime]);

  //seperating out a countdown functionality that will need duration updates
  const [workoutDuration, setWorkoutDuration] = useState(0);

  return (
    <TimeContext.Provider
      value={{ startTime, workoutDuration, formatTime, setWorkoutDuration }}
    >
      {children}
    </TimeContext.Provider>
  );
}

function useTimeContext() {
  const context = useContext(TimeContext);
  if (context === undefined)
    throw new Error(
      'Time context does not exist outside the scope of TimeContextProvider'
    );
  return context;
}

export { useTimeContext, TimeContextProvider };
