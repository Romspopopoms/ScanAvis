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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="flex flex-grow items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <form className="mb-4 space-y-6 rounded-lg bg-white px-8 pt-6 pb-8 shadow-md" onSubmit={handleSubmit}>
            <h1 className="text-center text-3xl font-extrabold text-gray-900">Connexion</h1>
            errorMessage && <p className="text-center text-sm text-red-600">{errorMessage}</p>
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
              <input id="username" type="text" className="mb-4 w-full rounded border py-2 px-3 text-gray-700 shadow-sm" placeholder="Entrez votre nom d'utilisateur" autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Mot de passe</label>
              <input id="password" type="password" className="mb-4 w-full rounded border py-2 px-3 text-gray-700 shadow-sm" placeholder="Entrez votre mot de passe" autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">Se connecter</button>

            <div className="text-center text-sm text-gray-700">
              <a href="/" className="hover:text-blue-600">Mot de passe oublié ?</a>
            </div>
            <hr className="my-6 border-gray-300" />
            <button type="button" className="w-full rounded bg-red-600 py-2 px-4 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
              onClick={handleGoogleSignIn}
            >
              Connexion avec Google
            </button>
            <p className="mt-6 text-center text-sm text-gray-700">Pas encore de compte ? <a href="/" className="hover:text-blue-600">Inscrivez-vous</a></p>
          </form>
        </div>
      </div>
    </div>

  );
};

export default LoginPage;
