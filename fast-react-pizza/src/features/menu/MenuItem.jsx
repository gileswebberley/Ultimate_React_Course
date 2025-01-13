import { useSelector } from "react-redux";
import { formatCurrency } from "../../utils/helpers";
import { getCurrentQuantityById } from "../cart/cartSlice";
import RemoveFromCart from "../cart/RemoveFromCart";
import AddToCart from "../cart/AddToCart";
import QuantityAdjuster from "../cart/QuantityAdjuster";

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const currentQuantity = useSelector(getCurrentQuantityById(id));

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
                <QuantityAdjuster pizza={pizza} />
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
