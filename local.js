const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

process.env.GOOGLE_CLOUD_VISION_API_KEY = config.GOOGLE_CLOUD_VISION_API_KEY;

const api = require("./src/api");

const request = {
  requestContext: {
    httpMethod: "GET",
    resourcePath: "/chamber-of-deputies/receipt/{applicantId}/{year}/{documentId}"
  },
  queryStringParameters: {
    // languageHint: 'none',
    ocrFeature: "gcloud_text"
  },
  pathParameters: {
    applicantId: 1789, year: 2015, documentId: 5631309
    // applicantId: 2241, year: 2016, documentId: 6059587
  }
};

const fakeContext = {
  done(_, resp) {
    if (resp.statusCode == 200) {
      console.log("RESPONSE", resp.body);
    } else {
      console.error("ERROR!");
      console.error(resp);
    }
  }
};

api.proxyRouter(request, fakeContext);
