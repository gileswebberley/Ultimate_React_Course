import styled from 'styled-components';
import { useUser } from './useUser';
import SpinnerMini from '../../ui/SpinnerMini';

const StyledUserAvatar = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  width: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-600);
  margin-left: -2.1rem;
`;

const NameBox = styled.span`
  background-color: var(--color-grey-100);
  padding: 0.4rem 2.8rem 0.4rem 1.4rem;
  border-radius: 10rem;
`;

export default function UserAvatar() {
  const { user, isCheckingUser } = useUser();
  const { fullName, avatar } = user?.user_metadata ?? {};
  const displayName = fullName?.split(' ').shift();

  return (
    <>
      {isCheckingUser ? (
        <SpinnerMini />
      ) : (
        <StyledUserAvatar>
          <NameBox>{displayName || 'Anon'}</NameBox>
          <Avatar
            src={avatar || 'default-user.jpg'}
            alt={`Avatar for ${fullName}`}
          />
        </StyledUserAvatar>
      )}
    </>
  );
}
