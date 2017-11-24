const fs = require('fs');

const fetch = require('node-fetch');
const { exec } = require('child_process');
const Promise = require('promise');

// TODO: Load from config file
const apiKey = '...';

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

const convertPdfToPng = (input) => {
  const output = "/tmp/receipt.png";
  return new Promise((resolve, reject) => {
    // Cant user higher density, google doesnt like it when generated from the
    // image magick version installed on lambda
    exec(`convert -density 175 ${input} -quality 100 -append ${output}`, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(`Error generating PNG: ${err.message}\nstdout:${stdout}\nstderr${stderr}`));
      } else {
        console.log("PNG generated")
        resolve(output);
      }
    });
  });
};

const ocr = (receiptImagePath) => {
  // TODO: Check if giving a languageHint for pt lang yields better results
  const payload = {
    requests: [
      {
        features: [ { type: "DOCUMENT_TEXT_DETECTION" } ],
        image: { content: new Buffer(fs.readFileSync(receiptImagePath)).toString('base64') }
      }
    ]
  };

  const opts = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
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

module.exports = ({ applicantId, year, documentId }) => {
  // TODO: Validate if any of them is missing / blank
  return new Promise((resolve, reject) => {
    fetchReceipt({ applicantId, year, documentId }).
      then(convertPdfToPng).
      then(ocr).
      then(resolve).
      catch(reject);
  })
}
