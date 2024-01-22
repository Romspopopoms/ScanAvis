import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const LoginButton = () => {
  const { getAuthUrl } = useContext(AuthContext);

  return (
    <button type="button" onClick={getAuthUrl} style={{ cursor: 'pointer' }}>
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
