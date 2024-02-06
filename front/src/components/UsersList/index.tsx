import React, { useEffect, useState, useCallback } from 'react';

import api from '../../services/api';
import Socket from '../../services/socket';

import { useAuth } from '../../hooks/auth';

import { Container, Title, Separator, UserContent } from './styles';

interface User {
  _id: string;
  name: string;
  username: string;
  status: 'online' | 'offline';
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const { user: userAuth } = useAuth();

  const socket = Socket({ user_id: userAuth._id });

  const loadUsers = useCallback(() => {
    api.get('users').then((response) => {
      setUsers(response.data);
    });
  }, []);

  const handleChangeStatus = useCallback(
    async (newStatus: 'online' | 'offline') => {
      await api.put('status', {
        newStatus,
      });

      loadUsers();
    },
    [loadUsers]
  );

  useEffect(() => {
    // IIFE --> Immediately Invoked Function Expression
    (async () => {
      const response = await api.get('users');

      setUsers(response.data);
    })();
  }, []);

  useEffect(() => {
    socket.on('changeUserStatus', () => {
      loadUsers();
    });
  }, [loadUsers, socket]);

  return (
    <Container>
      <Title>Usuários</Title>
      <Separator />
      {users.map((user) => (
        <UserContent
          key={user._id}
          status={user.status}
          isUserAuth={user._id === userAuth._id}
        >
          <strong>
            {user.username} {user._id === userAuth._id && <span>~ you</span>}
          </strong>
          <button
            type='button'
            disabled={user._id !== userAuth._id}
            onClick={() =>
              handleChangeStatus(
                user.status === 'offline' ? 'online' : 'offline'
              )
            }
          />
        </UserContent>
      ))}
    </Container>
  );
};

export default UsersList;
