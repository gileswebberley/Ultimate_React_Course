import { formatCurrency } from "../../utils/helpers";

function OrderItem({ item, ingredients, isLoadingIngredients }) {
  const { quantity, name, totalPrice } = item;
  if (!isLoadingIngredients) console.table(ingredients);
  return (
    <li>
      <div className="ml-4 py-3">
        <p className="text-pretty font-semibold">
          <span>
            {quantity} &times; {name}
          </span>
        </p>
        <p className="text-balance text-sm font-light italic first-letter:capitalize">
          {isLoadingIngredients || ingredients === undefined
            ? "loading..."
            : ingredients.join(", ")}
        </p>
        <p className="text-sm">{formatCurrency(totalPrice)}</p>
      </div>
    </li>
  );
}

export default OrderItem;
