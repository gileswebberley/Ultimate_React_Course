import { NavLink } from 'react-router-dom';
//using css modules for the first time so let's import our new file
import styles from './PageNavTutorial.module.css';

function PageNav() {
  //By using NavLink instead of Link the active page link gets the class 'active' and so can be styled differently
  return (
    <nav className={styles.nav}>
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
