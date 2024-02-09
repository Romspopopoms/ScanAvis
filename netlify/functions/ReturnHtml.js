const prettier = require('prettier');
const { conn } = require('../../utils/db');

async function generateHtmlPage(pageId, userUuid) {
  if (!pageId || !userUuid) {
    throw new Error('Page ID and User UUID are required');
  }

  try {
    const queryPage = 'SELECT titre, imageDeFondURL, logoURL FROM UserPages WHERE pageId = ? LIMIT 1';
    const resultPage = await conn.execute(queryPage, [pageId]);

    if (resultPage.rows.length === 0) {
      throw new Error('Page not found');
    }

    const { titre, imageDeFondURL, logoURL } = resultPage.rows[0];

    // Ajout: Récupérer les informations supplémentaires
    const queryUser = 'SELECT name, google_business FROM users WHERE uuid = ? LIMIT 1';
    const resultUser = await conn.execute(queryUser, [userUuid]);
    const user = resultUser.rows.length > 0 ? resultUser.rows[0] : null;

    const querySubscription = 'SELECT items FROM Subscriptions WHERE user_uuid = ?';
    const resultSubscription = await conn.execute(querySubscription, [userUuid]);
    const subscriptionItems = resultSubscription.rows.map((sub) => sub.items).join(', ');

    // Vérifier si l'utilisateur et les abonnements ont été trouvés
    if (!user) {
      throw new Error('User not found');
    }

    // Générer le contenu HTML (ou React JSX)
    const reactContent = `
import React, { useState } from 'react';

const Page = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      pageId: "${pageId}",
      name: "${user.name}",
      googleBusiness: "${user.google_business}",
      subscriptionItems: "${subscriptionItems}",
    };

    try {
      const response = await fetch('https://hook.eu2.make.com/y4k7i4onsckj63x4c7j1l51dqus6yu3q?', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Gérer le succès, par exemple afficher un message de succès
        alert('Merci pour votre soumission!');
      } else {
        // Gérer l'erreur, par exemple afficher un message d'erreur
        alert('Une erreur est survenue lors de la soumission.');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('Erreur lors de la communication avec le serveur.');
    }
  };

  return (
    <div className="relative bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url("${imageDeFondURL}")',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw'
      }}>
      <div className="flex flex-col items-center">
        <img src="${logoURL}" alt="Logo" className="mb-6 h-12 w-12" />
        <h1 className="text-4xl text-white mb-4">${titre}</h1>
        <form onSubmit={handleSubmit} className="bg-white bg-opacity-75 rounded-lg p-4 shadow-lg mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre email"
            className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition ease-in-out duration-300">
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
`;

    // Utiliser Prettier pour formater le code généré
    const formattedReactContent = prettier.format(reactContent, {
      parser: 'babel',
      singleQuote: true, // force l'utilisation de guillemets simples
    });

    return formattedReactContent; // Renvoie le contenu HTML / JSX formaté
  } catch (error) {
    console.error('Database query failed:', error);
    throw error;
  }
}

module.exports = { generateHtmlPage };
