import { formatCurrency } from "../../utils/helpers";

function PriceSummary({ priority, priorityPrice, orderPrice }) {
  return (
    <div className="flex flex-col items-start justify-between gap-x-5 rounded-2xl bg-stone-300 px-5 py-2 text-sm">
      <p>Price pizza: {formatCurrency(orderPrice)}</p>
      {priority && <p>Price priority: {formatCurrency(priorityPrice)}</p>}
      <p className="text-base font-semibold">
        To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
      </p>
    </div>
  );
}

export default PriceSummary;
