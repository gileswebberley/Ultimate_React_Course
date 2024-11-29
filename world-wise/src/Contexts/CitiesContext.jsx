import { createContext, useContext, useEffect, useReducer } from 'react';

const BASE_URL = 'http://localhost:8001';

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
    //first off we're going to look after our event handlers using Redux names
    case 'loading':
      return { ...state, isLoading: true };

    case 'rejected':
      console.log(action.payload);
      return { ...state, error: action.payload, isLoading: false };

    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };

    case 'city/created':
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
        isLoading: false,
      };

    case 'city/deleted':
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      };

    case 'city/selected':
      return { ...state, currentCity: action.payload, isLoading: false };

    default:
      console.log('switch default');
  }
}

function CitiesContextProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: 'cities/loaded', payload: data });
      } catch (err) {
        dispatch({
          type: 'rejected',
          payload: `Error loading cities data: ${err.message}`,
        });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    // console.log(`getCity called with city id: ${id}`);
    if (currentCity.id === id) return;
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: 'city/selected', payload: data });
      //setCurrentCity(data);
    } catch (err) {
      dispatch({
        type: 'rejected',
        payload: `Error getting city with id ${id}: ${err.message}`,
      });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: 'loading' });
    try {
      await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      dispatch({ type: 'city/created', payload: newCity });
    } catch (err) {
      dispatch({
        type: 'rejected',
        payload: `Error saving cities data: ${err.message}`,
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: 'loading' });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });
      dispatch({ type: 'city/deleted', payload: id });
    } catch (err) {
      dispatch({
        type: 'rejected',
        payload: `Error deleting city with id ${id}: ${err.message}`,
      });
    } finally {
      // setIsLoading(false);
      // setCities((cities) => cities.filter((city) => city.id !== id));
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        currentCity,
        getCity,
        isLoading,
        error,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCitiesContext() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error(
      'useCitiesContext was used outside the scope of CitiesContextProvider'
    );
  return context;
}

export { useCitiesContext, CitiesContextProvider };
