var spawn = require('child_process').spawn;

render = function(dot,outpath) {
  var rendered = null;
  var out = ''
  var err = ''
  var outcallback = function(data) { 
    if( rendered == null ) {
      rendered = data; 
    } else {
      __b = new Buffer( rendered.length + data.length )
      rendered.copy(__b, 0, 0)
      data.copy(__b, rendered.length, 0)
      rendered = __b
    }
  };
  var parameters = [];
  parameters.push( '-T' + "png" );
  parameters.push( '-o' + outpath )

  graphviz = spawn("dot", parameters);
  graphviz.stdout.on('data', outcallback);
  graphviz.stderr.on('data', function(data) {
    err += data;
  });
  graphviz.on('exit', function(code) {
    if(code !== 0) {
      if(errback) { errback(code, out, err) }
    }
  });
  graphviz.stdin.write(dot);
  graphviz.stdin.end();
}

module.exports = render;
/*
var dot = `
digraph G {
rankdir=TB;  
"Matematik 2b" [ style = "bold"];
"Matematik 2a" -> "Matematik 2b" [ color = "red", dir = both, arrowhead = tee, arrowtail = tee];
"Matematik 2b" -> "Matematik 2c" [ color = "red", dir = both, arrowhead = tee, arrowtail = tee];
{ rank=same; "Matematik 2a"; "Matematik 2b"; "Matematik 2c"; }
"Matematik 1a"; "Matematik 1b"; "Matematik 1c";
"Matematik 1a" -> "Matematik 2b";
"Matematik 1b" -> "Matematik 2b";
"Matematik 1c" -> "Matematik 2b";
"Matematik 3b";
"Matematik 3c";
"Matematik 2b" -> "Matematik 3b";
"Matematik 2b" -> "Matematik 3c";
}
`
render(dot,"./_testing.png");
*/