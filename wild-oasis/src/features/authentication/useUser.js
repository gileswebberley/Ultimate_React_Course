import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../../services/apiAuth';

export function useUser() {
  const { data: user, isLoading: isCheckingUser } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    onError: (error) => {
      console.log(error.message);
    },
    networkMode: 'offlineFirst',
  });
  //by checking the user data returned we can make a quick boolean that can be used
  return {
    user,
    isCheckingUser,
    isAuthenticated: user?.role === 'authenticated' ?? false,
  };
}
