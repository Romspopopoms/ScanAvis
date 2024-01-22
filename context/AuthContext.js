import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const getAuthUrl = async () => {
    try {
      console.log('Tentative de récupération de l\'URL d\'authentification...');
      const response = await fetch('/.netlify/functions/request');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { url } = await response.json();
      console.log('URL d\'authentification récupérée:', url);
      window.location.href = url;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'URL d\'authentification:', error.message);
      // Gérer l'affichage d'erreur pour l'utilisateur
    }
  };

  const handleAuthResponse = async (response) => {
    try {
      const data = await response.json();
      if (response.ok) {
        console.log('Réponse d\'authentification réussie:', data);
        setIsAuthenticated(true);
        setUser({ email: data.user.email, name: data.user.name, access_token: data.user.access_token });
        localStorage.setItem('authToken', data.user.access_token);
      } else {
        console.error('Erreur lors du traitement de la réponse:', data.message);
        // Gérer l'affichage d'erreur pour l'utilisateur
      }
    } catch (error) {
      console.error('Erreur lors du traitement de la réponse:', error.message);
      // Gérer l'affichage d'erreur pour l'utilisateur
    }
  };

  const handleAuthCode = async (code) => {
    try {
      console.log('Envoi du code pour vérification...');
      const response = await fetch('/.netlify/functions/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      await handleAuthResponse(response);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du code:', error.message);
      // Gérer l'affichage d'erreur pour l'utilisateur
    }
  };

  const logout = async () => {
    try {
      console.log('Déconnexion de l\'utilisateur...');
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error.message);
      // Gérer l'affichage d'erreur pour l'utilisateur
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      handleAuthCode(code);
    }

    const verifyToken = () => {
      const token = localStorage.getItem('authToken');
      console.log('Vérification du token:', token);
      if (token) {
        console.log('Envoi du token pour vérification...');
        fetch('/.netlify/functions/oauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken: token }),
        })
          .then(handleAuthResponse)
          .catch((error) => {
            console.error('Erreur lors de la vérification du token:', error.message);
            // Gérer l'affichage d'erreur pour l'utilisateur
          });
      } else {
        console.log('Aucun token trouvé dans le stockage local.');
        // Gérer cette situation selon les besoins de votre application
      }
    };

    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, getAuthUrl, handleAuthCode, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
