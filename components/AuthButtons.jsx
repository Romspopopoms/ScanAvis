import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// LoginButton.js
export const LoginButton = () => {
  const { getAuthUrl } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      console.log('Attempting to get auth URL...');
      const authUrl = await getAuthUrl();
      console.log('Auth URL received:', authUrl);
      if (authUrl) {
        console.log('Redirecting to:', authUrl);
        window.location.href = authUrl;
      } else {
        console.error('Auth URL not received.');
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
