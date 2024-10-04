import { useState } from 'react';
import { Button } from './Button';

export function FormSplitBill({ friend, onSplitBill }) {
  /*Doing this without the tutorial as it is making the elements controlled again
  --Had to double check that the select element had the same properties to control--
  The friendsCut does not have to be State variable as it is implied by the other state
  and remember that it will be recalculated every time the app is re-rendered
  */
  const [billValue, setBillValue] = useState('');
  const [userCut, setUserCut] = useState('');
  const [payer, setPayer] = useState('user');
  const friendsCut = billValue === '' ? '' : billValue - userCut;

  /*Form submit handler function which as always starts with the preventDefault() to stop page reload
  Then it passes through the friend object to be compared (could have just used currentFriend within App handler function but decided it would be best to keep it like this)
  along with how much the balance changes according to who is paying the bill.
  Then we reset all of the state variables to their default values */
  function submitSplitBill(e) {
    e.preventDefault();
    if (billValue === '') return;
    onSplitBill(friend, payer === 'friend' ? userCut * -1 : friendsCut);
    setBillValue('');
    setUserCut('');
    setPayer('user');
  }
  //Component JSX ------------------------------------------
  return (
    <form className="form-split-bill" onSubmit={submitSplitBill}>
      <h2>Split a bill with {friend.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
      />
      <label>Your Cut</label>
      <input
        type="text"
        value={userCut}
        onChange={(e) => setUserCut(Number(e.target.value))}
      />
      <label>{friend.name}'s Cut</label>
      <input type="text" disabled value={friendsCut} />
      <label>Who's paying the bill?</label>
      <select value={payer} onChange={(e) => setPayer(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
