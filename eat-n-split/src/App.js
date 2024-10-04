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
  //State variable for the currently selected friend with whom you wish to split the bill
  const [currentFriend, setCurrentFriend] = useState(null);
  //State variable used to show/hide the add friend form
  const [addingFriend, setAddingFriend] = useState(false);
  //State variable used to show/hide the split bill form
  const [splittingBill, setSplittingBill] = useState(false);

  //Handler function to wrap setFriends() State method
  function handleAddFriend(name, image) {
    //alert('adding friend: ' + name);
    //oh and don't forget to pass an anonymous function to the State Set Method!!
    setFriends((friends) => [...friends, createFriend(name, image)]);
    handleShowFriendForm();
  }

  //Handler function to wrap setCurrentFriend() State Method
  function handleSelectFriend(id) {
    if (currentFriend?.id === id) {
      setCurrentFriend(null);
      setSplittingBill(false);
    } else {
      setCurrentFriend(() => friends.filter((el) => el.id === id)[0]);
      setSplittingBill((splittingBill) => (splittingBill = true));
      setAddingFriend(false);
    }
  }

  //Handler function to wrap setAddingFriends() State method
  function handleShowFriendForm() {
    setAddingFriend((show) => !show);
  }

  function handleSplitBill(friend, balanceChange) {
    setFriends((friends) =>
      friends.map((el) =>
        el.id === friend.id
          ? { ...el, balance: el.balance + balanceChange }
          : el
      )
    );
  }

  //Component JSX ------------------------------------------
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFriend={handleSelectFriend}
          selectedFriend={currentFriend}
        />
        {addingFriend && <AddFriendForm onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowFriendForm}>
          {addingFriend ? 'Close' : 'Add Friend'}
        </Button>
      </div>
      {splittingBill && (
        <FormSplitBill friend={currentFriend} onSplitBill={handleSplitBill} />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectedFriend }) {
  //Component JSX ------------------------------------------
  return (
    <ul>
      {friends.map((el) => (
        <Friend
          friend={el}
          onSelectFriend={onSelectFriend}
          key={el.id}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
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

function Button({ children, onClick }) {
  //Component JSX ------------------------------------------
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
    //little guard statement
    if (name === '') return;
    onAddFriend(name, image);
    //and reset the values...
    setName('');
    setImage('');
  }

  //Component JSX ------------------------------------------
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

function FormSplitBill({ friend, onSplitBill }) {
  const [billValue, setBillValue] = useState('');
  const [userCut, setUserCut] = useState('');
  const [payer, setPayer] = useState('user');
  const friendsCut = billValue === '' ? '' : billValue - userCut;

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
        onChange={(e) => setBillValue(e.target.value)}
      />
      <label>Your Cut</label>
      <input
        type="text"
        value={userCut}
        onChange={(e) => setUserCut(e.target.value)}
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
