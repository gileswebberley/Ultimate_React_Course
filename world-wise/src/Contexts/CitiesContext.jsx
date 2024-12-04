import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

const BASE_URL = 'http://localhost:8001';

//part 1 of implementing the use of the Context API is to create a context object
const CitiesContext = createContext();

//Now we are going to combine this Context with useReducer
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    //first off we're going to look after our event handlers using Redux-style names
    case ActionTypes.LOADING:
      return { ...state, isLoading: true };

    case ActionTypes.REJECTED:
      console.error(action.payload);
      return { ...state, error: action.payload, isLoading: false };

    case ActionTypes.CITIES_LOADED:
      return { ...state, isLoading: false, cities: action.payload };

    case ActionTypes.CITY_CREATED:
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
        isLoading: false,
      };

    case ActionTypes.CITY_DELETED:
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      };

    case ActionTypes.CITY_SELECTED:
      return { ...state, currentCity: action.payload, isLoading: false };

    default:
      throw new RangeError('Undefined action type dispatched to CitiesContext');
  }
}

//I'm going to create a fake enum for the action types to avoid string problems and enable auto-complete
const ActionTypes = {
  LOADING: 'loading',
  REJECTED: 'rejected',
  CITIES_LOADED: 'cities/loaded',
  CITY_CREATED: 'city/created',
  CITY_DELETED: 'city/deleted',
  CITY_SELECTED: 'city/selected',
};

//part 2 is to create the state and functionalities that the context will provide to any of it's children components
//the main role of this context is to keep the cities data centralised and available to various components without the need for prop drilling
function CitiesContextProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  //on initialisation we have the hook to grab the cities data from the server (json-server in this case)
  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: ActionTypes.LOADING });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: ActionTypes.CITIES_LOADED, payload: data });
      } catch (err) {
        dispatch({
          type: ActionTypes.REJECTED,
          payload: `Error loading cities data: ${err.message}`,
        });
      }
    }
    fetchCities();
  }, []);

  //rather than search through the cities data we are practising getting further details from the server pertaining to a particular city.
  //See the City component for the description of why this is wrapped in the useCallback hook
  const getCity = useCallback(
    async function getCity(id) {
      if (currentCity.id === id) return;
      dispatch({ type: ActionTypes.LOADING });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: ActionTypes.CITY_SELECTED, payload: data });
      } catch (err) {
        dispatch({
          type: ActionTypes.REJECTED,
          payload: `Error getting city with id ${id}: ${err.message}`,
        });
      }
    },
    [currentCity.id]
  );

  //keeping with the basic idea that this context centralises the responsibilty for the city data we keep all the logic associated with the data in here - this adds a new city to our data
  async function createCity(newCity) {
    dispatch({ type: ActionTypes.LOADING });
    try {
      await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      dispatch({ type: ActionTypes.CITY_CREATED, payload: newCity });
    } catch (err) {
      dispatch({
        type: ActionTypes.REJECTED,
        payload: `Error saving cities data: ${err.message}`,
      });
    }
  }

  //does what it says on the tin - deletes city data based on it's id
  async function deleteCity(id) {
    dispatch({ type: ActionTypes.LOADING });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });
      dispatch({ type: ActionTypes.CITY_DELETED, payload: id });
    } catch (err) {
      dispatch({
        type: ActionTypes.REJECTED,
        payload: `Error deleting city with id ${id}: ${err.message}`,
      });
    }
  }

  //part 3 of the Context is to pass back the Provider object with all of the values (functions and state) that will be required by the various components that 'listen' to this 'broadcaster'.
  //The Context API gives us this structure where we define the context's Provider component which passes all of it's values to child components to consume. Here we allow it to wrap components by using the 'children' property
  return (
    <CitiesContext.Provider
      value={{
        cities,
        currentCity,
        isLoading,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

//Finally we give an access route that can be called within the context consumers to get whatever parts of the context they require, for example if a child component needed the cities data they would grab it by destructuring the data returned like so - const {cities} = useCitiesContext()
function useCitiesContext() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error(
      'useCitiesContext was used outside the scope of CitiesContextProvider'
    );
  return context;
}

export { useCitiesContext, CitiesContextProvider };
