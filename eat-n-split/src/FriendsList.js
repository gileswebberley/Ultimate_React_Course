import { Friend } from './Friend';

export function FriendsList({ friends, onSelectFriend, selectedFriend }) {
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
