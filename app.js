const ApiBuilder = require('claudia-api-builder');
const api = new ApiBuilder();
const fs = require('fs');
const ocrReceipt = require('./src/chamberOfDeputies/ocrReceipt');

module.exports = api;

api.get('/chamber-of-deputies/receipt/{applicantId}/{year}/{documentId}', function (req) {
  const request = {
    reimbursement: {
      applicantId: req.pathParams.applicantId,
      year: req.pathParams.year,
      documentId: req.pathParams.documentId
    },
    config: {
      ocrFeature: req.queryString.ocrFeature,
      languageHint: req.queryString.languageHint,
      deskew: req.queryString.deskew,
      density: req.queryString.density,
    }
  };
  return ocrReceipt(request).catch((err) => {
    return new api.ApiResponse(err.message, {'Content-Type': 'text/plain'}, 500);
  });
});
