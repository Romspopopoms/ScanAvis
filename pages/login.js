import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router'; // Importez useRouter pour gérer la redirection
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { isAuthenticated, getAuthUrl, handleAuthCode } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      const paymentIntent = localStorage.getItem('paymentIntent');
      if (paymentIntent === 'pending') {
        // Nettoyer l'intention de paiement
        localStorage.removeItem('paymentIntent');
        // Rediriger vers la page de paiement
        router.push('/paiement');
      } else {
        // Rediriger vers une autre page, par exemple l'accueil ou le tableau de bord de l'utilisateur
        router.push('/accueil');
      }
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!username || !password) {
      setErrorMessage("Le nom d'utilisateur et le mot de passe sont requis");
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        handleAuthCode(data.access_token);
      } else {
        setErrorMessage(data.error || 'Erreur lors de la connexion');
      }
    } catch (error) {
      setErrorMessage('Problème de connexion réseau');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const authUrl = await getAuthUrl();
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        setErrorMessage(
          "Erreur lors de la récupération de l'URL d'authentification",
        );
      }
    } catch (error) {
      setErrorMessage(
        "Erreur lors de la récupération de l'URL d'authentification",
      );
    }
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="w-full max-w-md">
        <form
          className="space-y-6 rounded-lg bg-white p-8 shadow-lg"
          onSubmit={handleSubmit}
        >
          <h1 className="mb-6 text-center text-5xl font-extrabold text-gray-900">
            Connexion
          </h1>
          {errorMessage && (
            <p className="mb-4 text-center text-sm text-red-600">
              {errorMessage}
            </p>
          )}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              required
              className="mt-1 mb-4 w-full rounded-md border py-2 px-4 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Entrez votre nom d'utilisateur"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              className="mt-1 mb-6 w-full rounded-md border py-2 px-4 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Entrez votre mot de passe"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="mb-4 w-full rounded-md bg-blue-500 py-3 px-4 text-white shadow-md transition duration-200 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Se connecter
          </button>

          <div className="mt-6 text-center text-sm text-gray-700">
            <a href="/" className="font-medium text-blue-600 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
          <hr className="my-6" />
          <button
            type="button"
            className="w-full rounded-md bg-red-600 py-3 px-4 text-white shadow-md transition duration-200 ease-in-out hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            onClick={handleGoogleSignIn}
          >
            Connexion avec Google
          </button>
          <p className="mt-6 text-center text-sm text-gray-700">
            Pas encore de compte ?{' '}
            <a href="/" className="font-medium text-blue-600 hover:underline">
              Inscrivez-vous
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
