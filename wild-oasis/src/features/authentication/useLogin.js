import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useLogin() {
  const navigate = useNavigate();

  const { mutate: login, isLoading: isLoggingIn } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (userData) => {
      console.log(userData);
      navigate('../dashboard');
    },
    onError: (error) => {
      toast.error(`Error during login: ${error.message}`);
    },
  });
  return { login, isLoggingIn };
}
