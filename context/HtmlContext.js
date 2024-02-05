import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

const HtmlContext = createContext();

export const useHtml = () => useContext(HtmlContext);

export const HtmlProvider = ({ children }) => {
  const { isAuthenticated, user, userSubscriptions, handleError } = useContext(AuthContext);

  const [titre, setTitre] = useState('');
  const [imageDeFond, setImageDeFond] = useState(null);
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isCheckingPage, setIsCheckingPage] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const [pageReady, setPageReady] = useState(false);
  const [userPageUrl, setUserPageUrl] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Ajout d'un compteur pour forcer le re-rendu

  const triggerRerender = () => {
    // Incrémenter le compteur pour forcer le re-rendu
    setUpdateTrigger(updateTrigger + 1);
  };

  // Vérification initiale de la page de l'utilisateur
  useEffect(() => {
    const checkUserPage = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/.netlify/functions/checkPageUrl?userId=${user.uuid}`);
        const data = await response.json();
        if (response.ok && data.hasPage) {
          setUserPageUrl(data.pageUrl);
          setPageReady(true);
          triggerRerender(); // Forcer le re-rendu après la mise à jour
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la page de l'utilisateur", error);
      }
    };
    checkUserPage();
  }, [user]);

  // Vérification périodique de la disponibilité de la page
  useEffect(() => {
    let intervalId;
    if (isCheckingPage && pageUrl) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(pageUrl);
          if (response.ok) {
            setIsCheckingPage(false);
            setPageReady(true);
            setMessage('Votre page est prête !');
            triggerRerender(); // Forcer le re-rendu après la mise à jour
          } else {
            console.log('La page n\'est pas encore disponible.');
          }
        } catch (error) {
          console.error('Erreur lors de la vérification de la disponibilité de la page:', error);
          setMessage('Erreur lors de la vérification de la disponibilité de la page. Veuillez réessayer.');
          setIsCheckingPage(false);
        }
      }, 10000); // Vérifie toutes les 10 secondes
    }
    return () => clearInterval(intervalId);
  }, [isCheckingPage, pageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setMessage('Veuillez vous connecter pour créer une page.');
      return;
    }
    setLoading(true);
    setMessage('Votre page est en cours de préparation. Veuillez patienter...');

    const formData = new FormData();
    formData.append('titre', titre);
    if (imageDeFond) formData.append('imageDeFond', imageDeFond);
    if (logo) formData.append('logo', logo);
    formData.append('userUuid', user.uuid);
    const userSubscriptionId = userSubscriptions?.[0]?.subscriptionId || '';
    formData.append('subscriptionId', userSubscriptionId);

    try {
      const response = await fetch('/.netlify/functions/UploadImages', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de l\'envoi du formulaire.');
      }

      console.log('Réponse du serveur:', result);
      setMessage(result.message || 'Formulaire envoyé avec succès.');
      setPageUrl(result.pageUrl); // Enregistrez l'URL de la page générée
      setFormSubmitted(true);
      setIsCheckingPage(true); // Commencer à vérifier la disponibilité de la page immédiatement
    } catch (error) {
      handleError(error.toString());
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    titre,
    setTitre,
    imageDeFond,
    setImageDeFond,
    logo,
    setLogo,
    loading,
    setLoading,
    message,
    setMessage,
    formSubmitted,
    setFormSubmitted,
    isCheckingPage,
    setIsCheckingPage,
    pageUrl,
    setPageUrl,
    pageReady,
    setPageReady,
    userPageUrl,
    setUserPageUrl,
    handleError,
    isAuthenticated,
    handleSubmit,
    user,
    updateTrigger, // Exposer le compteur pour les mises à jour
  };

  return <HtmlContext.Provider value={value}>{children}</HtmlContext.Provider>;
};

export default HtmlProvider;
