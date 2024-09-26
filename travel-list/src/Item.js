//immediately destructure the Props and extract the item object and the delete item handler function

export function Item({ item, onDeleteItem, onPackItem }) {
  return (
    <li>
      {/** When the checkbox is clicked we fire the event in App sending this item's id and the explicit boolean value of the checked property (which toggles) */}
      <input
        type="checkbox"
        id={item.description}
        value={item.packed}
        checked={item.packed}
        onChange={(e) => onPackItem(item.id, Boolean(e.target.checked))}
      />
      <label htmlFor={item.description}>
        <span style={item.packed ? { textDecoration: 'line-through' } : {}}>
          {item.quantity} {item.description}
        </span>
      </label>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}
