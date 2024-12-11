//Initial State
const initialStateCustomer = {
  fullName: '',
  nationalID: '',
  createdAt: '',
};
//Fake Enum
const CustomerActions = {
  CREATE: 'customer/createCustomer',
  CHANGE_NAME: 'customer/changeName',
};

//Reducer - export as the default
export default function customerReducer(state = initialStateCustomer, action) {
  switch (action.type) {
    case CustomerActions.CREATE:
      return {
        ...state,
        fullName: action.payload.fullName,
        nationalID: action.payload.nationalID,
        createdAt: action.payload.createdAt,
      };
    case CustomerActions.CHANGE_NAME:
      return { ...state, fullName: action.payload };
    default:
      //console.log('customer reducer called with undefined action type');
      return state;
  }
}

//Action creators - export as named exports

export function createCustomer(fullName, nationalID) {
  return {
    type: CustomerActions.CREATE,
    payload: { fullName, nationalID, createdAt: new Date().toISOString() },
  };
}
export function changeName(fullName) {
  return { type: CustomerActions.CHANGE_NAME, payload: fullName };
}
