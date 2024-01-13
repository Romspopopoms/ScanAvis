import React, { useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

const MonProfil = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Initialisation de Netlify Identity si ce n'est pas déjà fait
    if (!netlifyIdentity.currentUser()) {
      netlifyIdentity.init();
    }
    // Écouter l'événement de connexion pour mettre à jour l'utilisateur
    netlifyIdentity.on('login', (user) => {
      setUserProfile(user);
    });

    // Récupérer l'utilisateur actuellement connecté
    const currentUser = netlifyIdentity.currentUser();
    if (currentUser) {
      setUserProfile(currentUser);
    }

    // Nettoyer l'écouteur d'événements lors du démontage
    return () => {
      netlifyIdentity.off('login');
    };
  }, []);

  if (!userProfile) {
    // Si l'utilisateur n'est pas connecté ou en cours de récupération, afficher un chargement ou retourner null
    return <div>Chargement de votre profil...</div>;
  }

  // Contenu de la page Mon Profil
  // Contenu de la page Mon Profil
  return (
    <div className="profil-container">
      <h1>Mon Profil</h1>
      <table className="profil-table">
        <tbody>
          <tr>
            <th>Nom</th>
            <td>{userProfile.user_metadata.full_name}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{userProfile.email}</td>
          </tr>
          {/* Ajoutez d'autres informations ici, chaque paire clé-valeur comme une ligne du tableau */}
        </tbody>
      </table>
    </div>
  );
};

export default MonProfil;
