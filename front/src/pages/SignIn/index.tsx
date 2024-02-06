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
        <h2>Connectez-vous</h2>
        <p> Connectez-vous pour accéder à votre espace </p>
        
        <input
          type='text'
          placeholder="Entrez votre nom d'utilisateur "
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      
        <input
          type='password'
          placeholder='Taper votre mot de passe'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type='submit'>Connexion</button>
      </form>
      <Link to='/signup'>Vous n’avez pas de compte ? <span> Créer un compte</span></Link>
    </Container>
  );
};

export default SignIn;
