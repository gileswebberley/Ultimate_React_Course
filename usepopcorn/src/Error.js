//and another presentational component to handle any errors

export function Error({ message }) {
  return (
    <p className="error">
      <span>oops 😯 {message}</span>
    </p>
  );
}
