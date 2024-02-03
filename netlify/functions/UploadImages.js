const Busboy = require('busboy');
const { Octokit } = require('@octokit/rest');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Fonction pour récupérer le SHA actuel d'un fichier dans le dépôt
async function getCurrentSha(octokit, filePathInRepo) {
  try {
    const response = await octokit.repos.getContent({
      owner: 'Romspopopoms',
      repo: 'ScanAvis',
      path: filePathInRepo,
    });
    return response.data.sha;
  } catch (error) {
    if (error.status !== 404) { // Ignore not found errors, as it means the file does not exist yet
      console.error(`Failed to fetch current SHA for ${filePathInRepo}:`, error);
      throw new Error(`Failed to fetch current SHA for ${filePathInRepo}`);
    }
  }
}

async function uploadFile(file, octokit) {
  const contentBuffer = fs.readFileSync(file.filepath);
  const contentEncoded = contentBuffer.toString('base64');
  const filePathInRepo = `uploaded_images/${file.filename}`;

  // Tentative de téléchargement avec gestion des conflits de SHA
  async function attemptUpload(sha) {
    try {
      const params = {
        owner: 'Romspopopoms',
        repo: 'ScanAvis',
        path: filePathInRepo,
        message: `Add new image via serverless function: ${file.filename}`,
        content: contentEncoded,
        sha,
      };
      await octokit.repos.createOrUpdateFileContents(params);
      console.log(`File ${file.filename} created or updated successfully.`);
    } catch (error) {
      if (error.status === 409 && !sha) {
        console.log(`SHA conflict for ${file.filename}, attempting to fetch current SHA and retry.`);
        const currentSha = await getCurrentSha(octokit, filePathInRepo);
        return attemptUpload(currentSha);
      }
      console.error('File upload failed:', error);
      throw new Error(`File upload failed: ${file.filename}`);
    }
  }

  return attemptUpload(); // Start the upload process, initially without a SHA
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

    busboy.on('file', (fieldname, file, filename, mimetype) => {
      console.log(`File [${fieldname}]: filename: ${filename}`);
      const filepath = path.join(tmpdir, filename);
      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);

      const fileWrite = new Promise((resolve, reject) => {
        file.on('end', () => writeStream.end());
        writeStream.on('finish', () => resolve({ fieldname, filename, filepath, mimetype }));
        writeStream.on('error', (error) => reject(new Error(error)));
      });

      fileWrites.push(fileWrite);
    });

    busboy.on('finish', async () => {
      console.log('Done parsing form!');
      try {
        const writtenFiles = await Promise.all(fileWrites);
        await Promise.all(writtenFiles.map((file) => uploadFile(file, octokit)));
        console.log('All files uploaded successfully');
        outerResolve({ statusCode: 200, body: 'All files uploaded successfully' });
      } catch (error) {
        console.error('Operation failed:', error);
        outerReject(new Error('Operation failed'));
      }
    });

    if (event.isBase64Encoded) {
      busboy.end(Buffer.from(event.body, 'base64'));
    } else {
      busboy.end(event.body);
    }
  });
};
