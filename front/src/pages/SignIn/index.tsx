import React, { useState, FormEvent, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';

import { Container } from './styles';

const SignIn: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useAuth();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event?.preventDefault();

      await signIn({ username, password });
    },
    [password, signIn, username]
  );

  return (
    <Container>
      <form data-testid='login-form' onSubmit={handleSubmit}>
        <h2>Faça seu login</h2>
        <input
          type='text'
          placeholder='Digite seu nome de usuário'
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type='password'
          placeholder='Digite sua senha'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type='submit'>Entrar</button>
      </form>
      <Link to='/signup'>Me cadastrar</Link>
    </Container>
  );
};

export default SignIn;
