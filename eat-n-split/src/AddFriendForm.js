import { useState } from 'react';
import { Button } from './Button';

export function AddFriendForm({ onAddFriend }) {
  //State variables that are tied to the controlled elements in the form
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  function submitFriendForm(e) {
    //onSubmit always passes the event and whenever we are using forms in React we must remember to stop it reloading the page with the preventDefault method
    e.preventDefault();
    //little guard statement
    if (name === '') return;
    //onAddFriend uses the little utility function createFriend() to generate the id and a random image if none is entered
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
