var fs = require('fs'),
	_ = require('lodash');

fs.readFileS = function(path,callback){ callback(null,fs.readFileSync(path)); }

_.each(["grund","vux","gymn"],function(level){
	fs.readFileS("../markdown/"+level+".html",function(err,data){
		var split = data.toString().split(/<h1.*?<\/h1>/g),
			mission = split[1],
			goals = split[2].split("<script>")[0];
		console.log(level,mission.length,goals.length);
	});
});
