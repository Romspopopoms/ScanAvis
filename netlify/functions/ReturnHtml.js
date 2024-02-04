const { conn } = require('../../utils/db');

async function generateHtmlPage(pageId) {
  if (!pageId) {
    throw new Error('Page ID is required');
  }

  try {
    const query = 'SELECT titre, imageDeFondURL, logoURL FROM UserPages WHERE pageId = ? LIMIT 1';
    const result = await conn.execute(query, [pageId]);
    console.log('Résultat de la requête:', result);
    const { rows } = result;

    if (rows.length === 0) {
      throw new Error('Page not found');
    }

    const { titre, imageDeFondURL, logoURL } = rows[0];

    // Générer le HTML personnalisé en utilisant les données de la page
    const html = `
          <div class="bg-cover bg-center h-screen" style="background-image: url('${imageDeFondURL}')">
            <div class="flex flex-col items-center justify-center h-full">
              <img src="${logoURL}" alt="Logo" class="mb-4" />
              <h1 class="text-4xl text-white mb-4">${titre}</h1>
              <div class="bg-white opacity-75 rounded p-4">
                <input
                  type="email"
                  placeholder="Entrez votre email"
                  class="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </div>
        `;

    // Retourner la page HTML personnalisée
    return html;
  } catch (error) {
    console.error('Database query failed:', error);
    throw error; // Relayer l'erreur pour un traitement ultérieur
  }
}

module.exports = { generateHtmlPage };
