import { Link } from "react-router-dom";
/** Multi use button
 *  - if 'to' is defined it will become a Link
 *  - type (default 'primary') can be 'small', 'vsmall' and 'secondary' also
 *  - disabled (default false) is for the button disabled */
function Button({
  children,
  disabled = false,
  to,
  type = "primary",
  onClick = undefined,
}) {
  //allow for links to be styled as buttons, just as we have allowed SimpleLinks to be buttons (for navigation)
  const base =
    "text-sm inline-block rounded-full bg-amber-500 font-bold uppercase tracking-wide text-stone-700 transition-colors duration-200 hover:bg-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:ring-inset disabled:cursor-wait";

  const style = {
    primary: base + " px-3 py-2",
    small: base + " px-3 py-1 text-xs",
    vsmall: base + " px-1.5 text-[10px] font-bold tracking-wide",
    secondary:
      "text-sm inline-block rounded-full bg-transparent border-2 border-stone-400 font-bold uppercase tracking-wide text-stone-500 transition-colors duration-200 hover:bg-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:ring-inset disabled:cursor-wait px-3 py-1.5",
  };

  if (to)
    return (
      <Link to={to} className={style[type]} disabled={disabled}>
        {children}
      </Link>
    );
  //don't bother wasting resources by adding an event listener if onClick === undefined
  if (onClick !== undefined)
    return (
      <button disabled={disabled} className={style[type]} onClick={onClick}>
        {children}
      </button>
    );

  return (
    <button disabled={disabled} className={style[type]}>
      {children}
    </button>
  );
}

export default Button;
