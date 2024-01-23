import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const clearError = () => setErrorMessage('');
  const handleError = (message) => setErrorMessage(message);

  const getAuthUrl = async () => {
    clearError();
    try {
      // Utilisez la méthode GET pour demander l'URL d'authentification
      const response = await fetch('/.netlify/functions/request', {
        method: 'GET',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const { url } = await response.json();
      window.location.href = url; // Redirection vers l'URL d'authentification
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
        setUser({ email: data.user.email, name: data.user.name, access_token: data.user.access_token });
        localStorage.setItem('authToken', data.user.access_token);
      } else {
        handleError(data.message || 'Erreur lors du traitement de la réponse.');
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
      await handleAuthResponse(response);
    } catch (error) {
      handleError(`Erreur lors de l'envoi du code: ${error.message}`);
    }
  };

  const logout = () => {
    clearError();
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    clearError();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) handleAuthCode(code);
    const token = localStorage.getItem('authToken');
    if (token) handleAuthCode(token); // Envoyer le token pour vérification si disponible
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      getAuthUrl,
      handleAuthCode,
      logout,
      errorMessage,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
