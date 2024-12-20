import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { addToCart } from "../cart/cartSlice";

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const dispatch = useDispatch();

  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: 1 * unitPrice,
    };
    dispatch(addToCart(newItem));
  }

  return (
    <li className="flex gap-3 py-2">
      <img
        src={imageUrl}
        alt={name}
        className={`h-28 ${soldOut && "opacity-70 grayscale"}`}
      />
      {/* by making the container div flex-column we can adjust the position of each child element */}
      <div className="flex flex-1 flex-col pt-1">
        <p className="text-lg font-bold">{name}</p>
        <p className="italic first-letter:capitalize">
          {ingredients.join(", ")}
        </p>
        <div className="mt-auto flex items-baseline justify-between text-sm">
          {!soldOut ? (
            <p>{formatCurrency(unitPrice)}</p>
          ) : (
            <p className="font-semibold uppercase opacity-70">Sold out</p>
          )}
          {!soldOut && (
            <Button type="small" onClick={handleAddToCart}>
              Add
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
