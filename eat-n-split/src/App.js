import { useState } from 'react';
import { FriendsList } from './FriendsList';
import { AddFriendForm } from './AddFriendForm';
import { FormSplitBill } from './FormSplitBill';
import { Button } from './Button';

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
//also, if an image url is not provided create a random one using the supplied link
function createFriend(name, image) {
  const tmpId = crypto.randomUUID();
  image = image === '' ? `https://i.pravatar.cc/48?u=${tmpId}` : image;
  return { id: tmpId, name: name, image: image, balance: 0 };
}

//The root App component
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
    //oh and don't forget to pass an anonymous function to the State Set Method!!
    setFriends((friends) => [...friends, createFriend(name, image)]);
    //then hide the add friend form component by toggling the addingFriend state
    handleShowFriendForm();
  }

  //Handler function to wrap setCurrentFriend() State Method
  function handleSelectFriend(id) {
    //check whether it is the friend who is currently selected and if so the button
    //we just clicked had the label 'Close' and so we reset the state and close
    //the split bill component
    if (currentFriend?.id === id) {
      setCurrentFriend(null);
      setSplittingBill(false);
    }
    //otherwise return the friend with the specified id by filtering the friends array
    //and selecting the first entry of the array produced, then open the split bill form
    //also tidy up by closing the add friend component if it is still open
    else {
      setCurrentFriend(() => friends.filter((el) => el.id === id)[0]);
      setSplittingBill(true);
      setAddingFriend(false);
    }
  }

  //Handler function to wrap setAddingFriends() State method
  function handleShowFriendForm() {
    setAddingFriend((show) => !show);
    //close the split bill component whilst adding a friend
    handleSelectFriend(currentFriend?.id);
  }

  //Handler function to adjust the balance of a friend who you split a bill with
  //(Done before watching tutorial but other than me passing the friend it is the same
  //as the solution provided)
  function handleSplitBill(friend, balanceChange) {
    setFriends((friends) =>
      friends.map((el) =>
        el.id === friend.id
          ? { ...el, balance: el.balance + balanceChange }
          : el
      )
    );
    handleSelectFriend(friend.id);
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
