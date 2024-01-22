import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navbar, Footer } from '../components';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Ajout pour gérer les messages d'erreur
  const { getAuthUrl } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Réinitialiser le message d'erreur
    if (!username || !password) {
      setErrorMessage('Le nom d\'utilisateur et le mot de passe sont requis');
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Connexion réussie:', data);
        // Gérer la réussite de la connexion, par exemple en enregistrant le token et en redirigeant l'utilisateur
        // TODO: Rediriger l'utilisateur vers la page d'accueil ou le tableau de bord
      } else {
        console.error('Erreur lors de la connexion:', data.message);
        setErrorMessage(data.message || 'Erreur lors de la connexion'); // Afficher le message d'erreur provenant du serveur
      }
    } catch (error) {
      console.error('Erreur de réseau:', error);
      setErrorMessage('Problème de connexion réseau'); // Informer l'utilisateur d'un problème réseau
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-night text-gray-300">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-6">
        <form className="w-full max-w-lg bg-linear-gradient(135deg, #0f0c29, #302b63, #24243e p-8 space-y-6 shadow-xl rounded-lg" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-center text-violet mb-8">Login</h1>

          {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>} {/* Afficher le message d'erreur */}

          <div className="space-y-4">
            <label htmlFor="username" className="block text-lg font-semibold text-night">Nom de compte</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border rounded-md bg-night bg-opacity-10 border-violet focus:border-lightblue focus:bg-opacity-100 text-white"
            />
          </div>

          <div className="space-y-4">
            <label htmlFor="password" className="block text-lg font-semibold text-night">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-md bg-night bg-opacity-10 border-violet focus:border-lightblue focus:bg-opacity-100 text-white"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out text-white">
            Se connecter
          </button>

          <button type="button" className="w-full bg-purple-600 py-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200 ease-in-out text-white" onClick={getAuthUrl}>
            S'identifier avec Google
          </button>

          <div className="flex items-center justify-between mt-4">
            <label htmlFor="remember-me" className="flex items-center">
              <input id="remember-me" type="checkbox" className="rounded text-blue-500 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-night">Se souvenir de moi</span>
            </label>
            <a href="/forgot-password" className="text-sm hover:text-blue-500">Vous avez perdu votre mot de passe?</a>
          </div>

          <p className="mt-6 text-center text-sm">
            Vous n'avez pas de compte? <a href="/register" className="hover:text-blue-500">Inscrivez-vous</a>
          </p>
        </form>
      </div>
      <Footer className="w-full mt-auto bg-night p-4 text-center text-white" />
    </div>
  );
};

export default LoginPage;
