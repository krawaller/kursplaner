var download = require('./download'),
	fs = require('fs'),
	_ = require('lodash');

// COMMON, VOCATIONAL, OTHER
_.each(["OTHER","VOCATIONAL","COMMON"],function(type){
	_.each(["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","Å","Ä","Ö"],function(l,err){
		download("http://www.skolverket.se/laroplaner-amnen-och-kurser/gymnasieutbildning/gymnasieskola/sok-amnen-kurser-och-program/search.htm?alphaSearchString="+l+"&searchType=ALPHABETIC&searchRange=COURSE&subjectCategory="+type+"&searchString=",function(data){
			console.log("Saving",type,"letter",l);
			fs.writeFile("letters/"+type+"/"+l+".html",data);
		});
	});
});
