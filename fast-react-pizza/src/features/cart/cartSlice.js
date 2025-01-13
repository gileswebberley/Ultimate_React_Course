import { createSlice } from "@reduxjs/toolkit";

const initialCartState = {
  cart: [],
};

/*
cart item has properties -
pizzaId
name
quantity
unitPrice
totalPrice
*/

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    addToCart(state, action) {
      //payload = new item
      const alreadyInCart = state.cart.find(
        (item) => item.pizzaId == action.payload["pizzaId"],
      );
      if (alreadyInCart === undefined) {
        //a new pizza to add
        state.cart.push(action.payload);
      } else {
        //already have that pizza so increase the quantity
        //it seems that we get a reference from find() rather than a copy of the value
        //const index = state.cart.indexOf(alreadyInCart);
        alreadyInCart.quantity += action.payload["quantity"];
        alreadyInCart.totalPrice =
          alreadyInCart.quantity * alreadyInCart.unitPrice;
        //state.cart.splice(index, 1, alreadyInCart);
      }
    },
    removeFromCart(state, action) {
      //payload = pizzaId
      state.cart = state.cart.filter((item) => item.pizzaId != action.payload);
    },
    increaseItemQuantity(state, action) {
      //payload = pizzaId
      const item = state.cart.find((item) => item.pizzaId == action.payload);
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuantity(state, action) {
      //payload = pizzaId
      const item = state.cart.find((item) => item.pizzaId == action.payload);
      if (item.quantity === 1) {
        // state.cart = state.cart.filter(
        //   (item) => item.pizzaId != action.payload,
        // );
        //instead there is a way to call another action from here
        cartSlice.caseReducers.removeFromCart(state, action);
      } else {
        item.quantity--;
        item.totalPrice = item.quantity * item.unitPrice;
      }
    },
    clearCart(state) {
      state.cart = initialCartState.cart;
    },
  },
});
export const {
  addToCart,
  removeFromCart,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

//Place all state related functionality in the slice definition (check out the reselect library for a more efficient way to do this in larger projects)

export const getNumberOfPizzas = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

export const getCart = (state) => state.cart.cart;

export const getCurrentQuantityById = (id) => (state) =>
  state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
