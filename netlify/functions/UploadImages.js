const formidable = require('formidable-serverless');
const simpleGit = require('simple-git')();

exports.handler = async (event) => {
  console.log('Handler started'); // Log au début de la fonction
  if (event.httpMethod !== 'POST') {
    console.log('Invalid HTTP method'); // Log en cas de méthode HTTP incorrecte
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  return new Promise((resolve) => {
    const form = new formidable.IncomingForm();

    form.parse(event, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return resolve({ statusCode: 500, body: 'Server Error' });
      }

      try {
        const git = simpleGit();
        console.log('Git config - setting user name and email'); // Log avant de configurer git
        await git.addConfig('user.name', 'Romspopopoms');
        await git.addConfig('user.email', 'roman.2009.fr');

        console.log('Git add - adding files to staging'); // Log avant d'ajouter des fichiers
        await git.add('.'); // Ajoute tous les fichiers modifiés

        console.log('Git commit - committing changes'); // Log avant de commiter
        await git.commit('Votre message de commit');

        console.log('Git push - pushing to repository'); // Log avant de push
        await git.push(['-u', 'origin', 'main', '--force'], {
          GIT_SSH_COMMAND: 'ssh -o StrictHostKeyChecking=no',
          GITHUB_TOKEN: process.env.GITHUB_ACCESS,
        });

        // Assurez-vous que le chemin et le nom du fichier sont corrects
        console.log('Adding and committing image:', files.image.path); // Log avant d'ajouter l'image
        await git.add(files.image.path);
        await git.commit('Add new image via serverless function');
        await git.push();

        console.log('Image uploaded successfully'); // Log après le succès
        resolve({ statusCode: 200, body: 'Image uploaded successfully' });
      } catch (gitError) {
        console.error('Git operation failed:', gitError);
        resolve({ statusCode: 500, body: 'Git operation failed' });
      }
    });
  });
};
