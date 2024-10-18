export function Logo({ divClass, imageString, title }) {
  return (
    <div className={divClass}>
      <span role="img">{imageString}</span>
      <h1>{title}</h1>
    </div>
  );
}
