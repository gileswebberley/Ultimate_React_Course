// Test ID: IIDSAT

import { useLoaderData } from "react-router-dom";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";
import { getOrder } from "../../services/apiRestaurant";
import OrderItem from "./OrderItem";
import BackToMenu from "../../ui/BackToMenu";
import PriceSummary from "./PriceSummary";
import OrderHeader from "./OrderHeader";
import OrderTiming from "./OrderTiming";
import OrderOverview from "./OrderOverview";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearCart } from "../cart/cartSlice";

const order = {
  id: "ABCDEF",
  customer: "Jonas",
  phone: "123456789",
  address: "Arroios, Lisbon , Portugal",
  priority: true,
  estimatedDelivery: "2027-04-25T10:00:00",
  cart: [
    {
      pizzaId: 7,
      name: "Napoli",
      quantity: 3,
      unitPrice: 16,
      totalPrice: 48,
    },
    {
      pizzaId: 5,
      name: "Diavola",
      quantity: 2,
      unitPrice: 16,
      totalPrice: 32,
    },
    {
      pizzaId: 3,
      name: "Romana",
      quantity: 1,
      unitPrice: 15,
      totalPrice: 15,
    },
  ],
  position: "-9.000,38.000",
  orderPrice: 95,
  priorityPrice: 19,
};

function Order() {
  const order = useLoaderData();
  const dispatch = useDispatch();

  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  //clear the cart as we have now placed the order
  useEffect(
    function () {
      dispatch(clearCart());
    },
    [dispatch],
  );

  return (
    <>
      {/* <BackToMenu /> */}
      <div className="max-w-fit space-y-6 px-4 py-2">
        <OrderHeader id={id} priority={priority} status={status} />
        <OrderTiming
          deliveryIn={deliveryIn}
          estimatedDelivery={estimatedDelivery}
        />
        <OrderOverview cart={cart} />
        <PriceSummary
          priority={priority}
          priorityPrice={priorityPrice}
          orderPrice={orderPrice}
        />
      </div>
    </>
  );
}

//using the loader Step 1 - create this function (in the file by default)
//step 2 - import into the App (or where the Browser Router is defined) eg import Order, { loader as orderLoader } from './features/order/Order';
//Step 3 - define it as the loader parameter in the route definition object eg {path: '/order/:orderId', element: <Order />, loader: orderLoader,}
export async function loader({ params }) {
  //const { orderId } = useParams(); This doesn't work because it is not a react component, however loader() takes params as an argument
  const data = await getOrder(params.orderId);
  return data;
}

export default Order;
