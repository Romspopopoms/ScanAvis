const Busboy = require('busboy');
const simpleGit = require('simple-git')();
const path = require('path');
const os = require('os');
const fs = require('fs');

exports.handler = async (event) => {
  console.log('Handler started'); // Log au début de la fonction
  if (event.httpMethod !== 'POST') {
    console.log('Invalid HTTP method'); // Log en cas de méthode HTTP incorrecte
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  return new Promise((outerResolve, outerReject) => {
    const busboy = new Busboy({ headers: event.headers });
    const tmpdir = os.tmpdir();
    const fields = {};
    const files = [];
    const fileWrites = [];

    // Gérer les fichiers uploadés
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      console.log(`File [${fieldname}]: filename: %j`, filename);
      const filepath = path.join(tmpdir, filename);
      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);

      // File has been written to os.tmpdir()
      const fileWrite = new Promise((fileResolve, fileReject) => {
        file.on('end', () => writeStream.end());
        writeStream.on('finish', () => fileResolve(filepath));
        writeStream.on('error', fileReject);
      });

      files.push({ fieldname, filename, filepath, mimetype });
      fileWrites.push(fileWrite);
    });

    // Gérer les champs non-fichier
    busboy.on('field', (fieldname, value) => {
      console.log(`Field [${fieldname}]: value: %j`, value);
      fields[fieldname] = value;
    });

    // Fin du parsing
    busboy.on('finish', async () => {
      console.log('Done parsing form!');
      await Promise.all(fileWrites);

      try {
        const git = simpleGit();
        console.log('Git config - setting user name and email');
        await git.addConfig('user.name', 'Romspopopoms');
        await git.addConfig('user.email', 'roman.2009.fr');

        console.log('Git add - adding files to staging');
        await git.add('.'); // Ajoute tous les fichiers modifiés

        console.log('Git commit - committing changes');
        await git.commit('Votre message de commit');

        // Ajoutez et commitez chaque fichier image
        const commitPromises = files.map(async (file) => {
          console.log('Adding and committing image:', file.filepath);
          await git.add(file.filepath);
          await git.commit(`Add new image via serverless function: ${file.filename}`);
        });

        await Promise.all(commitPromises);

        console.log('Git push - pushing to repository');
        await git.push(['-u', 'origin', 'main', '--force'], {
          GIT_SSH_COMMAND: 'ssh -o StrictHostKeyChecking=no',
          GITHUB_TOKEN: process.env.GITHUB_ACCESS,
        });

        console.log('Image uploaded successfully');
        outerResolve({ statusCode: 200, body: 'Image uploaded successfully' });
      } catch (gitError) {
        console.error('Git operation failed:', gitError);
        // Créer un nouvel objet Error pour le rejet de la promesse
        const error = new Error('Git operation failed');
        error.statusCode = 500;
        error.body = 'Git operation failed';
        outerReject(error);
      }
    });

    // Netlify Functions utilise event.body pour les données POST
    if (event.isBase64Encoded) {
      busboy.end(Buffer.from(event.body, 'base64'));
    } else {
      busboy.end(event.body);
    }
  });
};
