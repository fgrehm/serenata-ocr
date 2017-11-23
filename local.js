const app = require('./app');

const request = {
  requestContext: {
    httpMethod: 'GET',
    resourcePath: '/chamber-of-deputies/receipt/{applicantId}/{year}/{documentId}'
  },
  pathParameters: {
    applicantId: 1789, year: 2015, documentId: 5631309
    // applicantId: 2241, year: 2016, documentId: 6059587
  }
}

const fakeContext = {
  done(_, resp) { console.log("DONE", resp) }
}

app.proxyRouter(request, fakeContext);
