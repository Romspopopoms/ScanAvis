const Busboy = require('busboy');
const simpleGit = require('simple-git')();
const path = require('path');
const os = require('os');
const fs = require('fs');

exports.handler = async (event) => {
  console.log('Handler started');
  if (event.httpMethod !== 'POST') {
    console.log('Invalid HTTP method');
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  return new Promise((outerResolve, outerReject) => {
    const busboy = new Busboy({ headers: event.headers });
    const tmpdir = os.tmpdir();
    const fields = {};
    const files = [];
    const fileWrites = [];

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      console.log(`File [${fieldname}]: filename: ${filename}`);
      const filepath = path.join(tmpdir, filename);
      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);

      const fileWrite = new Promise((fileResolve, fileReject) => {
        file.on('end', () => writeStream.end());
        writeStream.on('finish', () => fileResolve({ fieldname, filename, filepath, mimetype }));
        writeStream.on('error', fileReject);
      });

      files.push({ fieldname, filename, filepath, mimetype });
      fileWrites.push(fileWrite);
    });

    busboy.on('field', (fieldname, value) => {
      console.log(`Field [${fieldname}]: value: ${value}`);
      fields[fieldname] = value;
    });

    busboy.on('finish', async () => {
      console.log('Done parsing form!');
      const writtenFiles = await Promise.all(fileWrites);

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
        const commitPromises = writtenFiles.map(async (file) => {
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
        const error = new Error('Git operation failed');
        error.statusCode = 500;
        error.body = 'Git operation failed';
        outerReject(error);
      }
    });

    if (event.isBase64Encoded) {
      busboy.end(Buffer.from(event.body, 'base64'));
    } else {
      busboy.end(event.body);
    }
  });
};
