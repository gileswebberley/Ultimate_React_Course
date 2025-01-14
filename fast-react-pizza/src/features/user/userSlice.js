import { getAddress } from "../../services/apiGeocoding";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { action } from "../order/CreateOrder";

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
//To use Thunk (for async functions in Redux) we can do the following, this will create 3 action types for pending, fulfilled and rejected
export const fetchAddress = createAsyncThunk(
  "user/fetchAddress",
  async function () {
    // 1) We get the user's geolocation position
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    //   // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
    const addressObj = await getAddress(position);
    console.table(addressObj);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}`;

    //   // 3) Then we return an object with the data that we are interested in
    //this is the payload of the fulfilled state
    return { position, address };
  },
);

const initialUserState = {
  username: localStorage.getItem("username") || "",
  //properties related to the Thunks address functionality
  status: "idle",
  position: {},
  address: "",
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
      localStorage.setItem("username", action.payload);
    },

    logout(state) {
      state.username = "";
      localStorage.removeItem("username");
    },
  },
  //Now to implement the async thunk actions for the 3 states by chaining cases to the builder object that it recieves
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.status = "idle";
        state.position = action.payload.position;
        state.address = action.payload.address;
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = "error";
        state.error = `${action.error.message} - Please allow access to your location or enter manually`;
      }),
});

export const { updateName, logout } = userSlice.actions;

export default userSlice.reducer;

export const getUsername = (state) => state.user.username;
