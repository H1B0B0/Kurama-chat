"use client";
import Footer from "@/components/Home/Footer";
import LoginForm from "@/components/Home/LoginForm";
import Navbar from "@/components/Home/Navbar";
import ThemeSwitcher from "@/components/shared/themeswitcher";

export default function Home() {
  return (
    <>
      <ThemeSwitcher />
      <Navbar />
      <main>
        <div className="flex px-5 pt-16 pb-12 mb-12 lg:px-36 min-h-[calc(100vh-180px)]">
          <div className="flex flex-col gap-8 w-full xl:pr-32 lg:w-1/2">
            <div className="flex flex-col gap-0">
              <p className=" text-[72px] lg:mt-40  leading-[70px] lg:text-[90px] bg-gradient-to-r dark:from-red-600 dark:via-red-200 to-emerald- 4 inline-block text-transparent bg-clip-text from-red-800 via-red-700">
                Kurama-chat
                <br /> anytime, anywhere
              </p>
              <p className="text-lg leading-7 dark:text-gray-300">
                Kurama-chat makes it easy and fun to quickly chat with people
                all around the globe.
              </p>
            </div>
            <LoginForm />
          </div>
          <div className="object-cover w-0 lg:w-1/3 ml-40">
            <img src="/images/hero3.svg" alt="hero" />
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
