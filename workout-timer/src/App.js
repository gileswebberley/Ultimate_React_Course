import { useMemo, useState } from 'react';
import Calculator from './Calculator';
import ToggleSounds from './ToggleSounds';
import Timer from './Timer';
import Countdown from './Countdown';
import { startTime } from './scripts/timeUtility';
import { SoundContextProvider } from './contexts/SoundContext';

function App() {
  const [allowSound, setAllowSound] = useState(true);

  // Will be be AM or PM
  const partOfDay = startTime.slice(-2);

  const workouts = useMemo(
    () => [
      {
        name: 'Full-body workout',
        numExercises: partOfDay === 'AM' ? 9 : 8,
      },
      {
        name: 'Arms + Legs',
        numExercises: 6,
      },
      {
        name: 'Arms only',
        numExercises: 3,
      },
      {
        name: 'Legs only',
        numExercises: 4,
      },
      {
        name: 'Core only',
        numExercises: partOfDay === 'AM' ? 5 : 4,
      },
    ],
    [partOfDay]
  );

  return (
    <main>
      <h1>Workout timer</h1>
      <Timer />
      <SoundContextProvider>
        <ToggleSounds />
        <Calculator workouts={workouts} />
      </SoundContextProvider>
    </main>
  );
}

export default App;
