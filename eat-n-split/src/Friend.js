import { Button } from './Button';

export function Friend({ friend, onSelectFriend, selectedFriend }) {
  //this could be done with 3 if && output statements but I think this is neater
  function balanceText() {
    let balanceString;
    //create the appropriate <p> styled element and message according to the balance property of the friend
    if (friend.balance > 0) {
      balanceString = (
        <p className="green">
          {friend.name} owes you £{friend.balance}
        </p>
      );
    }
    if (friend.balance < 0) {
      balanceString = (
        <p className="red">
          You owe {friend.name} £{-friend.balance}
        </p>
      );
    }
    if (friend.balance === 0) {
      balanceString = <p>You and {friend.name} are even</p>;
    }
    return balanceString;
  }

  //Component JSX ------------------------------------------
  return (
    <li className={selectedFriend?.id === friend.id ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {balanceText()}
      <Button onClick={() => onSelectFriend(friend.id)}>
        {selectedFriend?.id === friend.id ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}
