var fs = require('fs'),
	_ = require('lodash');

fs.readFileS = function(path,callback){ callback(null,fs.readFileSync(path)); }

fs.readFileS("../pdf/vuxgrund.htm",function(err,data){
	data = data.toString().replace(/<!--.*?-->/g,"").replace(/<!\[if[^>]*><P[^>]*><!\[endif\]>[^<]*<\/P>/g,"").replace(/<!\[if.*?<!\[endif\]>/g,"").replace(/<IMG[^>]*>/g,"")//.replace(/<\/DIV>\n*<\/DIV>\n*<DIV[^>]*>\n*<P[^>]*>[^<]*<\/P>\n*<\/DIV>\n*<\/DIV>\n*<DIV[^>]*>\n*<DIV[^>]*>\n*<\/DIV>\n*<DIV[^>]*>\n*<DIV[^>]*>\n*/,"");
	fs.writeFile("../pdf/vuxgrundfixed.htm",data);
});