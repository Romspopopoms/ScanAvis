// _app.js
import '../styles/globals.css';
import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { PaymentProvider } from '../context/PaymentContext'; // Importez PaymentProvider
import CartSummary from '../components/CartSummary';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const shouldDisplayCartSummary = router.pathname !== '/paiement';

  return (
    <AuthProvider>
      <CartProvider>
        <PaymentProvider> {/* Enrober avec PaymentProvider */}
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
        </PaymentProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default MyApp;
