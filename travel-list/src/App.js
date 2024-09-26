import { useState } from 'react';
import { Logo } from './Logo';
import { Form } from './Form';
import { PackingList } from './PackingList';
import { Stats } from './Stats';

//Note useState is called a Hook
//As a final process we refactored all of the components into seperate files using [cntl]+[shift]+[R] - move to new file which took care of all of the import statements both in the new files and in here too :)

const initialItems = [
  { id: 1, description: 'Passports', quantity: 2, packed: false },
  { id: 2, description: 'Socks', quantity: 12, packed: true },
];
/**
 * A bit about using State and Props
 * State is the internal data of a component, think of them as making up the component 'memory', which can only be updated by the component itself.
 * The updating of a component's state causes that component to be re-rendered which is how react makes the components interactive (or dynamic if you prefer)
 *
 * Props are external data that can be sent from a parent component to a child component as a read-only function parameter (not to sibling components!) and when the child recieves those props it renders/re-renders
 * Therefore by sending State as a Prop a parent can "configure a child component's settings"
 *
 * How To Think About State Management
 * When to create pieces of state, where to place that state, what type of state in needed, and how that data will 'flow through the app'
 * In this example, before the tutorial I'm about to go through, I was wondering how to add those items from the form into the initialItems and get them to render in the PackingList -
 * should I make it a state variable in App and then pass it to the packing list? well that doesn't seem right cos how can I get the Form to change the state of it's Parent component App??
 * perhaps have it as state in the Form but then PackingList is a Sibling of Form so that would not cause a re-render of PackingList either....
 *
 *
 * SOLUTION ------------------------
 * In the tutorial he starts by having the items array as part of the Form's state which I'll do now along with adding a function to add new items - but of course this does not update (re-render) the PackingList so we'll have to move this piece of state up to the App along with the addItemsToPack function (because we can actually pass a function as a Prop!!)
 * SO the solution is to 'lift' the state and the functions related to altering that state up to the lowest common ancestor (in this case the App component) and then pass the data and functions as Props to the child components (siblings) that need it which obviously happens whenever the App re-renders due to a change in it's State - Lovely :)
 * ---------------------------------
 *
 * Local State vs Global State
 * Local state is defined inside a component and will only be needed by that component or by it's children (by passing it as Props to the child, which occurs when the parent state is re-rendered due to a state change)
 * Global state is for state that is needed by many unrelated (or sibling) components and this is done by using tolls such as React's Context API or other frameworks such as Redux - ONLY USE GLOBAL STATE IF YOU CAN'T DO IT LOCALLY
 *
 * WHEN AND WHERE -
 * See the course slide for 79: When and Where to use state
 *
 *
 */

export default function App() {
  //here we're adding the items as part of the App components state so we can pass it around through Props
  const [itemsToPack, setItemsToPack] = useState(initialItems);

  //State Event Methods ------------------------------------------------------------
  function addItemsToPack(newItem) {
    //remember that we cannot mutate within react so itemsToPack.push(newItem) is not
    // allowed and instead we create a new array by spreading the existing one and
    //adding our new item to the end (just like push would do to the original array)
    const newItemWithId = {
      ...newItem,
      id: itemsToPack[itemsToPack.length - 1].id + 1,
    };
    setItemsToPack((itemsToPack) => [...itemsToPack, newItemWithId]);
  }

  function deleteItemToPack(id) {
    setItemsToPack((items) => items.filter((item) => item.id !== id));
  }

  /* So I am trying to use what I've learnt to work this out before the tutorial on how
   to do it. I know that we will want to change the state of the packing list and that
   I will want to change the value of one property of one selected item. Therefore I am
   taking the arguments of the unique item id and the boolean value of the checkbox in
   the Item instance. I'm using the map function (firstly because I can't mutate arrays or objects within React and secondly because I don't want to change the size of the array) and within that I am finding the item with the correct id and using the Spread
   then adapt method we learnt earlier. If it's not the item we are changing the packed
   property of then simply return the item as is within the inline map function
  */
  function packItems(itemId, isItemPacked) {
    setItemsToPack((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, packed: isItemPacked } : item
      )
    );
  }

  //As this method clears all of the information from our array then double check with a confirm box
  function clearItemsFromList() {
    if (
      window.confirm(
        'Are you sure you wish to clear your packing list? This action cannot be undone!'
      )
    ) {
      setItemsToPack([]);
    }
  }

  //---------------------------------------------------------------------------------

  console.log(itemsToPack);

  //and now we pass the itemsToPack State and the setter function to the components via Props
  return (
    <div className="app">
      <Logo />
      <Form onAddItems={addItemsToPack} />
      {/** The event handlers are being passed down the heirarchy tree to eventually reach the Item instances */}
      <PackingList
        itemList={itemsToPack}
        onDeleteItem={deleteItemToPack}
        onPackItem={packItems}
        onClearList={clearItemsFromList}
      />
      <Stats itemsToPack={itemsToPack} />
    </div>
  );
}
