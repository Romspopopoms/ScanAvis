import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

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
      <div className="flex-grow flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-xs">
          <h1 className="text-4xl font-bold text-center text-blue-500 mb-4">Connexion</h1>
          <form className="bg-white rounded-lg shadow-2xl p-6 space-y-6" onSubmit={handleSubmit}>
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-gray-700">Nom d'utilisateur</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez votre nom d'utilisateur"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez votre mot de passe"
                autoComplete="current-password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Se connecter
            </button>
            <div className="text-center">
              <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">Mot de passe oublié ?</a>
            </div>
            <div className="w-full border-t border-gray-300" />
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-3 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
            >
              Connexion avec Google
            </button>
            <p className="mt-6 text-sm text-center text-gray-700">
              Pas encore de compte ? <a href="/register" className="text-blue-600 hover:underline">Inscrivez-vous</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
