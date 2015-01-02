var fs = require('fs'),
	_ = require('lodash');

fs.readFileS = function(path,callback){ callback(null,fs.readFileSync(path)); }

function ultoarr(str){
	return str.match(/<ul>([\W\w]*?)<\/ul>/)[1].replace(/^\n*<li>|<\/li>\n*$/g,"").split(/<\/li>\n*<li>/g)
}

function ulstoobj(block){
	return _.reduce(block.match(/<h[0-9][^>]*>[\W\w]*?<\/h[0-9>\n*<ul>[\W\w]*?<\/ul>/g),function(memo,str){
		memo[str.match(/<h3[^>]*>([\W\w]*?)<\/h3>/)[1]] = ultoarr(str.match(/<ul>[\W\w]*?<\/ul>/)[0]);
		return memo;
	},{});
}

fs.readFileS("../markdown/grundvuxkurs.html",function(err,data){
	data = data.toString();
	_.each(data.replace(/<h1/g,"XXX<h1").split(/XXX/g),function(str,n){
		if (n){
			var code = str.match(/Kurskod: ([^<]*)<\/p>/)[1],
				points = str.match(/Verksamhetspoäng: ([^<]*)<\/p>/)[1],
				name = str.match(/<h1[^>]*>([^<]*)<\/h1>/)[1],
				desc = str.match(/(<p>.*?<\/p>)\n*<h2[^>]*>Syfte/)[1],
				purpose = str.match(/<h2[^>]*>Syfte<\/h2>\n*([\w\W]*?)<h2/)[1],
				goals = ultoarr(str.match(/<h2[^>]*>Ämnesmål<\/h2>\n*<p>[^<]*<\/p>\n*(<ul>[\W\w]*?<\/ul>)/)[1]),
				goalarr = _.map(_.range(0,goals.length),function(){return 1}),
				content, contentblock = str.match(/Centralt innehåll *<\/h2>\n*([\W\w]*?)\n*<h2[^>]*>Kunskapskrav/)[1],
				grade = {
					E: str.match(/Betyget E<\/h3>\n*([\W\w]*?)\n*<h3[^>]*>Betyget C/)[1].replace(/^\n* *<p>|<\/p>\n*$/g,"").replace(/<\/p>\n+<p>/g,"XXX").split("XXX"),
					C: str.match(/Betyget C<\/h3>\n*([\W\w]*?)\n*<h3[^>]*>Betyget A/)[1].replace(/^\n* *<p>|<\/p>\n*$/g,"").replace(/<\/p>\n+<p>/g,"XXX").split("XXX"),
					A: str.match(/Betyget A<\/h3>\n*([\W\w]*?)\n*(<h1|$|<\/body)/)[1].replace(/^\n* *<p>|<\/p>\n*$/g,"").replace(/<\/p>\n+<p>/g,"XXX").split("XXX")
				},
				courses;
			if (contentblock.match(/<h4/)){ // two parts
				var split = contentblock.split(/<h3[^>]*>[\W\w]*?<\/h3>/g);
				var	c1 = ulstoobj(split[1].replace(/h4/g,"h3")),
					c2 = ulstoobj(split[2].replace(/h4/g,"h3"));
				fs.writeFile("./grundvuxcourses/"+code+"_1.json",JSON.stringify({
					name: name+" del 1",
					code: code+"_1",
					points: points,
					pointswith: code+"_2",
					goals: goalarr,
					content: c1,
					subject: code,
					school: "grundvux"
				}));
				fs.writeFile("./grundvuxcourses/"+code+"_2.json",JSON.stringify({
					name: name+" del 2",
					code: code+"_2",
					points: points,
					pointswith: code+"_1",
					goals: goalarr,
					content: c2,
					judge: grade,
					subject: code,
					school: "grundvux"
				}));
				courses = [code+"_1",code+"_2"];
			} else {
				if (contentblock.match(/<h3/)){ // normal
					content = ulstoobj(contentblock);
				} else { // just a list
					content = ultoarr(contentblock.trim());
				}
				fs.writeFile("./grundvuxcourses/"+code+".json",JSON.stringify({
					name: name,
					code: code,
					points: points,
					goals: goalarr,
					content: content,
					judge: grade,
					subject: code,
					school: "grundvux"
				}));
				courses = [code];
			}
			fs.writeFile("./grundvuxsubjects/"+code+".json",JSON.stringify({
				code: code,
				name: name,
				description: desc,
				goals: goals,
				purpose: purpose,
				courses: courses,
				school: "grundvux"
			}));
		}
	});
});