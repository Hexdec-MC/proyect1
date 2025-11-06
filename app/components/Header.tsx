'use client';

import Logo from './Logo';
import NavLinks from './Navlinks';
import styles from '@/app/cs/NavEstile.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo />
        <NavLinks />
      </div>
    </header>
  );
};

export default Header;