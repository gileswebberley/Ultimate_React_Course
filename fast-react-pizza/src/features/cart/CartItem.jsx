import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";

function CartItem({ item }) {
  const { pizzaId, name, quantity, totalPrice } = item;

  return (
    <li className="px-2 pb-4 pt-2">
      <p className="text-lg font-semibold">
        {quantity} &times; {name}
      </p>
      <div className="flex items-stretch justify-between">
        <p>{formatCurrency(totalPrice)}</p>
        <Button type="small">Delete</Button>
      </div>
    </li>
  );
}

export default CartItem;
