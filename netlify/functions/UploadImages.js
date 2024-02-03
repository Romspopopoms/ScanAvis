const formidable = require('formidable-serverless');
const simpleGit = require('simple-git')();

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  return new Promise((resolve) => { // Retirez 'reject' si vous ne l'utilisez pas
    const form = new formidable.IncomingForm();

    form.parse(event, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return resolve({ statusCode: 500, body: 'Server Error' });
      }

      try {
        // Configurez simple-git avec votre méthode d'authentification
        // Assurez-vous d'avoir les droits d'accès pour push dans le dépôt

        // Ajoutez et commitez le fichier image
        await simpleGit.add(files.image.path);
        await simpleGit.commit('Add new image via serverless function');
        await simpleGit.push();

        resolve({ statusCode: 200, body: 'Image uploaded successfully' });
      } catch (gitError) {
        console.error('Git operation failed:', gitError);
        resolve({ statusCode: 500, body: 'Git operation failed' }); // Utilisez resolve pour gérer les erreurs
      }
    });
  });
};
