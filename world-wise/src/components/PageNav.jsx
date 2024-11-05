import { NavLink } from 'react-router-dom';

function PageNav() {
  //By using NavLink instead of Link the active page link gets the class 'active' and so can be styled differently
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
