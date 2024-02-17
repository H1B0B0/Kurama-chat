"use client";
import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import ThemeSwitcher from "@/components/shared/themeswitcher";
import { Application } from "@splinetool/runtime";
import jwt from "jsonwebtoken";

export default function SignIn() {
  const { username, setUsername } = useUser();
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const app = new Application(canvasRef.current);
      app.load("https://prod.spline.design/hnkOtrqss6sQ-wLy/scene.splinecode");
    }
  }, []);

  const handleUsernameChange = (e: any) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

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
      setIsLoading(false);
    } else if (response.status === 401) {
      alert("Invalid password");
      setIsLoading(false);
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
    <div className="dark:bg-custom-gray flex items-center justify-center min-h-screen relative">
      <canvas id="canvas3d" ref={canvasRef} className="absolute inset-0" />
      <ThemeSwitcher />
      <form className="flex flex-col gap-3 z-10" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            className="px-6 py-6 text-lg text-gray-600 w-80 h-10 bg-gray-100 border-gray-[rgba(0,0,0,.2)] rounded-full focus:outline-none border from-red-600 focus:bg-gray-50 focus:placeholder-gray-400/60 placeholder:text-base dark:bg-gray-700 dark:text-gray-300"
            placeholder="Username"
            onChange={handleUsernameChange}
            minLength={3}
            maxLength={20}
            required={true}
          />
          <input
            type="password"
            className="px-6 py-6 text-lg text-gray-600 w-80 h-10 bg-gray-100 border-gray-[rgba(0,0,0,.2)] rounded-full focus:outline-none border from-red-600 focus:bg-gray-50 focus:placeholder-gray-400/60 placeholder:text-base dark:bg-gray-700 dark:text-gray-300"
            placeholder="Password"
            onChange={handlePasswordChange}
            minLength={6}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-5 items-center">
          <button
            type="submit"
            className="flex hover:bg-red-800 justify-center items-center py-2 w-full sm:w-40 h-auto btn bg-red-500 "
          >
            {isLoading ? <ClipLoader color="white" size={20} /> : "Sign In"}
          </button>
          <div className="flex flex-row">
            <span className="dark:text-white">Don't have an account ?</span>
            <Link legacyBehavior href="/signup">
              <a className="text-red-700 ml-2"> Sign up</a>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
