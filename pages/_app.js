import '../styles/globals.css';
import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext'; // Importez AuthProvider
import CartSummary from '../components/CartSummary';

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

  // Décider si le résumé du panier doit être affiché
  const shouldDisplayCartSummary = router.pathname !== '/paiement';

  return (
    <AuthProvider> {/* Enrober avec AuthProvider */}
      <CartProvider>
        <Head>
          <title>Scan'Avis</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://stijndv.com" />
          <link rel="stylesheet" href="https://stijndv.com/fonts/Eudoxus-Sans.css" />
        </Head>
        {shouldDisplayCartSummary && <CartSummary />}
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  );
};

export default MyApp;
