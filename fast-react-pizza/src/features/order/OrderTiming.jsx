import { calcMinutesLeft, formatDate } from "../../utils/helpers";

function OrderTiming({ deliveryIn, estimatedDelivery }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-5 rounded-2xl bg-stone-300 px-5 py-2">
      <p className="text-pretty font-medium">
        {deliveryIn >= 0
          ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left`
          : "Order should have arrived"}
      </p>
      <p className="text-balance text-xs">
        (Estimated delivery: {formatDate(estimatedDelivery)})
      </p>
    </div>
  );
}

export default OrderTiming;
