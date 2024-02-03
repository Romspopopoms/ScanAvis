const Busboy = require('busboy');
const { Octokit } = require('@octokit/rest');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function uploadFile(file, octokit) {
  try {
    const contentBuffer = fs.readFileSync(file.filepath);
    const contentEncoded = contentBuffer.toString('base64');

    // Récupérez le SHA du fichier s'il existe déjà
    let sha = null;
    try {
      const response = await octokit.repos.getContent({
        owner: 'Romspopopoms',
        repo: 'ScanAvis',
        path: `uploaded_images/${file.filename}`,
      });
      sha = response.data.sha;
    } catch (error) {
      console.log(`File does not exist or other error: ${error}`);
    }

    await octokit.repos.createOrUpdateFileContents({
      owner: 'Romspopopoms',
      repo: 'ScanAvis',
      path: `uploaded_images/${file.filename}`,
      message: `Add new image via serverless function: ${file.filename}`,
      content: contentEncoded,
      sha, // Fournissez le SHA ici pour mettre à jour le fichier si nécessaire
    });
    console.log(`File created: ${file.filename}`);
  } catch (error) {
    console.error('File upload failed:', error);
    throw new Error(`File upload failed: ${file.filename}`);
  }
}

exports.handler = async (event) => {
  console.log('Handler started');
  if (event.httpMethod !== 'POST') {
    console.log('Invalid HTTP method');
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS,
  });

  return new Promise((outerResolve, outerReject) => {
    const busboy = new Busboy({ headers: event.headers });
    const tmpdir = os.tmpdir();
    const fields = {};
    const files = [];
    const fileWrites = [];

    busboy.on('file', (fieldname, file, filename, mimetype) => {
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

      const fileUploadPromises = writtenFiles.map((file) => uploadFile(file, octokit));

      Promise.all(fileUploadPromises)
        .then(() => {
          console.log('All files uploaded successfully');
          outerResolve({ statusCode: 200, body: 'All files uploaded successfully' });
        })
        .catch((error) => {
          console.error('Operation failed:', error);
          outerReject(new Error('Operation failed'));
        });
    });

    if (event.isBase64Encoded) {
      busboy.end(Buffer.from(event.body, 'base64'));
    } else {
      busboy.end(event.body);
    }
  });
};
