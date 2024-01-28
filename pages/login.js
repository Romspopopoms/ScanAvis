import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navbar, Footer } from '../components';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { getAuthUrl, handleAuthCode } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!username || !password) {
      setErrorMessage('Le nom d\'utilisateur et le mot de passe sont requis');
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
        setErrorMessage('Erreur lors de la récupération de l\'URL d\'authentification');
      }
    } catch (error) {
      setErrorMessage('Erreur lors de la récupération de l\'URL d\'authentification');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-xs">
          <form className="bg-white rounded-lg shadow-2xl p-6 space-y-6" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold text-center text-blue-500 mb-4">Connexion</h1>
            {errorMessage && <p className="text-red-400 text-center">{errorMessage}</p>}

            <div>
              <label htmlFor="username" className="text-sm font-bold text-gray-700 block mb-2">Nom d'utilisateur</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-200 text-gray-700 placeholder-gray-500"
                placeholder="Entrez votre nom d'utilisateur"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-bold text-gray-700 block mb-2">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-200 text-gray-700 placeholder-gray-500"
                placeholder="Entrez votre mot de passe"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
            >
              Se connecter
            </button>

            <div className="text-center text-sm text-gray-700">
              <a href="/forgot-password" className="hover:text-blue-500">Mot de passe oublié ?</a>
            </div>

            <hr className="my-6 border-gray-300" />

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full p-3 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
            >
              Connexion avec Google
            </button>

            <p className="mt-6 text-sm text-center text-gray-700">
              Pas encore de compte ? <a href="/register" className="hover:text-blue-500">Inscrivez-vous</a>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
