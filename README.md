# Serenata OCR

A Serverless API for OCRing [Serenata de Amor][serenata]'s documents
(currently limited to Chamber of Deputies receipts). Powered by
[Claudia.JS][claudia] and [Google Cloud Vision][google-cloud-vision].

## Initial setup

In terms of tools / development stuff, while a Docker environment is in the
works, this is what you'll need:

- `git clone git@github.com:fgrehm/serenata-ocr.git`
- `cp config.json{.example,}`
- NodeJS 6.10 (:warning: This is important, it is the version executed in AWS
  Lambda).
- `yarn install` or `npm install`
- Claudia.JS CLI (`npm install -g claudia`)
- AWS credentials configured for claudia as outlined in [this tutorial][claudia-aws-setup]

For OCRing with Google Cloud Vision you'll need:

- Cloud Vision needs to be enabled for your project. Can be done from
  https://console.cloud.google.com/apis/library/vision.googleapis.com/?q=vision.
- An API Key with permissions to perform Cloud Vision requests. Can be created
  from https://console.cloud.google.com/apis/credentials.
- `open config.json` and add the key there.

## Deployment

As mentioned above, make sure your AWS credentials are configured as outlined in
[this tutorial][claudia-aws-setup]. Once you have that done, proceed to your
first deployment of the API:

```sh
claudia create --region us-east-1 \
               --api-module app \
               --timeout 60 \
               --memory 512 \
               --set-env-from-json config.json \
               --version production
```

At the end of `claudia create` you'll get an url, to test it run:

```sh
API="https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/latest/chamber-of-deputies/receipt"
# Single liner if you have `jq` installed
API="https://$(jq -r '.api.id' claudia.json).execute-api.us-east-1.amazonaws.com/latest/chamber-of-deputies/receipt"

# OCR a document and save it to a JSON file:
curl "${API}/2935/2016/6069360" > 6069360.json
```

## Documentation

:construction: _Proper documentation is in the works_ :construction:

- From a high level, this is what gets done under the hood:
  * The receipt PDF associated with the reimbursement is downloaded from the
    Chamber of Deputies website.
  * ImageMagick is used to convert the PDF to a PNG image with:
    `convert -density <density> receipt.pdf -quality 100 -deskew 40% -append receipt.png`
  * The PNG is uploaded to Google Cloud Vision and the results are sent back to
    the client.
- For custom parameters supported by the API, see [`app.js`](app.js) for now.
- For local execution, see [`local.js`](local.js) for now (run with `node local.js`).
- Example responses at [`examples/`](examples/)
- Some useful utilities at [`Deskfile`](Deskfile)
- More info? Please read the code for now, it is super small:
  * Start off from [`app.js`](app.js)
  * Then see the code at [`src/`](src/)

## Wanna help?

See [the issue tracker for inspiration][issues].

## Troubleshooting

Feel free to create [an issue][new-issue].

### Function times out

Maybe the document is too big for your function to handle so give it more
:muscle:

```sh
claudia update --timeout 90 --memory 1024
```

[serenata]: https://serenatadeamor.org/
[claudia]: https://claudiajs.com/
[claudia-aws-setup]: https://claudiajs.com/tutorials/installing.html#lazy-quick-start
[google-cloud-vision]: https://cloud.google.com/vision/docs/
[issues]: https://github.com/fgrehm/serenata-ocr/issues
[new-issue]: https://github.com/fgrehm/serenata-ocr/issues/new
