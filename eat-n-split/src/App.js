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

//Utility function to create a friend object
//Notice the use of the built in browser crypto object (not available in older browsers) to produce a unique id for a new friend
function createFriend(name, image) {
  const tmpId = crypto.randomUUID();
  image = image === '' ? `https://i.pravatar.cc/48?u=${tmpId}` : image;
  return { id: tmpId, name: name, image: image, balance: 0 };
}

export default function App() {
  //State variable for the list of friends
  const [friends, setFriends] = useState(initialFriends);
  //State variable used to show/hide the add friend form
  const [addingFriend, setAddingFriend] = useState(false);

  //Handler function to wrap setFriends() State method
  function handleAddFriend(name, image) {
    alert('adding friend: ' + name);
    setFriends([...friends, createFriend(name, image)]);
  }

  //Handler function to wrap setAddingFriends() State method
  function handleShowFriendForm() {
    setAddingFriend((show) => !show);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends} />
        {addingFriend && <AddFriendForm onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowFriendForm}>
          {addingFriend ? 'Close' : 'Add Friend'}
        </Button>
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

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function AddFriendForm({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  function submitFriendForm(e) {
    //onSubmit always passes the event and whenever we are using forms in React we must remember to stop it reloading the page with the preventDefault method
    e.preventDefault();
    onAddFriend(name, image);
  }

  return (
    <form className="form-add-friend" onSubmit={submitFriendForm}>
      <label>Friend's Name</label>
      <input
        type="text"
        placeholder="Enter new friends name"
        name="friendName"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Friend's Image</label>
      <input
        type="text"
        placeholder="Random Provided If None"
        name="friendImage"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
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
      <Button>Split Bill</Button>
    </form>
  );
}
