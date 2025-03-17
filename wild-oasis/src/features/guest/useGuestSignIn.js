import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signInGuest as signInGuestApi } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useGuestSignIn() {
  const queryClient = useQueryClient();
  const { mutate: signInGuest, isLoading: isSigningInGuest } = useMutation({
    mutationFn: ({ fullName, email, avatar }) =>
      signInGuestApi({ fullName, email, avatar }),
    onSuccess: (data) => {
      toast.success(
        `Welcome ${data.user?.user_metadata?.fullName} as our guest`
      );
      queryClient.setQueryData(['user'], data.user);
      //navigate('../dashboard');
    },
    onError: (err) => {
      toast.error(`Something went wrong during the guest sign-in
                ERROR: ${err.message}`);
    },
  });

  return { signInGuest, isSigningInGuest };
}
