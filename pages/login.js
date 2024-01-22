import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navbar, Footer } from '../components';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { getAuthUrl } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Vérifiez que username et password ne sont pas vides
    if (!username || !password) {
      console.log('Le nom d\'utilisateur et le mot de passe sont requis');
      return;
    }

    try {
      const response = await fetch('/api/login', {
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
      } else {
        console.error('Erreur lors de la connexion:', data.message);
        // Gérer les erreurs, par exemple en affichant un message à l'utilisateur
      }
    } catch (error) {
      console.error('Erreur de réseau:', error);
      // Gérer les erreurs de réseau, par exemple en affichant un message à l'utilisateur
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-night text-white">
      <Navbar />
      <form className="w-full max-w-md bg-white p-8 space-y-6 shadow-xl rounded-lg border border-opacity-10 border-lightblue" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-center text-violet">Login</h1>

        <div className="input-group space-y-4">
          <label htmlFor="username" className="block text-lg text-violet font-semibold">Nom de compte</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-night bg-night bg-opacity-10 border-violet focus:border-lightblue focus:bg-white focus:ring-1 focus:ring-lightblue"
          />
        </div>

        <div className="input-group space-y-4">
          <label htmlFor="password" className="block text-lg text-violet font-semibold">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-night bg-night bg-opacity-10 border-violet focus:border-lightblue focus:bg-white focus:ring-1 focus:ring-lightblue"
          />
        </div>

        <button type="submit" className="w-full text-white bg-blue py-3 rounded-md hover:bg-lightblue focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out">
          Se connecter
        </button>

        <button type="button" className="w-full text-white bg-violet py-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200 ease-in-out" onClick={getAuthUrl}>
          S'identifier avec Google
        </button>

        <div className="form-footer">
          <div className="flex items-center justify-between">
            <label htmlFor="remember-me" className="flex items-center text-sm text-violet">
              <input id="remember-me" type="checkbox" className="form-checkbox rounded text-blue-600 focus:ring-blue-500" />
              <span className="ml-2">Se souvenir de moi</span>
            </label>
            <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">Vous avez perdu votre mot de passe?</a>
          </div>

          <p className="mt-6 text-center text-sm text-violet">
            Vous n'avez pas de compte? <a href="/register" className="text-blue-600 hover:text-blue-800">Inscrivez-vous</a>
          </p>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default LoginPage;
