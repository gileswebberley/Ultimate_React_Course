import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useSelector } from "react-redux";
import { getUsername } from "../user/userSlice";
import { getCart } from "../cart/cartSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  // const [withPriority, setWithPriority] = useState(false);
  const cart = useSelector(getCart);
  const username = useSelector(getUsername);

  const nav = useNavigation();
  const isSubmitting = nav.state === "submitting";

  //grab the errors object that might have been created by our action function
  const formErrors = useActionData(); //see the phone field for usage

  const inputLayout =
    "mb-3 flex flex-col items-stretch justify-between gap-1 md:flex-row";

  return (
    <div className="mx-3 pt-3">
      <h2 className="mb-2 text-center text-2xl font-semibold text-stone-700">
        Ready to order?
        <br />
        <span className="text-amber-600">Let's go!</span>
      </h2>
      {/* To get the react router actions working for us we replace the form element with the Form component. method can be 'POST'/'PATCH'/'DELETE' but not 'GET'
      No need to set up all of the 'controlled elements' as all this info is sent to the action as the request object 
      As this form is not going through a js validation function we use the 'required' keyword which is equivalent to if(!customer) return; */}
      <Form method="POST">
        <div className={inputLayout}>
          <label>First Name</label>
          <div>
            <input
              type="text"
              name="customer"
              className="input w-80"
              defaultValue={username}
              required
            />
          </div>
        </div>

        <div className={inputLayout}>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" className="input w-80" required />
            {formErrors?.phone && (
              <p className="mt-2 w-80 rounded-md bg-red-200 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className={inputLayout}>
          <label>Address</label>
          <div>
            <input type="text" name="address" className="input w-80" required />
          </div>
        </div>

        <div className="mb-6 flex w-80 items-center gap-3 md:w-fit">
          <input
            className="h-5 w-5 border-amber-200 accent-amber-300 ring-amber-600 focus:outline-none focus:ring-1"
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to give your order priority?</label>
        </div>

        <div>
          {/* Remember the old way of passing extra data as a string within an html form, well you can still do that within Form so that it get's passed to the action (although this is very insecure!!) */}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Placing Order" : "Order now"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

//This will be called when the Form is submitted, once we have tied it together in App
export async function action({ request }) {
  //now use the browser api to get the data out of the request object
  const formData = await request.formData();
  //console.log(formData); //just an object

  //handy little JS method to restructure into an object
  const data = Object.fromEntries(formData);

  //now convert this data into an order with the correct format (JSON.parse() converts the json string back into an object/array)
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on",
  };
  //console.log(order);

  //any data that we return from this can be consumed by the component it is 'attached to' by using the useActionData hook, therefore we can do some error/validation like so -
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please provide a valid phone number as we may need to contact you";

  //easy way to check if an object is empty
  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  //Now as we can't use any hooks in here we can't useNavigate but react router provides an alternative way - by returning a redirect function
  return redirect(`/order/${newOrder.id}`);
  //return null;//for testing
}

export default CreateOrder;
