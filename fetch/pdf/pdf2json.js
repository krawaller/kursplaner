var nodeUtil = require("util"),
    fs = require('fs'),
    _ = require('lodash'),
    PDFParser = require("pdf2json/pdfparser");

var pdfParser = new PDFParser();


var pdfFilePath = "./vuxgrund.pdf";

pdfParser.loadPDF(pdfFilePath);

// or call directly with buffer
fs.readFile(pdfFilePath, function (err, pdfBuffer) {
  if (!err) {
    var res = pdfParser.parseBuffer(pdfBuffer);
    console.log(typeof pdfBuffer);
    fs.writeFile("./vuxgrund.json","foo");
  }
});