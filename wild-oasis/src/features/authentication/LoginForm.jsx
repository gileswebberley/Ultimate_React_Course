import { useState } from 'react';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import FormRow from '../../ui/FormRow';
import SpinnerMini from '../../ui/SpinnerMini';
import { useLogin } from './useLogin';
import PasswordInput from '../../ui/PasswordInput';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoggingIn } = useLogin();
  //const ref = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    login(
      { email, password },
      {
        onError: () => {
          setPassword('');
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow orientation="vertical" label="Email address">
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormRow>
      <FormRow orientation="vertical" label="Password">
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </FormRow>
      <FormRow orientation="vertical">
        <Button size="large" disabled={isLoggingIn}>
          {isLoggingIn ? <SpinnerMini /> : 'Login'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default LoginForm;
