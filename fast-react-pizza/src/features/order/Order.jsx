// Test ID: IIDSAT

import { useLoaderData } from "react-router-dom";
import { calcMinutesLeft } from "../../utils/helpers";
import { getOrder } from "../../services/apiRestaurant";
import PriceSummary from "./PriceSummary";
import OrderHeader from "./OrderHeader";
import OrderTiming from "./OrderTiming";
import OrderOverview from "./OrderOverview";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearCart } from "../cart/cartSlice";
import UpdateOrder from "./UpdateOrder";

function Order() {
  //get the data that is returned from this component's loader function
  const order = useLoaderData();
  //to dispatch the clearCart method on load
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
        {!priority && <UpdateOrder />}
      </div>
    </>
  );
}

//using the loader Step 1 - create this function (in the file by default)
//step 2 - import into the App (or where the Browser Router is defined) eg import Order, { loader as orderLoader } from './features/order/Order';
//Step 3 - define it as the loader parameter in the route definition object eg {path: '/order/:orderId', element: <Order />, loader: orderLoader,}
//Step 4 - grab the returned data with useLoaderData hook within this component
export async function loader({ params }) {
  //const { orderId } = useParams(); This doesn't work because it is not a react component, however loader() takes params as an argument
  const data = await getOrder(params.orderId);
  return data;
}

export default Order;
