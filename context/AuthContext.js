import React, { createContext, useState, useEffect } from 'react';
import { OAuth2Client } from 'google-auth-library';
import fetch from 'node-fetch';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
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
    localStorage.removeItem('authToken'); // Supprime le token du stockage local
    setIsAuthenticated(false);
    setUser(null);
  };

  const verifyToken = async (token) => {
    try {
      console.log('Verifying token:', token);
      const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
      const ticket = await oAuth2Client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
      });
      const payload = ticket.getPayload();
      console.log('Token verified, payload:', payload);

      // Si le token est valide, mettez à jour l'état d'authentification ici
      setIsAuthenticated(true);
      setUser({ email: payload.email, name: payload.name, access_token: token });
    } catch (error) {
      console.error('Token verification failed:', error.message);
      logout(); // Déconnexion si le token n'est pas valide
    }
  };

  // Fonction pour obtenir l'URL d'authentification
  const getAuthUrl = async () => {
    clearError();
    try {
      console.log('Requesting authentication URL');
      const response = await fetch('/.netlify/functions/request', {
        method: 'GET',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const { url } = await response.json();
      console.log('Received authentication URL:', url);
      window.location.href = url; // Redirection vers l'URL d'authentification
    } catch (error) {
      handleError(`Erreur lors de la récupération de l'URL d'authentification: ${error.message}`);
    }
  };

  // Fonction pour traiter la réponse d'authentification
  const handleAuthResponse = async (response) => {
    clearError();
    try {
      console.log('Processing authentication response');
      const data = await response.json();
      if (response.ok) {
        console.log('Authentication successful:', data);
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

  // Fonction pour envoyer le code pour l'authentification
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
        verifyToken(token); // Vérifier le token pour validation
      }
    }
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
