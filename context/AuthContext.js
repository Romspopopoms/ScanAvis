import React, { createContext, useState, useEffect } from 'react';
import fetch from 'node-fetch';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [subscriptionsUpdate, setSubscriptionsUpdate] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const clearError = () => setErrorMessage('');
  const handleError = (message) => setErrorMessage(message);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    setUserSubscriptions([]);
  };

  const triggerRerender = () => {
    // Mettre à jour le compteur pour forcer le re-rendu
    setSubscriptionsUpdate(subscriptionsUpdate + 1);
  };

  const fetchUserSubscriptions = async (uuid) => {
    try {
      const response = await fetch(`/.netlify/functions/getUserSubscriptions?userUuid=${uuid}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setUserSubscriptions([]);
        } else {
          throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }
      } else {
        const data = await response.json();
        setUserSubscriptions(data.subscriptions || []);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnements utilisateur:', error);
      handleError(`Erreur lors de la récupération des abonnements: ${error.message}`);
    } finally {
      triggerRerender(); // Forcer le re-rendu après chaque fetch, réussi ou non
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      fetchUserSubscriptions(userData.uuid);
    }
  }, []);

  const handleResubscribe = async (subscriptionId) => {
    try {
      const response = await fetch('/.netlify/functions/resubscribeSubscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId, userUuid: user.uuid }),
      });

      if (!response.ok) throw new Error(`Erreur HTTP ! Statut : ${response.status}`);

      await fetchUserSubscriptions(user.uuid);
    } catch (error) {
      console.error('Erreur lors de la réabonnement:', error);
      handleError(`Erreur lors de la réabonnement: ${error.message}`);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      const response = await fetch('/.netlify/functions/cancelSubscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId, userUuid: user.uuid }),
      });

      if (!response.ok) throw new Error(`Erreur HTTP ! Statut : ${response.status}`);

      await fetchUserSubscriptions(user.uuid);
    } catch (error) {
      console.error('Erreur lors de la désabonnement:', error);
      handleError(`Erreur lors de la désabonnement: ${error.message}`);
    }
  };

  // Déclarée avant la première utilisation
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
        setUser({
          email: data.user.email,
          name: data.user.name,
          access_token: data.user.access_token,
          uuid: data.user.uuid,
        });
        localStorage.setItem('authToken', data.user.access_token);
        fetchUserSubscriptions(data.user.uuid);
      } else {
        logout();
        handleError(data.error || 'Erreur lors de la vérification du token');
      }
    } catch (error) {
      logout();
      handleError(`Erreur lors de la vérification du token: ${error.message}`);
    }
  };

  const getAuthUrl = async () => {
    clearError();
    try {
      const response = await fetch('/.netlify/functions/request', { method: 'GET' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const { url } = await response.json();
      return url;
    } catch (error) {
      handleError(`Erreur lors de la récupération de l'URL d'authentification: ${error.message}`);
    }
  };

  const handleAuthResponse = async (response) => {
    clearError();
    try {
      const data = await response.json();
      if (response.ok && data.user) {
        const userData = { // Définir userData à partir de data.user
          uuid: data.user.uuid,
          email: data.user.email,
          name: data.user.name,
          access_token: data.user.access_token,
        };
        localStorage.setItem('user', JSON.stringify(userData)); // Sauvegarder dans le localStorage
        setUser(userData); // Mettre à jour l'état de l'utilisateur
        setIsAuthenticated(true); // Mettre à jour l'état d'authentification
        fetchUserSubscriptions(data.user.uuid); // Charger les abonnements de l'utilisateur
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
      userSubscriptions,
      handleResubscribe,
      handleCancelSubscription,
      getAuthUrl,
      handleAuthCode,
      logout,
      verifyTokenWithServer,
      refreshAccessToken,
      errorMessage,
      handleError,
      setSubscriptionsUpdate,
      subscriptionsUpdate,
      fetchUserSubscriptions,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
