const fs = require('fs');

const fetch = require('node-fetch');
const { exec } = require('child_process');
const Promise = require('promise');

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
    exec(`convert -density 300 ${input} -quality 100 -append ${output}`, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(`Error generating PNG: ${err.message}\nstdout:${stdout}\nstderr${stderr}`));
      } else {
        console.log("PNG generated")
        resolve(output);
      }
    });
  });
};

module.exports = ({ applicantId, year, documentId }) => {
  // TODO: Validate if any of them is missing / blank
  return new Promise((resolve, reject) => {
    fetchReceipt({ applicantId, year, documentId }).
      then(convertPdfToPng).
      // TODO: then(ocr).
      then(resolve).
      catch(reject);
  })
}
