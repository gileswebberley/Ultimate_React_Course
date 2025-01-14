import { useSelector } from "react-redux";
import { formatCurrency } from "../../utils/helpers";
import RemoveFromCart from "./RemoveFromCart";
import { getCurrentQuantityById } from "./cartSlice";
import QuantityAdjuster from "./QuantityAdjuster";

function CartItem({ item }) {
  const { pizzaId, name, quantity, unitPrice, totalPrice } = item;
  const currentQuantity = useSelector(getCurrentQuantityById(pizzaId));

  return (
    <li className="px-2 pb-4 pt-2">
      <p className="text-lg font-semibold">
        {quantity} &times; {name}
      </p>
      <div className="flex items-stretch justify-between">
        <p>{formatCurrency(totalPrice)}</p>
        {currentQuantity > 0 ? (
          <QuantityAdjuster pizza={{ id: pizzaId, name, unitPrice }} />
        ) : (
          <RemoveFromCart pizzaId={pizzaId}>delete</RemoveFromCart>
        )}
      </div>
    </li>
  );
}

export default CartItem;
