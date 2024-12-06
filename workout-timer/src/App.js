import { memo, useMemo, useState } from 'react';
import Calculator from './Calculator';
import ToggleSounds from './ToggleSounds';
import { useTimeContext } from './TimeContext';
import Timer from './Timer';
import Countdown from './Countdown';

function App() {
  const [allowSound, setAllowSound] = useState(true);
  const { startTime } = useTimeContext();

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
      <ToggleSounds allowSound={allowSound} setAllowSound={setAllowSound} />
      <Calculator workouts={workouts} allowSound={allowSound}>
        <Countdown allowSound={allowSound} />
      </Calculator>
    </main>
  );
}

export default memo(App);
