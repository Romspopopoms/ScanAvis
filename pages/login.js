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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900">
      <div className="flex flex-grow items-center justify-center px-6 py-8">
        <div className="w-full max-w-xs">
          <form className="space-y-6 rounded-lg bg-white p-6 shadow-2xl" onSubmit={handleSubmit}>
            <h1 className="mb-4 text-center text-4xl font-bold text-blue-500">Connexion</h1>
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-bold text-gray-700">Nom d'utilisateur</label>
              <input id="username" type="text" className="w-full rounded-lg bg-gray-200 p-3 text-gray-700 placeholder-gray-500" placeholder="Entrez votre nom d'utilisateur" autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-bold text-gray-700">Mot de passe</label>
              <input id="password" type="password" className="w-full rounded-lg bg-gray-200 p-3 text-gray-700 placeholder-gray-500" placeholder="Entrez votre mot de passe" autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full rounded-lg bg-blue-600 p-3 text-white transition duration-200 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50">Se connecter</button>

            <div className="text-center text-sm text-gray-700">
              <a href="/" className="hover:text-blue-500">Mot de passe oublié ?</a>
            </div>
            <hr className="my-6 border-gray-300" />
            <button type="button" className="w-full rounded-lg bg-red-600 p-3 text-white transition duration-200 hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
              onClick={handleGoogleSignIn}
            >
              Connexion avec Google
            </button>
            <p className="mt-6 text-center text-sm text-gray-700">Pas encore de compte ? <a href="/" className="hover:text-blue-500">Inscrivez-vous </a></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
