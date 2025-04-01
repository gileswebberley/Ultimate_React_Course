import styled from 'styled-components';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { useEffect } from 'react';
import { iDB } from './shared_constants';
import Spinner from '../ui/Spinner';
import { useNavigate } from 'react-router-dom';

const TestContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

function DBTest() {
  const {
    isDBBusy,
    errors,
    data,
    getCurrentData,
    createCurrentObject,
    currentObjectIdState,
  } = useIndexedDB(iDB.name, [{ name: iDB.store, key: iDB.key }], iDB.key);

  useEffect(() => {
    if (!isDBBusy && !currentObjectIdState)
      createCurrentObject(iDB.store, {
        guestId: 67,
        cabinId: 12,
        totalGuests: 5,
      });
  }, [isDBBusy, createCurrentObject, currentObjectIdState]);

  useEffect(() => {
    if (!isDBBusy) getCurrentData(iDB.store);
  }, [isDBBusy, getCurrentData]);

  const navigate = useNavigate();

  if (isDBBusy) return <Spinner />;

  return (
    <TestContainer>
      <div>busy:{isDBBusy}</div>
      <div>errors:{errors}</div>
      <div>data:{JSON.stringify(data)}</div>
      <button onClick={() => navigate('../dbtest2')}>go to other test</button>
    </TestContainer>
  );
}

export default DBTest;
