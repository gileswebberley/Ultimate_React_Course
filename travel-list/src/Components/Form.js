import { useState } from 'react';

export function Form({ onAddItems }) {
  //Using HTML form elements to quickly structure a form
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
              {i.toString()}
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
      {/**This is automatically assigned the role of submit button it seems but let's make it explicit with the type property */}
      <button type="submit">Add</button>
    </form>
  );
}
