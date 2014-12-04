var http = require("http");

// Utility function that downloads a URL and invokes
// callback with the data.
module.exports = function(url, callback) {
  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function(err) {
    callback(null,err);
  });
};