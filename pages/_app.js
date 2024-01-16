import '../styles/globals.css';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Importez le hook useRouter pour vérifier le chemin de la page
import netlifyIdentity from 'netlify-identity-widget';
import { CartProvider } from '../context/CartContext';
import CartSummary from '../components/CartSummary'; // Assurez-vous que le chemin d'accès est correct

const MyApp = ({ Component, pageProps }) => {
  const [appUser, setAppUser] = useState(null);
  const router = useRouter(); // Utilisez useRouter pour accéder aux informations sur le chemin de la page

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

  // Ne pas afficher le CartSummary sur la page de paiement
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
      {shouldDisplayCartSummary && <CartSummary />} {/* Conditionnellement rendu basé sur le chemin de la page */}
      <Component {...pageProps} user={appUser} setUser={setAppUser} />
    </CartProvider>
  );
};

export default MyApp;
