import { createContext, useContext, useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:8001';

const CitiesContext = createContext();

function CitiesContextProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error('Error loading cities data: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    console.log(`getCity called with city id: ${id}`);
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (err) {
      console.error('Error loading cities data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      //const data = await res.json();
      //console.log(`new city: ${data}`);
    } catch (err) {
      console.error('Error saving cities data: ' + err.message);
    } finally {
      setIsLoading(false);
      //just to keep the cities synced with the DB
      setCities((cities) => [newCity, ...cities]);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Error deleting cities data: ' + err.message);
    } finally {
      setIsLoading(false);
      setCities((cities) => cities.filter((city) => city.id !== id));
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        currentCity,
        getCity,
        isLoading,
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
