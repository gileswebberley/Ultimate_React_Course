import { Link, useNavigate } from "react-router-dom";
/**
 *
 * If sent a number for the to property it will navigate that number of steps through history
 */
function SimpleLink({ children, to }) {
  //impement the navigation link for a back link
  const className =
    "text-md text-amber-700 transition-all duration-200 hover:relative hover:right-1 hover:text-amber-500 active:text-stone-500";

  const navigate = useNavigate();

  //if the to property is a number then return the navigate button
  if (!isNaN(to) && !to.includes("/"))
    return (
      <button className={className} onClick={() => navigate(-1)}>
        {children}
      </button>
    );

  //else it's a string url so return the normal link
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export default SimpleLink;
