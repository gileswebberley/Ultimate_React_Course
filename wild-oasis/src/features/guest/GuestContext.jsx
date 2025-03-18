import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { useUser } from '../authentication/useUser';

const GuestContext = createContext();
const GuestApiContext = createContext();

const initialState = {
  fullName: '',
  guestEmail: '',
  nationalId: '',
  nationality: '',
  countryFlag: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'setName':
      return { ...state, fullName: action.payload };
    case 'setEmail':
      return { ...state, guestEmail: action.payload };
    case 'setNationalId':
      return { ...state, nationalId: action.payload };
    case 'setCountry':
      return {
        ...state,
        nationality: action.payload.country,
        countryFlag: action.payload.flag,
      };
    default:
      throw new Error('Guest context does not recognise the action type');
  }
}

function GuestContextProvider({ children }) {
  const { user, isCheckingUser, isAnonymous } = useUser();
  const [state, dispatch] = useReducer(reducer, initialState);
  //seperating concerns, so put the setter functions in one context and the readable state in the other
  const api = useMemo(() => {
    const setName = (name) => {
      dispatch({ type: 'setName', payload: name });
    };
    const setEmail = (email) => {
      dispatch({ type: 'setEmail', payload: email });
    };
    const setNationalId = (NId) => {
      dispatch({ type: 'setNationalId', payload: NId });
    };
    const setCountry = (country, flag) => {
      dispatch({ type: 'setCountry', payload: { country, flag } });
    };

    return { setName, setEmail, setNationalId, setCountry };
  }, [dispatch]);

  //in case a reload clears the context but the guest has already filled out the form
  useEffect(() => {
    if (isCheckingUser) return;
    if (isAnonymous) {
      console.log(user);
      dispatch({ type: 'setName', payload: user.user_metadata.fullName });
      dispatch({ type: 'setEmail', payload: user.user_metadata.email });
    }
  }, [user, isCheckingUser, isAnonymous]);

  console.table(state);

  return (
    <GuestApiContext.Provider value={api}>
      <GuestContext.Provider value={state}>{children}</GuestContext.Provider>
    </GuestApiContext.Provider>
  );
}

function useGuestContext() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('GuestContext was used outside of GuestContextProvider');
  }
  return context;
}
function useGuestApiContext() {
  const context = useContext(GuestApiContext);
  if (context === undefined) {
    throw new Error('GuestApiContext was used outside of GuestContextProvider');
  }
  return context;
}

export { useGuestContext, useGuestApiContext, GuestContextProvider };
