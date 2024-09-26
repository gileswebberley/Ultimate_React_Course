export function Stats({ itemsToPack }) {
  //I moved all of these calculations down here so we don't do them when there are no items listed
  //add in an early return statement if there is nothing on the list (remember that 0 is a falsey value in JS)
  if (!itemsToPack.length) {
    return (
      <footer className="stats">
        <em>Let's get started with this packing list 🧳</em>
      </footer>
    );
  }
  //else we'll work out all the stats and output accordingly (including a congrats for getting packed)
  //I'll use the reduce method to extract the quantity of each element rather than add State that I don't require (the itemsToPack State is the "single source of truth")
  const numberOfItemsToPack = itemsToPack.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  //I'll use the reduce method to extract the quantity of each element that has a packed property set to true
  const numberOfItemsPacked = itemsToPack.reduce(
    (acc, item) => (item.packed ? acc + item.quantity : acc),
    0
  );
  const percentagePacked = Math.round(
    (numberOfItemsPacked / numberOfItemsToPack) * 100
  );
  return (
    <footer className="stats">
      <em>
        {percentagePacked < 100
          ? `You have ${numberOfItemsToPack} items (from ${itemsToPack.length} categories) on your list and you've packed ${numberOfItemsPacked} (${percentagePacked}%)`
          : `Well done, you've packed all ${numberOfItemsToPack} items from ${itemsToPack.length} categories`}
      </em>
    </footer>
  );
}
