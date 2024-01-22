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
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

        {/* Champs de connexion classique */}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Bouton de connexion classique */}
        <button type="submit">Login</button>

        {/* Bouton pour l'authentification Google */}
        <button type="button" onClick={getAuthUrl}>
          Login with Google
        </button>

        <div className="form-footer">
          <div className="checkbox">
            <input id="remember-me" type="checkbox" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <a href="/forgot-password">Forgot password?</a>
        </div>

        <div className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
