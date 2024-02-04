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
        <div className="bg-cover bg-center h-screen" style={{ backgroundImage: 'url("${imageDeFondURL}")' }}>
          <div className="flex flex-col items-center justify-center h-full">
            <img src="${logoURL}" alt="Logo" className="mb-6 w-20 h-auto" />
            <h1 className="text-4xl text-white mb-4">${titre}</h1>
            <div className="bg-white bg-opacity-75 rounded-lg p-4 shadow-lg mb-6">
              <input
                type="email"
                placeholder="Entrez votre email"
                className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition ease-in-out duration-300">
          Envoyer
        </button>
          </div>
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
