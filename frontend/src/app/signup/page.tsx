import React, { useState, FormEvent, useCallback } from 'react';
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
        <p>Inscrivez-vous pour accéder à votre espace</p>
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
        <button type='submit'>Validé</button>
      </form>
      <Link to='/'>Vous avez déja un compte ? <span>Cliquer ici !</span></Link>
    </Container>
  );
};

export default SignUp;
