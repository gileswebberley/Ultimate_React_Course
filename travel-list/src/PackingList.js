import { useState } from 'react';
import { Item } from './Item';

export function PackingList({
  itemList,
  onDeleteItem,
  onPackItem,
  onClearList,
}) {
  //with the items now being sent as a prop from the App (which holds it as state)
  //it will always be current as new items are added
  //to implement the sorting functionality we'll use a State variable
  const [sortBy, setSortBy] = useState('input');

  //if there's nothing on the list then simply show a message
  if (!itemList.length) {
    return (
      <div className="list">
        <p>You Have No Items To Pack Yet</p>
      </div>
    );
  }
  //otherwise, we have not returned and so let's do all of this
  //keeping in mind that we must use the slice() method to avoid mutating the original array, we'll sort our list according to the newly added sortBy state. Note we use let as it allows us to name a variable as a placeholder and then assign it's value unlike const
  let sortedItems;
  //use a simple switch statement to look after the sorting required
  switch (sortBy) {
    case 'input':
      sortedItems = itemList;
      break;
    case 'description':
      //to sort alphabeticaly you can use the localeCompare() function
      sortedItems = itemList
        .slice()
        .sort((a, b) => a.description.localeCompare(b.description));
      break;
    case 'packed':
      //to sort by false followed by true convert boolean to number (ie 0/1) and minus b from a, to reverse simply add instead
      sortedItems = itemList
        .slice()
        .sort((a, b) => Number(a.packed) - Number(b.packed));
      break;
    default:
      sortedItems = itemList;
  }

  return (
    <div className="list">
      <ul>
        {/** again remember when mapping an array to return elements each needs a unique key property.
         * here we are passing the state manipulation methods onto the Item so the
         * list can be affected by interactions with the individual items eg
         * onDeleteItem will be called by the Item's delete button
         */}
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onPackItem={onPackItem}
          />
        ))}
      </ul>
      {/**Now we'll add the sort by menu to interact with the sortBy state variable */}
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by Input Order</option>
          <option value="description">Sort by Description</option>
          <option value="packed">Sort by Packed Status</option>
        </select>
        <button onClick={onClearList}>Clear List</button>
      </div>
    </div>
  );
}
