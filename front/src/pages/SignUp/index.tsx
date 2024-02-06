import React, { useState, FormEvent, useCallback } from 'react';
import { useHistory, Link } from 'react-router-dom';

import api from '../../services/api';

import { Container } from './styles';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event?.preventDefault();

      await api.post('users', {
        name,
        username,
        password,
      });

      history.push('/');
    },
    [history, name, password, username]
  );

  return (
    <Container>
      <form data-testid='login-form' onSubmit={handleSubmit}>
        <h2>Inscription</h2>
        <input
          type='text'
          placeholder='Votre nom'
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type='text'
          placeholder="Votre nom d'utilisateur"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type='password'
          placeholder='Tapez votre mot de passe'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type='submit'>Entrer</button>
      </form>
      <Link to='/'>J'ai déja un compte</Link>
    </Container>
  );
};

export default SignUp;
