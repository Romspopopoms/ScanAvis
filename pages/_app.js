import '../styles/globals.css';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import netlifyIdentity from 'netlify-identity-widget';
import { CartProvider } from '../context/CartContext';
import CartSummary from '../components/CartSummary';

const MyApp = ({ Component, pageProps }) => {
  const [appUser, setAppUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Initialisation de Netlify Identity
    netlifyIdentity.init();

    // Gérer la connexion
    netlifyIdentity.on('login', (user) => setAppUser(user));
    // Gérer la déconnexion
    netlifyIdentity.on('logout', () => setAppUser(null));

    // Nettoyage de l'effet
    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  // Décider si le résumé du panier doit être affiché
  const shouldDisplayCartSummary = router.pathname !== '/paiement';

  return (
    <CartProvider>
      <Head>
        <title>Scan'Avis</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://stijndv.com" />
        <link rel="stylesheet" href="https://stijndv.com/fonts/Eudoxus-Sans.css" />
      </Head>
      {shouldDisplayCartSummary && <CartSummary />}
      <Component {...pageProps} user={appUser} setUser={setAppUser} />
    </CartProvider>
  );
};

export default MyApp;
