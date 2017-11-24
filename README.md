# Serenata OCR

A Serverless API for OCRing [Serenata de Amor][site-serenata]'s documents
(currently limited to Chamber of Deputies receipts). Powered by
[Claudia.JS][site-claudia] and [Google Cloud Vision][site-google-cloud-vision].

## Setup

- [Set up aws creds](https://claudiajs.com/tutorials/installing.html#lazy-quick-start)

```sh
# Ensure you use NodeJS 6.10
npm install -g claudia
claudia create --region us-east-1 --api-module app --timeout 60 --memory 512
```

At the end of `claudia create` you'll get an url, to test it run:

```sh
API="https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/latest/chamber-of-deputies/receipt"
curl "${API}/1789/2015/5631309"
```

## TODO

- [x] Make it work
- [ ] Give pdfjs another shot
- [ ] Use a more recent version of imagemagick
