import SimpleLink from "./SimpleLink";

function BackToMenu() {
  return (
    <div className="float-start w-svw">
      <span className="relative left-3">
        <SimpleLink to="/menu">&larr; Back to menu</SimpleLink>
      </span>
    </div>
  );
}

export default BackToMenu;
