import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Obtention de l'URL d'authentification OAuth2
  const getAuthUrl = async () => {
    try {
      console.log('Tentative de récupération de l\'URL d\'authentification...');
      const response = await fetch('/.netlify/functions/request');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { url } = await response.json();
      console.log('URL d\'authentification récupérée:', url);
      // window.location.href = url;
      console.log('Redirection bloquée pour le débogage, URL récupérée:', url);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'URL d\'authentification:', error);
    }
  };

  // Traitement du code ou ID Token reçu après l'authentification OAuth2
  const handleAuthResponse = async (response) => {
    try {
      console.log('Traitement de la réponse d\'authentification...');
      const data = await response.json();

      if (response.ok) {
        console.log('Réponse d\'authentification réussie:', data);
        setIsAuthenticated(true);
        setUser({ email: data.user.email, name: data.user.name, access_token: data.user.access_token });
        localStorage.setItem('authToken', data.user.access_token); // Stocker le token dans le stockage local
        console.log('Token stocké dans le stockage local:', data.user.access_token);
      } else {
        console.error('Erreur lors du traitement de la réponse:', data.message);
      }
    } catch (error) {
      console.error('Erreur lors du traitement de la réponse:', error);
    }
  };

  // Déconnexion de l'utilisateur
  const logout = async () => {
    try {
      console.log('Déconnexion de l\'utilisateur...');
      localStorage.removeItem('authToken'); // Effacer le token du stockage local
      setIsAuthenticated(false);
      setUser(null);
      console.log('Utilisateur déconnecté et token supprimé du stockage local');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Vérification de l'état d'authentification initial
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken'); // Récupérer le token du stockage local
      console.log('Vérification du token:', token);
      if (token) {
        try {
          console.log('Envoi du token pour vérification...');
          const response = await fetch('/.netlify/functions/oauth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken: token }), // Envoyer le token pour vérification
          });
          handleAuthResponse(response);
        } catch (error) {
          console.error('Erreur lors de la vérification du token:', error);
        }
      } else {
        console.log('Aucun token trouvé dans le stockage local.');
      }
    };

    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, getAuthUrl, handleAuthCode: handleAuthResponse, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
