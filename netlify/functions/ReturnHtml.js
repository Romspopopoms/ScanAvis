const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const { conn } = require('../../utils/db');

const CLIENT_PAGE_PATH = process.env.CLIENT_PAGE_PATH || path.join(__dirname, '..', 'Page');

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

    const titrePage = 'Votre Titre de Page ici'; // Assumer que vous avez le titre de la page ici
    const pageTitleSlug = slugify(titrePage, { lower: true, remove: /[*+~.()'"!:@]/g });

    const { titre, imageDeFondURL, logoURL } = result.rows[0];

    // Créer le contenu du fichier React
    const reactContent = `
      import React from 'react';
      
      const Page = () => (
        <div className="bg-cover bg-center h-screen" style={{ backgroundImage: 'url("${imageDeFondURL}")' }}>
          <div className="flex flex-col items-center justify-center h-full">
            <img src="${logoURL}" alt="Logo" className="mb-4" />
            <h1 className="text-4xl text-white mb-4">${titre}</h1>
            <div className="bg-white opacity-75 rounded p-4">
              <input
                type="email"
                placeholder="Entrez votre email"
                className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
        </div>
      );
      
      export default Page;
    `;

    const clientPagePath = path.join(CLIENT_PAGE_PATH, `${pageTitleSlug}.js`);

    fs.writeFileSync(clientPagePath, reactContent);

    return clientPagePath;
  } catch (error) {
    console.error('Database query failed:', error);
    throw error;
  }
}

module.exports = { generateHtmlPage };
