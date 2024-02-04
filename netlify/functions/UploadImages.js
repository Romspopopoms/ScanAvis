const Busboy = require('busboy');
const { Octokit } = require('@octokit/rest');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');
const { conn } = require('../../utils/db');
const { generateHtmlPage } = require('./ReturnHtml');
const { pushHtmlToRepoAndTriggerNetlify } = require('./PushDeployHtml');

const GITHUB_OWNER = 'Romspopopoms';
const GITHUB_REPO = 'ScanAvis';
const UPLOAD_PATH = 'uploaded_images';
const NETLIFY_SITE_URL = 'https://scanavis.netlify.app';

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
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS });
  const busboy = new Busboy({ headers: event.headers });
  const tmpdir = os.tmpdir();
  const fileWrites = [];
  let userUuid;
  let subscriptionId;
  let titrePage; // Définir la variable titrePage ici

  busboy.on('field', (fieldname, val) => {
    if (fieldname === 'userUuid') userUuid = val;
    if (fieldname === 'subscriptionId') subscriptionId = val;
    if (fieldname === 'titre') titrePage = val; // Stocker la valeur du titre de la page
  });

  busboy.on('file', (fieldname, file, filename) => {
    const filepath = path.join(tmpdir, filename);
    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    const fileWrite = new Promise((resolve, reject) => {
      file.on('end', () => writeStream.end());
      writeStream.on('finish', () => resolve({ fieldname, filename, filepath }));
      writeStream.on('error', reject);
    });

    fileWrites.push(fileWrite);
  });

  return new Promise((resolve, reject) => {
    busboy.on('finish', async () => {
      try {
        const writtenFiles = await Promise.all(fileWrites);
        const pageId = uuidv4();
        const insertPageQuery = 'INSERT INTO UserPages (pageId, titre, user_uuid, subscriptionId) VALUES (?, ?, ?, ?)';
        await conn.execute(insertPageQuery, [pageId, titrePage, userUuid, subscriptionId]);

        const updatePagePromises = writtenFiles.map(async (file) => {
          const url = await uploadFile(file, octokit);
          const field = file.fieldname === 'imageDeFond' ? 'imageDeFondURL' : 'logoURL';
          const updatePageQuery = `UPDATE UserPages SET ${field} = ? WHERE pageId = ?`;
          await conn.execute(updatePageQuery, [url, pageId]);
        });

        await Promise.all(updatePagePromises);

        console.log('All files uploaded successfully and database updated');

        const filePath = await generateHtmlPage(pageId);
        const reactContent = fs.readFileSync(filePath, 'utf8');

        await pushHtmlToRepoAndTriggerNetlify(reactContent, titrePage);

        const deployedPageUrl = `${NETLIFY_SITE_URL}/pages/${slugify(titrePage, { lower: true })}`;

        resolve({
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Page created and deployment initiated.',
            pageUrl: deployedPageUrl,
          }),
        });
      } catch (error) {
        console.error('Operation failed:', error);
        reject(new Error(`Operation failed: ${error.message}`)); // Utiliser un objet Error pour le rejet
      }
    });

    if (event.isBase64Encoded) {
      busboy.end(Buffer.from(event.body, 'base64'));
    } else {
      busboy.end(event.body);
    }
  });
};
