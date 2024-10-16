//NAVIGATION AREA --------------------------------------------------------
export function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      {/* this is the example of how to avoid prop drilling by using component composition*/}
      {children}
    </nav>
  );
}
