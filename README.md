# Serenata OCR

A Serverless API for OCRing [Serenata de Amor][site-serenata]'s documents
(currently limited to Chamber of Deputies receipts). Powered by
[Claudia.JS][site-claudia] and [Google Cloud Vision][site-google-cloud-vision].

## Setup

- [Set up aws creds](https://claudiajs.com/tutorials/installing.html#lazy-quick-start)

```sh
# Ensure you use NodeJS 6
npm install -g claudia
claudia create --region us-east-1 --api-module app
```
