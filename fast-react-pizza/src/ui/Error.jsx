import { useNavigate, useRouteError } from "react-router-dom";
import SimpleLink from "./SimpleLink";

function Error() {
  const navigate = useNavigate();
  //here we can grab the error object itself so that we can show a message
  const err = useRouteError();

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{err.message || err.data}</p>
      <SimpleLink to="-1">&larr; Go back</SimpleLink>
    </div>
  );
}

export default Error;
