var pdftohtml = require('pdftohtmljs'),
    converter = new pdftohtml('./vuxgrund.pdf', "./vuxgrund.html");

converter.preset('default');

converter.success(function() {
  console.log("convertion done");
});

converter.error(function(error) {
  console.log("conversion error: " + error);
});

converter.progress(function(ret) {
  console.log ((ret.current*100.0)/ret.total + " %");
});

converter.convert();