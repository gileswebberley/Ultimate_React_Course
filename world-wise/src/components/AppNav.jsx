import { NavLink } from 'react-router-dom';
import styles from './AppNav.module.css';

function AppNav() {
  /* As we are using this inside the sidebar of the AppLayout, for which we have defined our nested routes, we simply provide the additional url extension for the to property and so we'll end up with [basic url]/app/cities for example*/
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="cities">Cities</NavLink>
        </li>
        <li>
          <NavLink to="countries">Countries</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default AppNav;
