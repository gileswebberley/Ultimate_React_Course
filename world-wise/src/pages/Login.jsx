import { useEffect, useState } from 'react';
import styles from './Login.module.css';
import PageNav from '../components/PageNav';
import { useAuthContext } from '../Contexts/FakeAuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState('jack@example.com');
  const [password, setPassword] = useState('qwerty');
  const { login, isAuthenticated, error } = useAuthContext();
  const navigate = useNavigate();

  useEffect(
    function () {
      //here we use the replace option in the navigate function to keep the back button functioning as expected (otherwise it will just run this page again and redirect to app)
      if (isAuthenticated) navigate('/app', { replace: true });
    },
    [isAuthenticated, navigate]
  );

  function handleLogin(e) {
    e.preventDefault();
    if (email && password) login(email, password);
  }

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </form>
    </main>
  );
}
