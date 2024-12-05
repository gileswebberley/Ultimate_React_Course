import { createContext, useContext, useReducer } from 'react';

//Never do this in a production environment, just for learning
const FAKE_USER = {
  name: 'Giles',
  email: 'giles@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

//boilerplate context step 1
const AuthContext = createContext();

//set up reducer
const initialState = {
  user: null,
  isAuthenticated: false,
  error: '',
};

//I'm going to create a fake enum for the action types to avoid string problems and enable auto-complete
const ActionTypes = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  ERROR: 'login/error',
};

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: initialState.error,
      };

    case ActionTypes.LOGOUT:
      return { initialState };

    case ActionTypes.ERROR:
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
      dispatch({ type: ActionTypes.LOGIN, payload: FAKE_USER });
    } else {
      dispatch({ type: ActionTypes.ERROR });
    }
  }

  function logout() {
    dispatch({ type: ActionTypes.LOGOUT });
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
