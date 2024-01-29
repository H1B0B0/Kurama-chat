"use client"
import React, {useState, useEffect} from 'react'
import Link from "next/link";
import Loading from './component/loading'

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    setTimeout(() => {
      setLoading(true);
    }, 3000); 
  }, []);

  return (
    <main>
      {loading ? (
        <Loading />
      ) : (
        <>
         
        </>
      )}
    </main>
  );
};

export default Home;