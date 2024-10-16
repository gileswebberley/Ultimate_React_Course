//Slowly creating some reuseable components as we notice similarities in functionality
//A simple button that toggles an isOpen functionality
export function ToggleButton({ toggleFunction, toggleVariable }) {
  return (
    <button
      className="btn-toggle"
      onClick={() => toggleFunction((open) => !open)}
    >
      {toggleVariable ? '–' : '+'}
    </button>
  );
}
