const Busboy = require('busboy');
const { Octokit } = require('@octokit/rest');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Pour générer des ID uniques
const { conn } = require('../../utils/db'); // Assurez-vous que ce chemin correspond à votre structure de projet

const GITHUB_OWNER = 'Romspopopoms';
const GITHUB_REPO = 'ScanAvis';
const UPLOAD_PATH = 'uploaded_images';

async function getCurrentSha(octokit, filePathInRepo) {
  try {
    const response = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePathInRepo,
    });
    return response.data.sha;
  } catch (error) {
    if (error.status !== 404) {
      console.error(`Failed to fetch current SHA for ${filePathInRepo}:`, error);
      throw new Error(`Failed to fetch current SHA for ${filePathInRepo}`);
    }
    return null;
  }
}

async function uploadFile(file, octokit) {
  const contentBuffer = fs.readFileSync(file.filepath);
  const contentEncoded = contentBuffer.toString('base64');
  const filePathInRepo = `${UPLOAD_PATH}/${file.filename}`;

  try {
    let sha = await getCurrentSha(octokit, filePathInRepo);
    const params = {
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePathInRepo,
      message: `Add/update image via serverless function: ${file.filename}`,
      content: contentEncoded,
      ...(sha && { sha }),
    };

    try {
      await octokit.repos.createOrUpdateFileContents(params);
    } catch (error) {
      if (error.status === 409) {
        // Conflit de SHA, récupérez le SHA actuel et réessayez
        console.log(`SHA conflict detected for ${filePathInRepo}. Retrieving the latest SHA and retrying...`);
        sha = await getCurrentSha(octokit, filePathInRepo);
        params.sha = sha; // Mettez à jour le SHA dans les paramètres
        await octokit.repos.createOrUpdateFileContents(params); // Réessayez avec le nouveau SHA
      } else {
        throw error; // S'il s'agit d'une autre erreur, la transmettre
      }
    }

    console.log(`File ${file.filename} uploaded successfully.`);
    return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/main/${filePathInRepo}?raw=true`;
  } catch (error) {
    console.error(`Failed to upload file ${file.filename}:`, error);
    throw new Error(`Failed to upload file ${file.filename}`);
  }
}

exports.handler = async (event) => {
  console.log('Handler started');
  if (event.httpMethod !== 'POST') {
    console.log('Invalid HTTP method');
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS });

  return new Promise((outerResolve, outerReject) => {
    const busboy = new Busboy({ headers: event.headers });
    const tmpdir = os.tmpdir();
    const fileWrites = [];

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const filepath = path.join(tmpdir, filename);
      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);

      const fileWrite = new Promise((innerResolve, innerReject) => {
        file.on('end', () => writeStream.end());
        writeStream.on('finish', () => innerResolve({ fieldname, filename, filepath, mimetype }));
        writeStream.on('error', (error) => innerReject(new Error(error)));
      });

      fileWrites.push(fileWrite);
    });

    busboy.on('finish', async () => {
      try {
        const writtenFiles = await Promise.all(fileWrites);
        const uploadedFiles = await Promise.all(writtenFiles.map((file) => uploadFile(file, octokit)));
        const pageId = uuidv4(); // Générer un ID unique pour la page

        // Insérer les détails de la page dans la base de données
        const insertQuery = 'INSERT INTO UserPages (pageId, titre, imageDeFondURL, logoURL, user_uuid) VALUES (?, ?, ?, ?, ?)';
        uploadedFiles.forEach(async (url, index) => {
          const { fieldname } = writtenFiles[index];
          const values = [pageId, 'Titre de la page', null, null, 'userUuid']; // Remplacez "userUuid" par la valeur réelle de l'UUID de l'utilisateur
          if (fieldname === 'imageDeFond') values[2] = url;
          if (fieldname === 'logo') values[3] = url;
          console.log('Attempting to insert into database', insertQuery, values);
          await conn.execute(insertQuery, values);
          console.log('Successfully inserted', values);
        });

        outerResolve({ statusCode: 200, body: JSON.stringify({ message: 'All files uploaded successfully', pageId }) });
      } catch (error) {
        console.error('Operation failed:', error);
        outerReject(new Error(`Operation failed: ${error.message}`));
      }
    });

    if (event.isBase64Encoded) {
      busboy.end(Buffer.from(event.body, 'base64'));
    } else {
      busboy.end(event.body);
    }
  });
};

