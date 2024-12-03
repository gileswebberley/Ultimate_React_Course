import { Outlet } from 'react-router-dom';
import AppNav from './AppNav';
import Logo from './Logo';
import styles from './Sidebar.module.css';

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      {/* As we have now implemented the nested routes for AppLayout inside the App component, and this sidebar appears as part of that page that wants to be aware of these nested routes, we use the Outlet component from React Router. This Outlet will render the component declared in the nested route, for example [url]/app/cities will place the cities component in place of this Outlet component much like using the {children} property of a standard component */}
      <Outlet />
      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; Copyright {new Date().getFullYear()} by World Wise Inc.
        </p>
      </footer>
    </div>
  );
}

export default Sidebar;
