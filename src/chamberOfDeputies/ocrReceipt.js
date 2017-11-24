const fs = require('fs');

const fetch = require('node-fetch');
const Promise = require('promise');

const pdfToPng = require('../pdfToPng');
const cloudVision = require('../cloudVision');

const fetchReceipt = ({ applicantId, year, documentId }) => {
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

module.exports = ({ applicantId, year, documentId, languageHint, deskew, density }) => {
  if (languageHint === undefined) {
    languageHint = 'pt';
  } else if (languageHint === 'none') {
    languageHint = null;
  }

  if (deskew === 'no') {
    deskew = false;
  } else {
    deskew = true;
  }

  // TODO: Validate if any of the params is missing / blank
  return new Promise((resolve, reject) => {
    fetchReceipt({ applicantId, year, documentId }).
      then(pdfToPng(deskew, density)).
      then(cloudVision(languageHint)).
      then(resolve).
      catch(reject);
  })
}
