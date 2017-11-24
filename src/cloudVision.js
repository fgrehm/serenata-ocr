const fs = require('fs');

const fetch = require('node-fetch');

// TODO: Load from config file
const apiKey = '...';

function cloudVision({ languageHint, ocrFeature }) {
  const imageContext = { };
  if (languageHint) {
    imageContext.languageHints = [languageHint];
  }

  let featureType = 'TEXT_DETECTION';
  if (ocrFeature === 'gcloud_document_text') {
    featureType = 'DOCUMENT_TEXT_DETECTION';
  }

  return (receiptImagePath) => {
    const payload = {
      requests: [
        {
          features: [ { type: featureType } ],
          image: { content: new Buffer(fs.readFileSync(receiptImagePath)).toString('base64') },
          imageContext
        }
      ]
    };

    const opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      timeout: 50000
    };
    console.log("Will OCR");

    return fetch(`https://vision.clients6.google.com/v1/images:annotate?key=${apiKey}`, opts).
      then(resp => {
        console.log("Finished OCR");
        return resp.json();
      }).then(json => {
        return json.responses[0];
      });
  }
}

module.exports = cloudVision;
