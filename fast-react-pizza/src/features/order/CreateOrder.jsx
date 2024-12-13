import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: 'Mediterranean',
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: 'Vegetale',
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: 'Spinach and Mushroom',
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  // const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;

  const nav = useNavigation();
  const isSubmitting = nav.state === 'submitting';

  //grab the errors object that might have been created by our action function
  const formErrors = useActionData(); //see the phone field for usage

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>
      {/* To get the react router actions working for us we replace the form element with the Form component. method can be 'POST'/'PATCH'/'DELETE' but not 'GET'
      No need to set up all of the 'controlled elements' as all this info is sent to the action as the request object 
      As this form is not going through a js validation function we use the 'required' keyword which is equivalent to if(!customer) return; */}
      <Form method="POST">
        <div>
          <label>First Name</label>
          <input type="text" name="customer" required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" required />
          </div>
          {formErrors?.phone && <p>{formErrors.phone}</p>}
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type="text" name="address" required />
          </div>
        </div>

        <div>
          <input
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          {/* Remember the old way of passing extra data as a string within an html form, well you can still do that within Form so that it get's passed to the action (although this is very insecure!!) */}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <button disabled={isSubmitting}>
            {isSubmitting ? 'Placing Order' : 'Order now'}
          </button>
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
    priority: data.priority === 'on',
  };
  //console.log(order);

  //any data that we return from this can be consumed by the component it is 'attached to' by using the useActionData hook, therefore we can do some error/validation like so -
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      'Please provide a valid phone number as we may need to contact you';

  //easy way to check if an object is empty
  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  //Now as we can't use any hooks in here we can't useNavigate but react router provides an alternative way - by returning a redirect function
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
