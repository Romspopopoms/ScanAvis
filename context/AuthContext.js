import React, { createContext, useState, useEffect, useCallback } from 'react';
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
    if (isLoading || !uuid) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/.netlify/functions/getUserSubscriptions?userUuid=${uuid}`);
      if (response.status === 404) {
        setUserSubscriptions([]); // Aucun abonnement trouvé, ce n'est pas une erreur
        // Vous pouvez ici arrêter l'exécution ou définir un état indiquant qu'il n'y a pas d'abonnements
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Gestion des autres erreurs HTTP
      }
      const data = await response.json();
      setUserSubscriptions(data.subscriptions || []);
    } catch (error) {
      handleError(`Error fetching user subscriptions: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
