//Reusable component example - the button with the project styling applied

export function Button({ children, onClick }) {
  //Component JSX ------------------------------------------
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
