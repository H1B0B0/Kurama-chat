"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "./styles";
import ThemeSwitcher from "@/components/shared/themeswitcher";
import jwt from "jsonwebtoken";

export default function SignIn() {
  const { username, setUsername } = useUser();
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const url = process.env.NEXT_PUBLIC_BASE_URL + "user/login";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.status === 404) {
      alert("User not found");
    } else if (response.status === 401) {
      alert("Invalid password");
    } else if (response.status === 200) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      const decodedToken: any = jwt.decode(data.token);
      localStorage.setItem("userId", decodedToken.userId);
      localStorage.setItem("name", username);
      router.push("/chat");
    } else {
      throw new Error("Une erreur inattendue s'est produite");
    }
  };

  return (
    <Container>
      <div>
        <ThemeSwitcher />
        <form data-testid="login-form" onSubmit={handleSubmit}>
          <h2>Connectez-vous</h2>
          <p> Connectez-vous pour accéder à votre espace </p>

          <input
            type="text"
            placeholder="Entrez votre nom d'utilisateur "
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <input
            type="password"
            placeholder="Taper votre mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button type="submit">Connexion</button>
        </form>

        <Link legacyBehavior href="/signup">
          <a>
            Vous n’avez pas de compte ? <span> Créer un compte</span>
          </a>
        </Link>
      </div>
    </Container>
  );
}
