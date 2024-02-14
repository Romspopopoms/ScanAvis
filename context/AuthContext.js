import React, { createContext, useState, useEffect, useCallback } from 'react';
import fetch from 'node-fetch';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [subscriptionsUpdate, setSubscriptionsUpdate] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [googleBusiness, setGoogleBusiness] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const clearError = () => setErrorMessage('');
  const handleError = (message) => setErrorMessage(message);

  const [isFormLocked, setIsFormLocked] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    // Accès à localStorage seulement côté client
    const isLocked = localStorage.getItem('isFormLocked');
    if (isLocked !== null) {
      setIsFormLocked(JSON.parse(isLocked));
    }

    const message = localStorage.getItem('confirmationMessage');
    if (message) {
      setConfirmationMessage(message);
    }
  }, []);

  const updateConfirmationMessage = (message) => {
    setConfirmationMessage(message);
    localStorage.setItem('confirmationMessage', message); // Mettre à jour le localStorage
  };

  useEffect(() => {
    // Stocker les valeurs dans localStorage seulement côté client
    localStorage.setItem('isFormLocked', isFormLocked);
  }, [isFormLocked]);

  useEffect(() => {
    localStorage.setItem('confirmationMessage', confirmationMessage);
  }, [confirmationMessage]);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    setUserSubscriptions([]);
  };

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
      console.log('Données reçues pour les abonnements:', data.subscriptions); // Ajoutez ceci pour le débogage

      setUserSubscriptions(data.subscriptions || []);
    } catch (error) {
      handleError(`Error fetching user subscriptions: ${error.message}`);
    } finally {
      setIsLoading(false); // Assurez-vous que isLoading est réinitialisé même en cas d'erreur
    }
  }, []);

  const fetchUserDetails = useCallback(async (uuid) => {
    try {
      const response = await fetch(`/.netlify/functions/getUserDetails?userUuid=${uuid}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
      }

      const data = await response.json();
      // Mise à jour du contexte avec les nouvelles informations
      if (data.email) setUser((prevUser) => ({ ...prevUser, email: data.email }));
      if (data.entreprise) setEntreprise(data.entreprise);
      if (data.googleBusiness) setGoogleBusiness(data.googleBusiness);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l’utilisateur :', error);
      handleError(`Erreur lors de la récupération des détails : ${error.message}`);
    }
  }, []);

  const updateUserDetails = useCallback(async (newEmail, newEntreprise, newGoogleBusiness) => {
    if (!user || !user.uuid) {
      console.error('Aucun utilisateur connecté pour mettre à jour les détails.');
      setErrorMessage('Vous devez être connecté pour mettre à jour les informations.');
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/updateUserDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userUuid: user.uuid,
          email: newEmail,
          entreprise: newEntreprise,
          googleBusiness: newGoogleBusiness,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }

      setUser((prevUser) => ({ ...prevUser, email: newEmail }));
      setEntreprise(newEntreprise);
      setGoogleBusiness(newGoogleBusiness);
      console.log('Informations de l\'utilisateur mises à jour avec succès.');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des détails de l\'utilisateur:', error);
      setErrorMessage(`Erreur lors de la mise à jour: ${error.message}`);
    }
  }, [user, setUser, setEntreprise, setGoogleBusiness]); // Assurez-vous d'inclure toutes les dépendances externes utilisées dans la fonction

  useEffect(() => {
    if (user?.uuid) {
      fetchUserDetails(user.uuid);
    }
  }, [user?.uuid, fetchUserDetails]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      fetchUserSubscriptions(userData.uuid);
      fetchUserDetails(userData.uuid);
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

  const handleEnvoyerMessage = async (titre, message) => {
    const webhookUrl = 'https://hook.eu2.make.com/ifknchx9h9banxrnyau6ahqpgz099rp1';

    // Construisez la chaîne de subscriptionItems en utilisant seulement le nom du service.
    const subscriptionItems = userSubscriptions.map((sub) => sub.items).join('; ');

    const payload = {
      titre,
      message,
      entreprise, // Utilise directement l'état 'entreprise'
      subscriptionItems, // Chaîne des noms de service des abonnements
    };

    console.log('Payload avant envoi:', payload); // Ajoutez ceci pour le débogage

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'envoi du message au webhook : ${response.statusText}`);
      }

      // Ajoutez un log pour voir la réponse du serveur
      console.log('Réponse du serveur:', await response.text());

      console.log('Message envoyé avec succès au webhook');
    } catch (error) {
      console.error(`Erreur lors de l'envoi du message : ${error.message}`);
    }
  };

  const envoyerAvantagesAuWebhook = async (avantages) => {
    const webhookUrl = 'https://hook.eu2.make.com/6iy18py5lq2fdiwmmd7vw54u52tanvlr'; // Remplacez par l'URL réelle de votre webhook

    const subscriptionItems = userSubscriptions.map((sub) => sub.items).join('; ');

    const payload = {
      avantages: avantages.filter((av) => av).join('; '),
      entreprise,
      subscriptionItems,
    };

    console.log('Payload avant envoi:', payload);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'envoi des avantages au webhook : ${response.statusText}`);
      }

      console.log('Avantages envoyés avec succès au webhook');
    } catch (error) {
      console.error(`Erreur lors de l'envoi des avantages : ${error.message}`);
    }
  };

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
      entreprise,
      setEntreprise,
      googleBusiness,
      setGoogleBusiness,
      fetchUserDetails,
      updateUserDetails,
      handleEnvoyerMessage,
      envoyerAvantagesAuWebhook,
      isFormLocked,
      setConfirmationMessage,
      confirmationMessage,
      setIsFormLocked,
      updateConfirmationMessage,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
