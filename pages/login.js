import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

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
    <div className="min-h-screen flex items-center justify-center bg-night">
      <form className="w-full max-w-md bg-white p-8 space-y-6 shadow-md rounded-md" onSubmit={handleSubmit}>
        <h1 className="text-xl font-bold text-center text-night">Login</h1>

        <div className="input-group">
          <label htmlFor="username" className="text-violet">Nom de compte</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-lightblue rounded-md"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password" className="text-violet">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-lightblue rounded-md"
          />
        </div>

        <button type="submit" className="w-full bg-blue text-white p-2 rounded-md hover:bg-lightblue transition duration-200">Se connecter</button>

        <button type="button" className="w-full bg-violet text-white p-2 rounded-md hover:bg-lightblue transition duration-200" onClick={getAuthUrl}>
          S'identifier avec Google
        </button>

        <div className="form-footer text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="form-checkbox" />
              <label htmlFor="remember-me" className="ml-2 text-night">Se souvenir de moi</label>
            </div>
            <a href="/forgot-password" className="text-blue hover:text-lightblue">Vous avez perdu votre mot de passe?</a>
          </div>
          <div className="text-center">
            Vous n'avez pas de compte? <a href="/register" className="text-blue hover:text-lightblue">Inscrivez-vous</a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
