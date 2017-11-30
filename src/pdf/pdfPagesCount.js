const { exec } = require("child_process");

const Promise = require("promise");

const pdfPagesCount = (pdfFile) => {
  return new Promise((resolve, reject) => {
    // While we could use `identify -format %n PDF`, it doesn't work as expected
    // in OSX
    exec(`identify ${pdfFile} | wc -l`, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(`Error counting pages: ${err.message}\nstdout:${stdout}\nstderr${stderr}`));
      } else {
        resolve(parseInt(stdout, 10));
      }
    });
  });
};

module.exports = pdfPagesCount;
