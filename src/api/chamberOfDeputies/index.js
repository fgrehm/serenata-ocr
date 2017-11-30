const ocrReceipt = require('./ocrReceipt');

function receiptEndpoint(api) {
  return (req) => {
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
      // TODO: Return JSON with more info, better than raw text
      return new api.ApiResponse(err.message, {'Content-Type': 'text/plain'}, 500);
    });
  };
};

module.exports = { receiptEndpoint };
