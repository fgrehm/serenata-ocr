const ApiBuilder = require('claudia-api-builder');
const api = new ApiBuilder();
const fs = require('fs');
const { receiptEndpoint } = require('./api/chamberOfDeputies');

module.exports = api;
api.get('/chamber-of-deputies/receipt/{applicantId}/{year}/{documentId}', receiptEndpoint(api));
