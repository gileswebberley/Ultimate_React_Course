import { useState } from 'react';

//Note useState is called a Hook

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

  console.log(itemsToPack);

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={addItemsToPack} />
      <PackingList itemList={itemsToPack} />
      <Stats />
    </div>
  );
}

function Logo() {
  return <h1>Far Away</h1>;
}

//Using HTML form elements to quickly structure a form
function Form({ onAddItems }) {
  //to disable the default page reload when a form is submitted we accept the event
  //into the handler function and prevent the default behaviour to keep it a single page app
  /**
   * Controlled Elements -
   * first step - create a state for each form element
   * second step - use that state as the value of the input field
   * third step - listen for a change in the form element and reflect it into our state variable
   */
  const [description, setDescription] = useState('');
  const [numberOfItem, setNumberOfItem] = useState(1);

  function handleSubmit(submitEvent) {
    submitEvent.preventDefault();
    //if there's nothing entered into the description don't submit the information
    if (!description) return;
    //otherwise create a new item and add it to our items
    const newItem = {
      id: undefined,
      description,
      quantity: numberOfItem,
      packed: false,
    };
    //reset the form fields...
    setDescription('');
    setNumberOfItem(1);
    //now we call the setter function that was passed as a prop from App
    onAddItems(newItem);
  }

  return (
    <form
      className="add-form"
      onSubmit={handleSubmit}
      name="Items to add to packing list"
    >
      <h3>What do you need for your trip</h3>
      <select
        value={numberOfItem}
        name="number of item"
        onChange={(e) => setNumberOfItem(Number(e.target.value))}
      >
        {
          //to quickly create an array from 1-20 you can use the from() method
          //remember that when we are rendering a list of elements each element needs a unique key
          Array.from({ length: 20 }, (_, i) => i + 1).map((i) => (
            <option value={i} key={i}>
              {i}
            </option>
          ))
        }
      </select>
      {/**Here we implement the connection between the form element and the state variable with the value and event listener (onChange) */}
      <input
        type="text"
        value={description}
        placeholder="Item to pack..."
        onChange={(e) => setDescription(e.target.value)}
        name="Name of item"
      />
      {/**This is automatically assigned the role of submit button it seems */}
      <button>Add</button>
    </form>
  );
}
function PackingList({ itemList }) {
  //with the items now being sent as a prop from the App (which holds it as state)
  //it will always be current as new items are added
  return (
    <div className="list">
      <ul>
        {/** again remember when mapping an array to return elements each needs a unique key property */}
        {itemList.map((item) => (
          <Item item={item} key={item.id} />
        ))}
      </ul>
    </div>
  );
}

//immediately destructure the Props and extract the item object
function Item({ item }) {
  return (
    <li>
      <span style={item.packed ? { textDecoration: 'line-through' } : {}}>
        {item.quantity} {item.description}
      </span>
      <button>&times;</button>
    </li>
  );
}

function Stats() {
  return (
    <footer className="stats">
      <em>You have x items on your list and you've packed x (X%)</em>
    </footer>
  );
}
