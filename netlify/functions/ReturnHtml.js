const prettier = require('prettier'); // Assurez-vous d'installer le package prettier
const { conn } = require('../../utils/db');

async function generateHtmlPage(pageId) {
  if (!pageId) {
    throw new Error('Page ID is required');
  }

  try {
    const query = 'SELECT titre, imageDeFondURL, logoURL FROM UserPages WHERE pageId = ? LIMIT 1';
    const result = await conn.execute(query, [pageId]);

    if (result.rows.length === 0) {
      throw new Error('Page not found');
    }

    const { titre, imageDeFondURL, logoURL } = result.rows[0];

    // Générer le contenu HTML (ou React JSX)
    const reactContent = `
      import React from 'react';
      
      const Page = () => (
        <div className="relative bg-cover bg-center h-screen flex items-center justify-center" style={{ backgroundImage: 'url("${imageDeFondURL}")' }}>
        <div className="flex flex-col items-center">
            <img src="${logoURL}" alt="Logo" className="mb-8 w-32 h-auto" />
            <h1 className="text-5xl text-white mb-8">${titre}</h1>
            <div className="bg-white bg-opacity-50 rounded-lg p-4 shadow-lg mb-8">
        <input
          type="email"
          placeholder="Entrez votre email"
          className="appearance-none rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button className="bg-transparent border border-white text-white py-2 px-6 rounded-full hover:bg-white hover:text-black transition-all duration-300 ease-in-out shadow-lg">
        Envoyer
      </button>
    </div>
  </div>
);

export default Page;
    `;

    // Utiliser Prettier pour formater le code généré
    const formattedReactContent = prettier.format(reactContent, { parser: 'babel', singleQuote: true, // force l'utilisation de guillemets simples
    });

    return formattedReactContent; // Renvoie le contenu HTML / JSX formaté
  } catch (error) {
    console.error('Database query failed:', error);
    throw error;
  }
}

module.exports = { generateHtmlPage };
