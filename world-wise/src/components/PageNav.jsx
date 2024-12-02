import { NavLink } from 'react-router-dom';
//using css modules for the first time so let's import our new file
import styles from './PageNav.module.css';
import Logo from './Logo';
import { useAuthContext } from '../Contexts/FakeAuthContext';
import Button from './Button';

function PageNav() {
  const { isAuthenticated, logout } = useAuthContext();

  function handleLogOut() {
    logout();
  }
  //By using NavLink instead of Link the active page link gets the class 'active' and so can be styled differently
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        <li>
          {!isAuthenticated ? (
            <NavLink to="/login" className={styles.ctaLink}>
              LogIn
            </NavLink>
          ) : (
            <Button type="primary" onClick={handleLogOut}>
              Log Out
            </Button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
