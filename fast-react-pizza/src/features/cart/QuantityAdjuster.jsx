import { useSelector } from "react-redux";
import RemoveFromCart from "./RemoveFromCart";
import { getCurrentQuantityById } from "./cartSlice";
import AddToCart from "./AddToCart";

/**
 *
 * @param {(pizza : object)} pizza an object that must include id, unitPrice, and name keys
 * @returns a UI component which takes care of adding and removing items from the cart
 */
function QuantityAdjuster({ pizza }) {
  const currentQuantity = useSelector(getCurrentQuantityById(pizza.id));

  return (
    <div className="flex flex-nowrap space-x-1">
      <RemoveFromCart pizzaId={pizza.id} quantity={currentQuantity}>
        {currentQuantity > 1 ? "-" : "X"}
      </RemoveFromCart>
      <p>{currentQuantity}</p>
      <AddToCart pizza={pizza}>+</AddToCart>
    </div>
  );
}

export default QuantityAdjuster;
