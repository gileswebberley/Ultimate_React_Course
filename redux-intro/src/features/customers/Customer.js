import { useSelector } from 'react-redux';

function Customer() {
  //access our redux store - notice that the name of the state we are using is the one we gave it in the combineReducers function in our store
  const customerName = useSelector((store) => store.customer.fullName);

  return <h2>👋 Welcome, {customerName}</h2>;
}

export default Customer;
