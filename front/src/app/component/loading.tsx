// components/Loading.tsx
import React from 'react';
import styles from './Loading.module.css'; 

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <img className='logo' src="/logo_noir.png" alt="Logo" />
      <p className={styles.customParagraph}>Chargement en cours...</p>
    </div>
  );
};

export default Loading;
