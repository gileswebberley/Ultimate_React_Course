import { useDispatch, useSelector } from "react-redux";
import { formatCurrency } from "../../utils/helpers";
import { addToCart, getCurrentQuantityById } from "../cart/cartSlice";
import RemoveFromCart from "../cart/RemoveFromCart";
import AddToCart from "../cart/AddToCart";

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const currentQuantity = useSelector(getCurrentQuantityById(id));
  const dispatch = useDispatch();

  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
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
            <div>
              {currentQuantity > 0 ? (
                <div className="flex flex-nowrap space-x-1">
                  <RemoveFromCart pizzaId={id} quantity={currentQuantity}>
                    &minus;
                  </RemoveFromCart>
                  <p>{currentQuantity}</p>
                  <AddToCart pizza={pizza}>+</AddToCart>
                </div>
              ) : (
                <AddToCart pizza={pizza}>Add</AddToCart>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
