import { createSlice } from '@reduxjs/toolkit';

//Initial State
const initialStateCustomer = {
  fullName: '',
  nationalID: '',
  createdAt: '',
};

const customerSlice = createSlice({
  name: 'customer',
  initialState: initialStateCustomer,
  reducers: {
    createCustomer: {
      prepare(fullName, nationalID) {
        //const createTime = new Date().toISOString();
        return {
          payload: {
            fullName,
            nationalID,
            createdAt: new Date().toISOString(),
          },
        };
      },
      reducer(state, action) {
        state.fullName = action.payload.fullName;
        state.nationalID = action.payload.nationalID;
        state.createdAt = action.payload.createdAt;
      },
    },
    changeName(state, action) {
      state.fullName = action.payload;
    },
  },
});

export const { createCustomer, changeName } = customerSlice.actions;
export default customerSlice.reducer;

//see v1 for old (pre RTK) way of doing this
