"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "./styles";
import ThemeSwitcher from "@/components/shared/themeswitcher";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("L'adresse e-mail est invalide.");
      return;
    }

    const url = process.env.NEXT_PUBLIC_BASE_URL + "user/register";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
    });

    if (response.status === 400) {
      alert("Cet utilisateur existe déjà");
    } else if (response.status === 201) {
      router.push("/signin");
    } else {
      throw new Error("Une erreur inattendue s'est produite");
    }
  };

  return (
    <Container>
      <div>
        <ThemeSwitcher />
        <form data-testid="signup-form" onSubmit={handleSubmit}>
          <h2>Inscrivez-vous</h2>
          <p> Créez un compte pour accéder à votre espace </p>

          <input
            type="text"
            placeholder="Entrez votre nom d'utilisateur "
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <input
            type="email"
            placeholder="Entrez votre adresse e-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Taper votre mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <input
            type="password"
            placeholder="Confirmez votre mot de passe"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          <button type="submit">Inscription</button>
        </form>

        <Link legacyBehavior href="/signin">
          <a>
            Vous avez déjà un compte ? <span> Se connecter</span>
          </a>
        </Link>
      </div>
    </Container>
  );
}