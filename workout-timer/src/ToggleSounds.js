import { useSoundContext } from './contexts/SoundContext';

function ToggleSounds() {
  const { allowSound, setAllowSound } = useSoundContext();
  return (
    <button
      className="btn-sound"
      onClick={() => setAllowSound((allow) => !allow)}
    >
      {allowSound ? '🔈' : '🔇'}
    </button>
  );
}

export default ToggleSounds;
