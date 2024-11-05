import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div>
      <h1>This page could not be found</h1>
      <Link to="/">Return to Homepage</Link>
    </div>
  );
}

export default PageNotFound;
