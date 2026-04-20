const Busboy = require('busboy');

function parseMultipartForm(req) {
  return new Promise((resolve, reject) => {
    const fields = {};
    const files = {};
    
    const busboy = new Busboy({ headers: req.headers });
    
    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });
    
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const buffers = [];
      file.on('data', (data) => {
        buffers.push(data);
      });
      file.on('end', () => {
        files[fieldname] = {
          buffer: Buffer.concat(buffers),
          originalname: filename,
          mimetype: mimetype,
          encoding: encoding
        };
      });
    });
    
    busboy.on('finish', () => {
      resolve({ fields, files });
    });
    
    busboy.on('error', (err) => {
      reject(err);
    });
    
    // Pipe the request body to busboy
    if (req.body) {
      // If body is already parsed (from Vercel), use it
      try {
        const parsed = JSON.parse(req.body);
        resolve({ fields: parsed, files: {} });
        return;
      } catch (e) {
        // Not JSON, continue with busboy
      }
    }
    
    // For serverless, we need to handle the stream differently
    // Vercel provides the body as a buffer or string
    if (req.body && !req.body.pipe) {
      // Body is a buffer/string, not a stream
      // This is a limitation in serverless functions
      // For now, we'll assume JSON for non-file uploads
      try {
        const parsed = JSON.parse(req.body);
        resolve({ fields: parsed, files: {} });
      } catch (e) {
        resolve({ fields: {}, files: {} });
      }
    } else {
      busboy.end(req.body);
    }
  });
}

module.exports = { parseMultipartForm };
