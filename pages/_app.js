import '../styles/globals.css';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

const MyApp = ({ Component, pageProps }) => {
  const [appUser, setAppUser] = useState(null);

  useEffect(() => {
    netlifyIdentity.init();

    const handleLogin = (user) => {
      setAppUser(user);
      // Ne fermez pas le widget ici, laissez-le gérer son état lui-même
    };

    netlifyIdentity.on('login', handleLogin);
    netlifyIdentity.on('logout', () => setAppUser(null));

    // Lorsque le composant est démonté, retirez les gestionnaires d'événements
    return () => {
      netlifyIdentity.off('login', handleLogin);
      netlifyIdentity.off('logout');
    };
  }, []);

  return (
    <>
      <Head>
        <title>Scan'Avis</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://stijndv.com" />
        <link
          rel="stylesheet"
          href="https://stijndv.com/fonts/Eudoxus-Sans.css"
        />
      </Head>
      {/* Passer l'état user et la fonction setUser au composant qui a besoin */}
      <Component {...pageProps} user={appUser} setUser={setAppUser} />
    </>
  );
};

export default MyApp;
