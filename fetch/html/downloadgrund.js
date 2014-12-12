var fs = require('fs'),
	_ = require('lodash'),
	download = require('./download');

function cleanText(buffer){
	var ret = buffer.toString().replace(/<\!--.*?-->/g,"").replace(/[\n\t\r\f]/g,"").replace(/[\n\t\r\f]/g,"").replace(/ {2}/g," ").replace("TIG-svetsning rår","TIG-svetsning rör").replace(/[a-zåäö] *<br\/?> *[a-zåäö]/g,"").replace(/[-–]|&mdash;/g,"-").replace(/<script.*?<\/script>/g,"").replace(/<img[^>]*\/?>/g,"").replace(/<p> *<\/p>/g,"").replace(/   */g," ").replace(/[ ]style="[^"]*"/g,"").replace(/anv��nda/,"använda").replace(/ d��r /," där ");
	_.each({
		"0,4-24kV": /0\,4\-24 kV/g
	},function(regex,replace){ ret = ret.replace(regex,replace); });
	return ret;
};

download("http://www.skolverket.se/laroplaner-amnen-och-kurser/grundskoleutbildning/grundskola/laroplan",function(data){
	data = cleanText(data);
	console.log("Saved grund master list!",data.length);
	var list = data.split(/<\/?table>/g)[1];
	var matches = list.match(/href="[^"]*">[^<]*</g);
	_.each(matches,function(str){
		var href = str.match(/"([^"]*)"/)[1],
			code = str.match(/subjectCode=([^&]*)&/)[1],
			name = str.match(/>([^<]*)</)[1],
			pname = name.toLowerCase().replace(/ /g,"-").replace("--","-").replace(/å/g,"a").replace(/ä/g,"a").replace(/ö/g,"o"),
			path = "http://www.skolverket.se/laroplaner-amnen-och-kurser/grundskoleutbildning/grundskola/"+pname;
		download(path,function(data){
			data = cleanText(data);
			fs.writeFile("./subjects/grund/"+code+".html",data);
			console.log("Saved",code,pname,data.length);
		});
	});
	fs.writeFile("./grund.html",data);
});