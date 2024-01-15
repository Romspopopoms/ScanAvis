import '../styles/globals.css';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import { CartProvider } from '../context/CartContext';

const MyApp = ({ Component, pageProps }) => {
  const [appUser, setAppUser] = useState(null);

  useEffect(() => {
    netlifyIdentity.init();

    const handleLogin = (user) => {
      setAppUser(user);
    };

    netlifyIdentity.on('login', handleLogin);
    netlifyIdentity.on('logout', () => setAppUser(null));

    return () => {
      netlifyIdentity.off('login', handleLogin);
      netlifyIdentity.off('logout');
    };
  }, []);

  return (
    <CartProvider>
      <Head>
        <title>Scan'Avis</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://stijndv.com" />
        <link rel="stylesheet" href="https://stijndv.com/fonts/       Eudoxus-Sans.css" />
      </Head>
      <Component {...pageProps} user={appUser} setUser={setAppUser} />
    </CartProvider>
  );
};

export default MyApp;
