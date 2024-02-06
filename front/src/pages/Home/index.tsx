import React from 'react';

import Header from '../../components/Header';
import UsersList from '../../components/UsersList';
import Chat from '../../components/Chat';

import { Container, Content } from './styles';

const Home: React.FC = () => {
  return (
    <Container>
      <Header />
      <Content>
        <UsersList />
        <Chat />
      </Content>
    </Container>
  );
};

export default Home;
