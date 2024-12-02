import { createContext, useContext, useReducer } from 'react';

//Never do this in a production environment, just for learning
const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

//boilerplate step 1
const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: initialState.error,
      };

    case 'logout':
      return { initialState };

    case 'login/error':
      return { initialState, error: 'User name or password is incorrect' };

    default:
      throw new RangeError('Unknown action type passed to AuthContext reducer');
  }
}

//boilerplate step 2
function AuthProvider({ children }) {
  const [{ user, isAuthenticated, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  function login(email, password) {
    //typically we would have an api call here
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: 'login', payload: FAKE_USER });
    } else {
      dispatch({ type: 'login/error' });
    }
  }

  function logout() {
    dispatch({ type: 'logout' });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

//boilerplate step 3
function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error(
      'useAuthContext was called from outside the scope of AuthProvider'
    );
  return context;
}

export { AuthProvider, useAuthContext };
