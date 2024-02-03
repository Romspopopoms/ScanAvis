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
async function getUserUuid(userEmail) {
  try {
    const query = 'SELECT uuid FROM users WHERE email = ?';
    const result = await conn.execute(query, [userEmail]);
    const [user] = result.rows;
    return user?.uuid;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'UUID pour l'utilisateur avec email ${userEmail}:`, error);
    throw error;
  }
}

async function getSubscriptionId(userUuid) {
  try {
    const query = 'SELECT subscriptionId FROM Subscriptions WHERE user_uuid = ?';
    const result = await conn.execute(query, [userUuid]);
    const [subscription] = result.rows;
    return subscription?.subscriptionId;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'ID de la souscription pour userUuid ${userUuid}:`, error);
    throw error;
  }
}

exports.handler = async (event) => {
  console.log('Handler started');
  if (event.httpMethod !== 'POST') {
    console.log('Invalid HTTP method');
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS });

  return new Promise((outerResolve, outerReject) => { // Utilisez outerResolve et outerReject pour résoudre ou rejeter la promesse
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
        const pageId = uuidv4();

        const userEmail = 'user@example.com'; // Remplacez par la récupération réelle de l'email
        const userUuid = await getUserUuid(userEmail);
        const subscriptionId = await getSubscriptionId(userUuid);

        if (!userUuid || !subscriptionId) {
          console.error('UUID de l’utilisateur ou ID de souscription non trouvé.');
          throw new Error('User UUID or Subscription ID not found');
        }

        const insertQuery = 'INSERT INTO UserPages (pageId, titre, imageDeFondURL, logoURL, user_uuid, subscriptionId) VALUES (?, ?, ?, ?, ?, ?)';
        for (const [index, url] of uploadedFiles.entries()) {
          let values;
          try {
            const { fieldname } = writtenFiles[index];
            values = [pageId, 'Titre de la page', null, null, userUuid, subscriptionId];
            if (fieldname === 'imageDeFond') values[2] = url;
            if (fieldname === 'logo') values[3] = url;

            console.log('Attempting to insert into database', insertQuery, values);
            await conn.execute(insertQuery, values);
            console.log('Successfully inserted', values);
          } catch (error) {
            console.error('Failed to insert', values, error);
            // Ne relancez pas l'erreur ici, sinon cela arrêtera la boucle avant de traiter tous les fichiers
          }
        }

        outerResolve({ statusCode: 200, body: JSON.stringify({ message: 'All files uploaded successfully', pageId }) }); // Utilisez outerResolve ici
      } catch (error) {
        console.error('Operation failed:', error);
        outerReject(new Error(`Operation failed: ${error.message}`)); // Utilisez outerReject ici
      }
    });

    if (event.isBase64Encoded) {
      busboy.end(Buffer.from(event.body, 'base64'));
    } else {
      busboy.end(event.body);
    }
  });
};
