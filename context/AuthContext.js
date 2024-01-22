import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Obtention de l'URL d'authentification OAuth2
  const getAuthUrl = async () => {
    try {
      const response = await fetch('/.netlify/functions/request');
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'URL d\'authentification:', error);
    }
  };

  // Traitement du code reçu après l'authentification OAuth2
  const handleAuthCode = async (code) => {
    try {
      const response = await fetch('/.netlify/functions/oauth', {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setUser({ email: data.email, name: data.name, access_token: data.access_token });
        localStorage.setItem('authToken', data.access_token); // Stocker le token dans le stockage local
      } else {
        console.error('Erreur lors de l\'échange du code:', data.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'échange du code:', error);
    }
  };

  // Déconnexion de l'utilisateur
  const logout = async () => {
    try {
      // Logique pour informer le backend de la déconnexion (si nécessaire)
      localStorage.removeItem('authToken'); // Effacer le token du stockage local
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Vérification de l'état d'authentification initial
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken'); // Récupérer le token du stockage local
      if (token) {
        try {
          const response = await fetch('/.netlify/functions/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ credential: token }),
          });
          const data = await response.json();
          if (response.ok) {
            setIsAuthenticated(true);
            setUser({ email: data.user.email, name: data.user.name, access_token: token });
          } else {
            // Gérer le cas où le token n'est pas valide
            console.error('Erreur lors de la vérification du token:', data.error);
            localStorage.removeItem('authToken'); // Effacer le token invalide du stockage local
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du token:', error);
        }
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
