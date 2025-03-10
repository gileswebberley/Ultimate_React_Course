import { createContext, useContext, useState } from 'react';

const GuestContext = createContext();

function GuestContextProvider({ children }) {
  const [fullName, setFullName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [nationality, setNationality] = useState('');
  const [countryFlag, setCountryFlag] = useState('');

  console.log(`Guest Context: ${nationality} : ${countryFlag}`);

  return (
    <GuestContext.Provider
      value={{
        setFullName,
        setGuestEmail,
        setNationalId,
        setNationality,
        setCountryFlag,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
}

function useGuestContext() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('GuestContext was used outside of GuestContextProvider');
  }
  return context;
}

export { useGuestContext, GuestContextProvider };
