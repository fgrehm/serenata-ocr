const ApiBuilder = require('claudia-api-builder');
const api = new ApiBuilder();
const fs = require('fs');
const ocrReceipt = require('./ocrReceipt');

module.exports = api;

api.get('/chamber-of-deputies/receipt/{applicantId}/{year}/{documentId}', function (req) {
  return ocrReceipt(req.pathParams).then((image) => {
    return new Buffer(fs.readFileSync(image)).toString('base64');
  }).catch((err) => {
    return new api.ApiResponse(err.message, {'Content-Type': 'text/plain'}, 500);
  });
});
