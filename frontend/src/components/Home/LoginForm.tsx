"use client";
import { useUser } from "@/contexts/UserContext";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import Link from "next/link";

function LoginForm() {
  const [name, setName] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUsername } = useUser();
  const router = useRouter();

  const handleInputChange = (e: any) => {
    setName(e.target.value);
  };
  const onStart = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (name) {
      let userId = localStorage.getItem("userId");
      if (!userId) {
        userId =
          Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem("userId", userId);
      }
      localStorage.setItem("name", name);
      setUsername(name);
    }
    router.push("/chat");
  };
  return (
    <div>
      <form
        className="flex flex-col gap-3 dark:bg-custom-gray"
        onSubmit={onStart}
      >
        <div className="flex flex-col gap-3">
          <input
            type="text"
            className="px-6 py-6 text-lg text-gray-600 w-80 h-10 bg-gray-100 border-gray-[rgba(0,0,0,.2)] rounded-full focus:outline-none border focus:border-primary focus:bg-gray-50 focus:placeholder-gray-400/60 placeholder:text-base dark:bg-gray-700 dark:text-gray-300"
            placeholder="Display Name"
            onChange={handleInputChange}
            minLength={3}
            maxLength={20}
            required={true}
          />
          <div className="flex gap-2 p-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-white accent-primary"
            />
            <p className="font-light dark:text-gray-300">Keep me signed in</p>
          </div>
        </div>
        <div className="flex  gap-5 items-center">
          <button
            type="submit"
            className="flex  justify-center items-center w-40 btn"
          >
            {isLoading ? (
              <ClipLoader color="white" size={20} />
            ) : (
              "Start Chatting"
            )}
          </button>
          <Link legacyBehavior href="signin">
            <a className="flex  justify-center items-center w-40 btn">
              Sign In
            </a>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
