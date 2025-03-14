import { useMutation } from '@tanstack/react-query';
import { signInGuest as signInGuestApi } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useGuestSignIn() {
  const { mutate: signInGuest, isLoading: isCreatingGuest } = useMutation({
    mutationFn: ({ fullName, email }) => signInGuestApi({ fullName, email }),
    onSuccess: (data) => {
      toast.success(
        `Welcome ${data.user?.user_metadata?.fullName} as our guest`
      );
      //navigate('../dashboard');
    },
    onError: (err) => {
      toast.error(`Something went wrong during the guest sign-in
                ERROR: ${err.message}`);
    },
  });

  return { signInGuest, isCreatingGuest };
}
