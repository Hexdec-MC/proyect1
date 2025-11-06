'use client';

import Image from "next/image";
import styles from '@/app/cs/NavEstile.module.css'; 

const Logo = () => {
  return (
    <div className={styles.logo}>
      <Image 
        src="/logo.avif" 
        alt="Logo de la aplicación"
        width={100}      // Reemplaza con el ancho real de tu logo
        height={50}      // Reemplaza con el alto real de tu logo
      />
    </div>
  );
};

export default Logo;