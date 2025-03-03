import styled from 'styled-components';
import { useUser } from './useUser';
import SpinnerMini from '../../ui/SpinnerMini';

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  width: 4rem;
  width: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

export default function UserAvatar() {
  //
  const {
    user: {
      user_metadata: { fullName, avatar },
    },
    isCheckingUser,
  } = useUser();
  //const { fullName, avatar } = user;
  const displayName = fullName.split(' ').shift();

  return (
    <>
      {isCheckingUser ? (
        <SpinnerMini />
      ) : (
        <StyledUserAvatar>
          <span>{displayName || 'Anon'}</span>
          <Avatar
            src={avatar || 'default-user.jpg'}
            alt={`Avatar for ${fullName}`}
          />
        </StyledUserAvatar>
      )}
    </>
  );
}
