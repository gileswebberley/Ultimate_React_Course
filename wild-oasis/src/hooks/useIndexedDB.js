import { useState } from 'react';

export function useIndexedDB() {
  //all of the state to register to
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(null);
}
