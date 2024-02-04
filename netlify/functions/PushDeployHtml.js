const { Octokit } = require('@octokit/rest');
const fetch = require('node-fetch');
const slugify = require('slugify');

const GITHUB_OWNER = 'Romspopopoms';
const GITHUB_REPO = 'ScanAvis';
const GITHUB_BRANCH = 'main';
const { GITHUB_ACCESS } = process.env;
const { NETLIFY_BUILD_HOOK_URL } = process.env;

const octokit = new Octokit({ auth: GITHUB_ACCESS });

async function pushHtmlToRepoAndTriggerNetlify(reactContent, pageTitle) {
  // Nettoyer le titre de la page pour créer un chemin sûr
  const pageSlug = slugify(pageTitle, { lower: true, remove: /[*+~.()'"!:@]/g });
  const filePath = `pages/${pageSlug}.js`; // Chemin dans le dépôt GitHub où le fichier doit être stocké

  try {
    const contentEncoded = Buffer.from(reactContent).toString('base64');
    let sha;

    // Récupération du SHA actuel du fichier s'il existe déjà
    try {
      const { data } = await octokit.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: filePath,
        ref: GITHUB_BRANCH,
      });
      sha = data.sha;
    } catch (error) {
      if (error.status !== 404) {
        console.error(`Erreur lors de la récupération du SHA pour ${filePath}:`, error);
        throw error;
      }
      // Si le fichier n'existe pas, le SHA reste indéfini
    }

    // Création ou mise à jour du fichier dans le dépôt GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      message: `Mise à jour du composant React: ${pageTitle}`,
      content: contentEncoded,
      sha, // S'il y a un SHA, le fichier sera mis à jour. Sinon, un nouveau fichier sera créé.
      branch: GITHUB_BRANCH,
    });

    // Déclenchement d'un build dans Netlify via le webhook
    const response = await fetch(NETLIFY_BUILD_HOOK_URL, { method: 'POST' });
    if (!response.ok) {
      throw new Error(`Échec de la requête de build Netlify: ${response.statusText}`);
    }

    console.log(`Le build Netlify a été déclenché avec succès pour le composant ${pageTitle}`);
  } catch (error) {
    console.error('Échec de la mise à jour du composant React et du déclenchement du build:', error);
    throw error;
  }
}

module.exports = { pushHtmlToRepoAndTriggerNetlify };
