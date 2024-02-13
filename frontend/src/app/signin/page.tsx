"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Container } from './styles';
import Layout from '../layout';


export const SignIn: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
 

  // const router = useRouter()
  // const { signIn } = useAuth()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await signIn({ username, password })
      router.push('/chat') 
    } catch (error) {
      console.error(error)
      alert('Erreur de connexion, veuillez vérifier vos identifiants.')
    }
  }

  return (  
    
    <Container>
    <div  >
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

      <Link  legacyBehavior href='/signup'>
        <a>
          Vous n’avez pas de compte ? <span> Créer un compte</span>
        </a>
      </Link>
    </div>
    </Container>

  );
}

export default SignIn