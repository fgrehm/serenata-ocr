const app = require('./app');

const request = {
  requestContext: {
    httpMethod: 'GET',
    resourcePath: '/chamber-of-deputies/receipt/{applicantId}/{year}/{documentId}'
  },
  pathParameters: {
    applicantId: 1789,
    year: 2015,
    documentId: 5631309
  }
}

const fakeContext = {
  done(_, resp) { console.log("DONE", resp) }
}

app.proxyRouter(request, fakeContext);
