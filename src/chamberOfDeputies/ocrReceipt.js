const fs = require('fs');

const fetch = require('node-fetch');
const Promise = require('promise');

const pdfToPng = require('../pdfToPng');
const cloudVision = require('../cloudVision');

function fetchReceipt({ applicantId, year, documentId }) {
  const url = `http://www.camara.gov.br/cota-parlamentar/documentos/publ/${applicantId}/${year}/${documentId}.pdf`;
  return fetch(url).then((r) => {
    if (!r.ok) {
      throw new Error(`Error downloading PDF: ${r.status} ${r.statusText}`);
    }

    return r.buffer().then((buffer) => {
      fs.writeFileSync("/tmp/receipt.pdf", buffer);
      console.log("PDF saved")
      return "/tmp/receipt.pdf";
    });
  });
};

function setConfigDefaults(config) {
  if (config.languageHint === undefined) {
    config.languageHint = 'pt';
  } else if (config.languageHint === 'none') {
    config.languageHint = null;
  }

  if (config.density === undefined) {
    config.density = 300;
  } else {
    config.density = parseInt(config.density, 10) || 300;
  }

  if (config.deskew === 'no') {
    config.deskew = false;
    if (config.density > 175) {
      config.density = 175;
    }
  } else {
    config.deskew = 40;
  }

  if (config.ocrFeature === undefined) {
    config.ocrFeature = 'gcloud_document_text';
  }
};

function validConfig({ ocrFeature }) {
  return ocrFeature === 'gcloud_document_text'
    || ocrFeature === 'gcloud_text';
}

function handleCloudVisionResponse(config) {
  return (response) => {
    if (response.textAnnotations === undefined) {
      throw new Error(`No response received or timed out. Configs: ${JSON.stringify(config)}`);
    }
    return { config, response };
  };
}

module.exports = ({ applicantId, year, documentId, config }) => {
  setConfigDefaults(config);

  // TODO: Validate if any of the params is missing / blank
  return new Promise((resolve, reject) => {
    if (!validConfig(config)) {
      throw new Error(`Invalid configuration provided: ${JSON.stringify(config)}`);
    }

    fetchReceipt({ applicantId, year, documentId }).
      then(pdfToPng(config)).
      then(cloudVision(config)).
      then(handleCloudVisionResponse(config)).
      then(resolve).
      catch(reject);
  })
}
