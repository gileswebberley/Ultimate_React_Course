import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../Contexts/FakeAuthContext';
import { useEffect } from 'react';

//a wrapper component to stop direct access to app without being logged in
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated) navigate('/');
    },
    [isAuthenticated, navigate]
  );

  //as the useEffect doesn't run until after a first attempt at rendering occurs we'll make this conditional
  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
