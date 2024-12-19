import { formatCurrency } from "../../utils/helpers";

function OrderItem({ item, isLoadingIngredients, ingredients }) {
  const { quantity, name, totalPrice } = item;

  return (
    <li>
      <div className="ml-4 py-3">
        <p className="text-pretty font-semibold">
          <span>{quantity} &times;</span> {name}
        </p>
        <p className="text-sm">{formatCurrency(totalPrice)}</p>
      </div>
    </li>
  );
}

export default OrderItem;
