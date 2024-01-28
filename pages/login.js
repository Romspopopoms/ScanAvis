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
        handleAuthCode(data.access_token); // Utiliser la fonction de contexte pour traiter la réponse de connexion
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <form className="bg-gray-700 bg-opacity-80 rounded-lg shadow-xl p-8 space-y-6" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold text-center text-white mb-4">Connexion</h1>
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

            <div>
              <label htmlFor="username" className="text-sm font-bold text-white block mb-2">Nom d'utilisateur</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-2 p-3 rounded text-gray-900"
                placeholder="Entrez votre nom d'utilisateur"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-bold text-white block mb-2">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 p-3 rounded text-gray-900"
                placeholder="Entrez votre mot de passe"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
            >
              Se connecter
            </button>

            <div className="text-center text-white">
              <a href="/forgot-password" className="text-sm hover:text-blue-400">Mot de passe oublié ?</a>
            </div>

            <hr className="my-6 border-gray-500" />

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-red-500 text-white p-3 rounded hover:bg-red-600"
            >
              Connexion avec Google
            </button>

            <p className="mt-6 text-sm text-center text-white">
              Pas encore de compte ? <a href="/register" className="hover:text-blue-400">Inscrivez-vous</a>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
