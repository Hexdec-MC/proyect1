'use client';

import Link from 'next/link';
import styles from '@/app/cs/NavEstile.module.css';

const NavLinks = () => {
  const links = [
    { name: 'Inicio', href: '/' },
    { name: 'Productos', href: '/pages/productos' },   // ← Correcto
    { name: 'Contacto', href: '/pages/contacto' },     // ← Correcto
  ];

  return (
    <nav>
      <ul className={styles.navList}>
        {links.map((link) => (
          <li key={link.name}>
            <Link href={link.href} className={styles.navLink}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavLinks;