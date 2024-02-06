import React from 'react';
import { FiLogOut } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';

import { Container, HeaderContent, Profile } from './styles';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <Container>
      <HeaderContent>
        <div>
          <Profile>
            <span>Bem vindo!</span>
            <strong>{user.username}</strong>
          </Profile>
        </div>

        <button type='button' onClick={signOut}>
          <FiLogOut /> Sair
        </button>
      </HeaderContent>
    </Container>
  );
};

export default Header;
