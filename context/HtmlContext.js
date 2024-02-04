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

  useEffect(() => {
    const checkUserPage = async () => {
      try {
        const response = await fetch(`/.netlify/functions/checkPageUrl?userId=${user.uuid}`);
        if (response.ok) {
          const data = await response.json();
          if (data.hasPage) {
            setUserPageUrl(data.pageUrl);
            setPageReady(true);
          }
        } else {
          console.error("Erreur lors de la vérification de la page de l'utilisateur");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la page de l'utilisateur", error);
      }
    };

    if (user) {
      checkUserPage();
    }
  }, [user]);

  const checkPageAvailability = async () => {
    console.log(`Vérification de la disponibilité de la page: ${pageUrl}`);
    try {
      const response = await fetch(pageUrl);
      if (response.ok) {
        setIsCheckingPage(false);
        setPageReady(true);
        setMessage('Votre page est prête !');
      } else {
        console.log('La page n\'est pas encore disponible.');
        // Après un certain nombre de tentatives, arrêtez de vérifier et montrez un message d'erreur ou un bouton de rechargement.
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la disponibilité de la page:', error);
      setMessage('Erreur lors de la vérification de la disponibilité de la page. Veuillez réessayer.');
      setIsCheckingPage(false);
    }
  };

  useEffect(() => {
    if (isCheckingPage && pageUrl) {
      const intervalId = setInterval(checkPageAvailability, 10000); // Vérifie toutes les 10 secondes
      return () => clearInterval(intervalId);
    }
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
    const userSubscriptionId = userSubscriptions.length > 0 ? userSubscriptions[0].subscriptionId : '';
    formData.append('subscriptionId', userSubscriptionId);

    try {
      const response = await fetch('/.netlify/functions/UploadImages', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de l'envoi du formulaire: ${errorText}`);
      }

      const result = await response.json();
      console.log('Réponse du serveur:', result);
      console.log('URL reçue du serveur:', result.pageUrl);
      setMessage(result.message || 'Formulaire envoyé avec succès.');
      setPageUrl(result.pageUrl); // Enregistrez l'URL de la page générée
      setFormSubmitted(true);
      setIsCheckingPage(true); // Commencer à vérifier la disponibilité de la page
    } catch (error) {
      handleError(`Erreur lors de l'envoi du formulaire: ${error.message}`);
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
  };

  return <HtmlContext.Provider value={value}>{children}</HtmlContext.Provider>;
};
