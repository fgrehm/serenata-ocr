const { exec } = require('child_process');

const Promise = require('promise');

function pdfToPng({ deskew, density }) {
  if (deskew) {
    deskew = `-deskew ${deskew}%`;
  } else {
    deskew = '';
  }

  return (input) => {
    const output = "/tmp/receipt.png";
    return new Promise((resolve, reject) => {
      // Cant user higher density, google doesnt like it when generated from the
      // image magick version installed on lambda
      exec(`convert -density ${density} ${input} -quality 100 ${deskew} -append ${output}`, (err, stdout, stderr) => {
        if (err) {
          reject(new Error(`Error generating PNG: ${err.message}\nstdout:${stdout}\nstderr${stderr}`));
        } else {
          console.warn("PNG generated")
          resolve(output);
        }
      });
    });
  };
};

module.exports = pdfToPng;
