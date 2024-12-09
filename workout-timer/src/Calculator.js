import { useState } from 'react';
import Countdown from './Countdown';

function Calculator({ workouts }) {
  //index of workout selected
  const [number, setNumber] = useState(0);
  const [sets, setSets] = useState(3);
  const [speed, setSpeed] = useState(90);
  const [durationBreak, setDurationBreak] = useState(5);
  //store how many minutes have been added/subtracted
  const [durationAdaptation, setDurationAdaptation] = useState(0);

  //recalculate duration when one of the time states changes
  let duration =
    (workouts.at(number).numExercises * sets * speed) / 60 +
    (sets - 1) * durationBreak;

  //apply durationAdaptation if possible
  if (durationAdaptation < 0 && Math.abs(durationAdaptation) <= duration) {
    duration = duration + durationAdaptation;
  } else if (durationAdaptation > 0) {
    duration = duration + durationAdaptation;
  } else if (durationAdaptation !== 0) {
    duration = 0;
  }

  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select value={number} onChange={(e) => setNumber(+e.target.value)}>
            {workouts.map((workout, i) => (
              <option value={i} key={i}>
                {workout.name} ({workout.numExercises} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="5"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
          <span>{sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
          <span>{speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={durationBreak}
            onChange={(e) => setDurationBreak(e.target.value)}
          />
          <span>{durationBreak} minutes/break</span>
        </div>
        <div>
          <label>User has adjusted the time by</label>
          <input
            type="number"
            value={durationAdaptation}
            onChange={(e) =>
              setDurationAdaptation(Math.floor(Number(e.target.value)))
            }
          />
          <span>{durationAdaptation} minutes</span>
        </div>
      </form>
      <section>
        <button
          onClick={() => {
            setDurationAdaptation(
              (durationAdaptation) => durationAdaptation - 1
            );
          }}
        >
          –
        </button>
        <Countdown workoutDuration={duration} />
        <button
          onClick={() => {
            setDurationAdaptation(
              (durationAdaptation) => durationAdaptation + 1
            );
          }}
        >
          +
        </button>
      </section>
    </>
  );
}
export default Calculator;
