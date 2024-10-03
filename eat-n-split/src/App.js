import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends} />
        <AddFriendForm />
        <Button>Add Friend</Button>
      </div>
      <FormSplitBill />
    </div>
  );
}

function FriendsList({ friends }) {
  return (
    <ul>
      {friends.map((el) => (
        <Friend friend={el} key={el.id} />
      ))}
    </ul>
  );
}

function Friend({ friend }) {
  //this could be done with 3 if && output statements but I think this is neater
  function balanceText() {
    let balanceString;
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

  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {balanceText()}
      <Button>Select</Button>
    </li>
  );
}

function Button({ children }) {
  return <button className="button">{children}</button>;
}

function AddFriendForm() {
  return (
    <form className="form-add-friend">
      <label>Friend's Name</label>
      <input
        type="text"
        placeholder="Enter new friends name"
        name="friendName"
      />
      <label>Friend's Image</label>
      <input type="text" placeholder="Enter Url" name="friendImage" />
      <Button>Add Friend</Button>
    </form>
  );
}

function FormSplitBill() {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with X</h2>
      <label>Bill Value</label>
      <input type="text" />
      <label>Your Cut</label>
      <input type="text" />
      <label>X's Cut</label>
      <input type="text" disabled />
      <label>Who's paying the bill?</label>
      <select>
        <option value="user">You</option>
        <option value="friend">X</option>
      </select>
    </form>
  );
}
