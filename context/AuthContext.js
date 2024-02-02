import React, { createContext, useState, useEffect } from 'react';
import fetch from 'node-fetch';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const clearError = () => setErrorMessage('');

  const handleError = (message) => setErrorMessage(message);

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  const getAuthUrl = async () => {
    clearError();
    try {
      const response = await fetch('/.netlify/functions/request', { method: 'GET' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const { url } = await response.json();
      return url; // Retourne l'URL pour une redirection ultérieure
    } catch (error) {
      handleError(`Erreur lors de la récupération de l'URL d'authentification: ${error.message}`);
    }
  };

  const handleAuthResponse = async (response) => {
    clearError();
    try {
      const data = await response.json();
      if (response.ok) {
        setIsAuthenticated(true);
        setUser({
          uuid: data.user.uuid,
          email: data.user.email,
          name: data.user.name,
          access_token: data.user.access_token,
        });
        localStorage.setItem('authToken', data.user.access_token);
      } else {
        handleError(data.error || 'Erreur lors du traitement de la réponse.');
      }
    } catch (error) {
      handleError(`Erreur lors du traitement de la réponse: ${error.message}`);
    }
  };

  const handleAuthCode = async (code) => {
    clearError();
    try {
      const response = await fetch('/.netlify/functions/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await handleAuthResponse(response);
    } catch (error) {
      handleError(`Erreur lors de l'envoi du code: ${error.message}`);
    }
  };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch('/.netlify/functions/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const data = await response.json();
      if (response.ok) {
        const { accessToken } = data;
        localStorage.setItem('authToken', accessToken);
        setUser((currentUser) => ({ ...currentUser, access_token: accessToken }));
        setIsAuthenticated(true);
      } else {
        logout();
        handleError(data.error || 'Erreur lors du rafraîchissement du token.');
      }
    } catch (error) {
      logout();
      handleError(`Erreur lors du rafraîchissement du token: ${error.message}`);
    }
  };

  const verifyTokenWithServer = async (token) => {
    try {
      const response = await fetch('/.netlify/functions/verifyToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      });
      const data = await response.json();
      if (response.ok && data.user) {
        setIsAuthenticated(true);
        setUser({ email: data.user.email, name: data.user.name, access_token: data.user.access_token });
        localStorage.setItem('authToken', data.user.access_token);
      } else {
        logout();
        handleError(data.error || 'Erreur lors de la vérification du token');
      }
    } catch (error) {
      logout();
      handleError(`Erreur lors de la vérification du token: ${error.message}`);
    }
  };

  useEffect(() => {
    clearError();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const token = localStorage.getItem('authToken');
    if (code) {
      handleAuthCode(code);
    } else if (token) {
      verifyTokenWithServer(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      getAuthUrl,
      handleAuthCode,
      logout,
      verifyTokenWithServer,
      refreshAccessToken,
      errorMessage,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
