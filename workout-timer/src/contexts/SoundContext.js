import { createContext, useContext, useState } from 'react';

const SoundContext = createContext();

function SoundContextProvider({ children }) {
  const [allowSound, setAllowSound] = useState(true);

  return (
    <SoundContext.Provider value={{ allowSound, setAllowSound }}>
      {children}
    </SoundContext.Provider>
  );
}

function useSoundContext() {
  const context = useContext(SoundContext);
  if (context === undefined)
    throw new Error(
      'cannot reference useSoundContext outside the scope of SoundContextProvider'
    );
  return context;
}

export { useSoundContext, SoundContextProvider };
