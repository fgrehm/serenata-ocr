const { exec } = require('child_process');

const Promise = require('promise');

function pdfToPng({ deskew, density, shave, trim }) {
  if (deskew) {
    deskew = `-deskew ${deskew}%`;
  } else {
    deskew = '';
  }
  if (shave) {
    shave = `-shave ${shave}`;
  } else {
    shave = ''
  }
  if (trim) {
    trim = '-trim +repage';
  } else {
    trim = '';
  }

  return (input) => {
    const output = "/tmp/receipt.png";
    return new Promise((resolve, reject) => {
      const cmd = `convert -density ${density} ${input} -quality 100 ${deskew} ${shave} ${trim} -append ${output}`;
      exec(cmd, (err, stdout, stderr) => {
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
