import { useSelector } from "react-redux";
import RemoveFromCart from "./RemoveFromCart";
import { getCurrentQuantityById } from "./cartSlice";
import AddToCart from "./AddToCart";

function QuantityAdjuster(pizza) {
  //const { id } = pizza;
  const currentQuantity = useSelector(getCurrentQuantityById(pizza.id));
  return (
    <div className="flex flex-nowrap space-x-1">
      <RemoveFromCart pizzaId={pizza.id} quantity={currentQuantity}>
        &minus;
      </RemoveFromCart>
      <p>{currentQuantity}</p>
      <AddToCart pizza={pizza}>+</AddToCart>
    </div>
  );
}

export default QuantityAdjuster;
