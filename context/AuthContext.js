import React, { createContext, useState, useEffect } from 'react';
import fetch from 'node-fetch';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userUuid, setUserUuid] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const clearError = () => {
    console.log('Clearing errors');
    setErrorMessage('');
  };

  const handleError = (message) => {
    console.error('Error:', message);
    setErrorMessage(message);
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    setUserUuid(null);
  };

  const getAuthUrl = async () => {
    clearError();
    try {
      const response = await fetch('/.netlify/functions/request', {
        method: 'GET',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const { url } = await response.json();
      console.log('Received authentication URL:', url);
      return url; // Retourner l'URL pour une utilisation ultérieure
    } catch (error) {
      handleError(`Erreur lors de la récupération de l'URL d'authentification: ${error.message}`);
      return null; // Retourner null en cas d'erreur
    }
  };

  const handleAuthResponse = async (response) => {
    clearError();
    try {
      console.log('Processing authentication response');
      const data = await response.json();
      if (response.ok) {
        console.log('Authentication successful:', data);
        setIsAuthenticated(true);
        setUser({ email: data.user.email, name: data.user.name, access_token: data.user.access_token });
        setUserUuid(data.user.uuid);
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
      console.log('Sending code for authentication:', code);
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

  // Effect pour gérer l'authentification basée sur l'URL ou le localStorage
  useEffect(() => {
    clearError();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      console.log('Code found in URL, handling authentication:', code);
      handleAuthCode(code);
    } else {
      const token = localStorage.getItem('authToken');
      if (token) {
        console.log('Token found in local storage, verifying');
        // Vous devrez peut-être ajuster cette partie pour vérifier le token correctement
        handleAuthResponse(token);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      userUuid,
      getAuthUrl, // getAuthUrl pour obtenir l'URL d'authentification
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
