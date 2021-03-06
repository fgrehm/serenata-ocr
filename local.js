var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

process.env.GOOGLE_CLOUD_VISION_API_KEY = config.GOOGLE_CLOUD_VISION_API_KEY;

const app = require('./app');

const request = {
  requestContext: {
    httpMethod: 'GET',
    resourcePath: '/chamber-of-deputies/receipt/{applicantId}/{year}/{documentId}'
  },
  queryStringParameters: {
    // languageHint: 'none',
    ocrFeature: 'gcloud_text',
    // density: 175,
    // raw: '1',
    // shave: 'none',
    // trim: 'none'
  },
  pathParameters: {
    // applicantId: 2241, year: 2016, documentId: 6059587,
    // applicantId: 1564, year: 2016, documentId: 5928875,
    // applicantId: 1789, year: 2015, documentId: 5631309,
    // applicantId: 1789, year: 2015, documentId: 5631380,
    // applicantId: 2238, year: 2015, documentId: 5855221,
    // applicantId: 2238, year: 2015, documentId: 5856784,
    // applicantId: 2871, year: 2016, documentId: 5921187,
    // applicantId: 2935, year: 2016, documentId: 6069360,
    applicantId: 3052, year: 2016, documentId: 5962849,
    // applicantId: 3052, year: 2016, documentId: 5962903,

    // This seems to only works with gcloud_document_text
    // applicantId: 80, year: 2015, documentId: 5768932,
  }
}

const fakeContext = {
  done(_, resp) {
    if (resp.statusCode == 200) {
      console.log(resp.body)
    } else {
      console.error("ERROR!");
      console.error(resp);
    }
  }
}

app.proxyRouter(request, fakeContext);
