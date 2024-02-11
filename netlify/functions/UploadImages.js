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
  let userUuid; let subscriptionId; let titrePage;

  busboy.on('field', (fieldname, val) => {
    if (fieldname === 'userUuid') userUuid = val;
    if (fieldname === 'subscriptionId') subscriptionId = val;
    if (fieldname === 'titre') titrePage = val;
  });

  busboy.on('file', (fieldname, file, filename) => {
    const filepath = path.join(tmpdir, filename);
    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    const fileWrite = new Promise((resolve, reject) => {
      file.on('end', () => writeStream.end());
      writeStream.on('finish', () => resolve({ fieldname, filename, filepath }));
      writeStream.on('error', (error) => reject(new Error(`File write error: ${error.message}`)));
    });

    fileWrites.push(fileWrite);
  });

  return new Promise((resolve, reject) => {
    busboy.on('finish', async () => {
      try {
        const writtenFiles = await Promise.all(fileWrites);
        const pageId = uuidv4();
        await conn.execute('INSERT INTO UserPages (pageId, titre, user_uuid, subscriptionId) VALUES (?, ?, ?, ?)', [pageId, titrePage, userUuid, subscriptionId]);

        await Promise.all(writtenFiles.map(async (file) => {
          const url = await uploadFile(file, octokit);
          const field = file.fieldname === 'imageDeFond' ? 'imageDeFondURL' : 'logoURL';
          await conn.execute(`UPDATE UserPages SET ${field} = ? WHERE pageId = ?`, [url, pageId]);
        }));

        console.log('All files uploaded successfully and database updated');
        const htmlContent = await generateHtmlPage(pageId, userUuid);
        const pageSlug = slugify(titrePage, { lower: true });
        await pushHtmlToRepoAndTriggerNetlify(htmlContent, titrePage);
        const deployedPageUrl = `${NETLIFY_SITE_URL}/generated/${pageSlug}`;
        await conn.execute('UPDATE UserPages SET pageUrl = ? WHERE pageId = ?', [deployedPageUrl, pageId]);

        console.log(`Page URL stored in database: ${deployedPageUrl}`);

        const userResult = await conn.execute('SELECT name, email FROM users WHERE uuid = ?', [userUuid]);
        if (userResult.length === 0) {
          console.log('User not found');
          reject(new Error('User not found'));
          return;
        }
        const user = userResult.rows[0];

        const subscriptionResult = await conn.execute('SELECT items FROM Subscriptions WHERE user_uuid = ?', [userUuid]);
        const subscriptionItems = subscriptionResult.rows.map((sub) => sub.items).join(', ');

        const webhookUrl = 'https://hook.eu2.make.com/dnit3dkegq3ovvbietzxj0guoc7u354r';
        const payload = {
          name: user.name,
          email: user.email,
          pageUrl: deployedPageUrl,
          subscriptionItems,
        };

        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!webhookResponse.ok) {
          throw new Error(`Webhook call failed: ${webhookResponse.statusText}`);
        }

        resolve({
          statusCode: 200,
          body: JSON.stringify({
            message: 'Data successfully updated and sent to webhook.',
            pageUrl: deployedPageUrl,
          }),
        });
      } catch (error) {
        console.error('Error:', error);
        reject(new Error(`Internal Server Error: ${error.message}`));
      }
    });

    if (event.isBase64Encoded) {
      busboy.end(Buffer.from(event.body, 'base64'));
    } else {
      busboy.end(event.body);
    }
  });
};
