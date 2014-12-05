var fs = require('fs'),
	_ = require('lodash'),
	Parser = require('pdf2json/pdfparser');

var parser = new Parser;

_.each(["COMMON","VOCATIONAL","OTHER"],function(type){
	var folder = "./subjects/"+type+"/";
	_.each(_.without(fs.readdirSync(folder),".DS_Store"),function(path){
		fs.readFile(folder+path,function(err,pdfBuffer){
			fs.writeFile("../parsedpdf/subjects/"+type+"/"+path+".html",pdfBuffer.toString().replace(/<\!--.*?-->/g,"").replace(/[\n\t\r\f]/g,"").replace("��","å"));
		});
	});
});