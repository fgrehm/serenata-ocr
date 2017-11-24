const { exec } = require('child_process');

const Promise = require('promise');

const pdfToPng = (deskew, density) => {
  density = parseInt(density, 10) || 300;
  if (deskew) {
    deskew = '-deskew 40%';
  } else {
    if (density > 175) {
      density = 175;
    }
    deskew = '';
  }
  console.log(`deskew ${deskew}, density ${density}`);

  return (input) => {
    const output = "/tmp/receipt.png";
    return new Promise((resolve, reject) => {
      // Cant user higher density, google doesnt like it when generated from the
      // image magick version installed on lambda
      // exec(`convert -density 175 ${input} -quality 100 -append ${output}`, (err, stdout, stderr) => {
      exec(`convert -density ${density} ${input} -quality 100 ${deskew} -append ${output}`, (err, stdout, stderr) => {
        if (err) {
          reject(new Error(`Error generating PNG: ${err.message}\nstdout:${stdout}\nstderr${stderr}`));
        } else {
          console.log("PNG generated")
          resolve(output);
        }
      });
    });
  };
};

module.exports = pdfToPng;
