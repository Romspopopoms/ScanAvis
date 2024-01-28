import '../styles/globals.css';
import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import CartSummary from '../components/CartSummary';
import Navbar from '../components/Navbar'; // Assurez-vous que le chemin d'accès est correct
import Footer from '../components/Footer'; // Assurez-vous que le chemin d'accès est correct

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

  // Décider si le résumé du panier doit être affiché
  const shouldDisplayCartSummary = router.pathname !== '/paiement';

  return (
    <AuthProvider> {/* Enrober avec AuthProvider */}
      <CartProvider>
        <div className="flex flex-col min-h-screen gradient-01">
          <Head>
            <title>Scan'Avis</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="preconnect" href="https://stijndv.com" />
            <link rel="stylesheet" href="https://stijndv.com/fonts/Eudoxus-Sans.css" />
          </Head>

          <Navbar />

          <main className="flex-grow">
            {shouldDisplayCartSummary && <CartSummary />}
            <Component {...pageProps} />
          </main>

          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default MyApp;
