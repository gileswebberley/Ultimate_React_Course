import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addBookingDetailsToGuestUser } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useAddBookingToGuest() {
  const queryClient = useQueryClient();
  const { mutate: updateGuest, isLoading: isUpdatingGuest } = useMutation({
    mutationFn: ({ startDate, endDate, cabinId }) =>
      addBookingDetailsToGuestUser({
        startDate,
        endDate,
        cabinId,
      }),
    onSuccess: (data) => {
      // toast.success(
      //   `Welcome ${data.user?.user_metadata?.fullName} (${data.user?.user_metadata?.guestId}) as our guest`
      // );
      queryClient.setQueryData(['user'], data.user);
      //navigate('../dashboard');
    },
    onError: (err) => {
      toast.error(`Something went wrong during the guest sign-in
                ERROR: ${err.message}`);
    },
  });

  return { updateGuest, isUpdatingGuest };
}
