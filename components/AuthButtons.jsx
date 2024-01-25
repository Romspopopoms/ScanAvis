import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const LoginButton = () => {
  const { getAuthUrl } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const authUrl = await getAuthUrl();
      if (authUrl) {
        window.location.href = authUrl; // Redirection vers l'URL d'authentification
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <button type="button" onClick={handleLogin} style={{ cursor: 'pointer' }}>
      Se connecter avec Google
    </button>
  );
};

export const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <button type="button" onClick={logout} style={{ cursor: 'pointer' }}>
      Déconnexion
    </button>
  );
};
