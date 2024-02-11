import React, { createContext, useState, useCallback, useEffect } from 'react';
import fetch from 'node-fetch';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [googleBusiness, setGoogleBusiness] = useState('');

  const clearError = () => setErrorMessage('');
  const handleError = (message) => setErrorMessage(message);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    setUserSubscriptions([]);
  }, []);

  const fetchUserSubscriptions = useCallback(async (uuid) => {
    if (isLoading || !uuid) return; // Prévention de l'exécution si isLoading est vrai ou uuid est falsy

    setIsLoading(true);
    try {
      const response = await fetch(`/.netlify/functions/getUserSubscriptions?userUuid=${uuid}`);
      if (response.status === 404) {
        setUserSubscriptions([]); // Gestion du cas où aucun abonnement n'est trouvé
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Gestion des erreurs HTTP
      }
      const data = await response.json();
      setUserSubscriptions(data.subscriptions || []);
    } catch (error) {
      handleError(`Error fetching user subscriptions: ${error.message}`);
    } finally {
      setIsLoading(false); // Assurez-vous que isLoading est réinitialisé même en cas d'erreur
    }
  }, []);

  const fetchUserDetails = useCallback(async (uuid) => {
    try {
      const response = await fetch(`/.netlify/functions/getUserDetails?userUuid=${uuid}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setUser((prevUser) => ({ ...prevUser, ...data }));
      setEntreprise(data.entreprise);
      setGoogleBusiness(data.googleBusiness);
    } catch (error) {
      handleError(`Error fetching user details: ${error.message}`);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUser(userData);
      fetchUserSubscriptions(userData.uuid);
      fetchUserDetails(userData.uuid);
    }
  }, [fetchUserSubscriptions, fetchUserDetails]);

  const handleResubscribe = async (subscriptionId) => {
    try {
      const response = await fetch('/.netlify/functions/resubscribeSubscription', {
        method: 'POST',
        body: JSON.stringify({ subscriptionId, userUuid: user?.uuid }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      fetchUserSubscriptions(user?.uuid);
    } catch (error) {
      handleError(`Error during resubscription: ${error.message}`);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      const response = await fetch('/.netlify/functions/cancelSubscription', {
        method: 'POST',
        body: JSON.stringify({ subscriptionId, userUuid: user?.uuid }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      fetchUserSubscriptions(user?.uuid);
    } catch (error) {
      handleError(`Error during unsubscription: ${error.message}`);
    }
  };

  const verifyTokenWithServer = useCallback(async (token) => {
    try {
      const response = await fetch('/.netlify/functions/verifyToken', {
        method: 'POST',
        body: JSON.stringify({ idToken: token }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.user) {
        setIsAuthenticated(true);
        setUser({
          ...data.user,
        });
        localStorage.setItem('authToken', data.user.access_token);
        fetchUserSubscriptions(data.user.uuid);
      } else {
        logout();
        handleError(data.error || 'Token verification error');
      }
    } catch (error) {
      logout();
      handleError(`Token verification error: ${error.message}`);
    }
  }, [fetchUserSubscriptions, logout]);

  const handleAuthCode = useCallback(async (code) => {
    clearError();
    try {
      const response = await fetch('/.netlify/functions/oauth', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.user) {
        setIsAuthenticated(true);
        setUser({ ...data.user });
        localStorage.setItem('user', JSON.stringify(data.user));
        fetchUserSubscriptions(data.user.uuid);
      } else {
        handleError(data.error || 'Error processing the auth code');
      }
    } catch (error) {
      handleError(`Error sending auth code: ${error.message}`);
    }
  }, [fetchUserSubscriptions]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const token = localStorage.getItem('authToken');
    if (code) {
      handleAuthCode(code);
    } else if (token) {
      verifyTokenWithServer(token);
    }
  }, [handleAuthCode, verifyTokenWithServer]);

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch('/.netlify/functions/refresh-token', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem('authToken', data.accessToken);
        setUser((currentUser) => ({ ...currentUser, access_token: data.accessToken }));
        setIsAuthenticated(true);
      } else {
        logout();
        handleError(data.error || 'Error refreshing token');
      }
    } catch (error) {
      logout();
      handleError(`Token refresh error: ${error.message}`);
    }
  };

  const envoyerMessage = async (titre, message) => {
    const webhookUrl = 'VOTRE_WEBHOOK_URL'; // Remplacez par votre URL de webhook réelle
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titre, message }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message au webhook');
      }

      // Traitez ici la réponse du webhook si nécessaire
      console.log('Message envoyé avec succès au webhook');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      // Gérez l'erreur ici, par exemple, en mettant à jour un état d'erreur dans votre contexte
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userSubscriptions,
        isLoading,
        errorMessage,
        entreprise,
        googleBusiness,
        logout,
        handleResubscribe,
        handleCancelSubscription,
        verifyTokenWithServer,
        refreshAccessToken,
        handleError,
        clearError,
        fetchUserSubscriptions,
        fetchUserDetails,
        envoyerMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
