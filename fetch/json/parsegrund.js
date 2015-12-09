var fs = require('fs'),
	_ = require('lodash');

fs.readFileS = function(path,callback){ callback(null,fs.readFileSync(path)); }

var folder = "../html/subjects/grund/";

var subjects = {}, courses = {};

_.each(_.without(fs.readdirSync(folder),".DS_Store"),function(path){
	fs.readFileS(folder+path,function(err,data){
		data = data.toString().replace(/ p�� /g," på ");
		var split = data.split(/<\/?h1[^>]*>/g),
			code = path.split(".html")[0],
			headline = split[1].split(" - ")[1],
			MAIN = split[2].split('<div id="textInclude">')[1];
			MAINsplit = MAIN.split(/<h2[^>]*>.*?<\/h2>/g),
			description = MAINsplit[0],
			purpose = MAINsplit[1].replace(/<ul[^>]*>.*?<\/ul>/,"").trim().replace(/(<br\/> *)?Genom undervisningen i ämnet .*? ska eleverna sammanfattningsvis ges förutsättningar att utveckla sin förmåga att /,""),
			goals = _.map(MAINsplit[1].match(/<li[^>]*>.*?<\/li>/g),function(g){return g.replace(/<\/?li[^>]*>/g,"")}),
			contentblock = MAIN.match(/<h2[^>]*>Centralt innehåll *<\/h2>(.*?)<h2[^>]*>Kunskapskrav *<\/h2>/)[1],
			contentdivs = contentblock.match(/<div id="[^"]*" class="toggleField">.*?(<div class="toggle">|<h2[^>]*>Kunskapskrav| *$)/g),
			gradeblock = MAIN.split(/<h2[^>]*>Kunskapskrav *<\/h2>/)[1].replace(/<h3>Inom ramen för (elevens val|språkval)(, kinesiska)? *<\/h3>/g,""),
			gradedivs = gradeblock.match(/<div id="[^"]*" class="toggleField">.*?(<div class="toggle">|<div id="commentDivContainer">| *$)/g);
		var subject = {
			name: headline,
			code: code,
			description: description,
			goals: goals,
			purpose: purpose,
			courses: [],
			school: "grund"
		};
		console.log(code,headline,purpose.length);
		var gradenames=[],grades = _.reduce(gradedivs,function(o,str){
			var gid = str.match(/div id="([^"]*)"/)[1];
			str = str.replace(/<div id[^<]*>|<\/div><div id="commentDivContainer">|<\/div> *<div class="toggle">|<div class="knowReqBottom"><\/div>/g,"");
			var gradeblocks = str.match(/<h3[^<]*>.*?(<h3|$)/g);
			o[gid]={};
			gradenames.push(gid);
			_.each(gradeblocks,function(gb){
				var gname = gb.match(/<h3[^>]*>([^<]*)<\/h3>/)[1],
					gcontent = gb.match(/<\/h3>(.*)$/)[1].replace(/<\/div> *$|<h3$/g,""),
					gparafs = _.compact(_.difference(gcontent.split(/<\/?p>/g),['  ',' '])),
					grade = (gname.match(/betyget ([ACEace])/)||[,"G"])[1],
					year = gname[gname.length-1];
				if (!gname.match(/betyget [DB]|Inom ramen/g)){
					o[gid][grade] = gparafs;
				}
			});
			return o;
		},{});
		_.map(contentdivs,function(str){
			str = str.replace(/<div id="[^"]*" class="toggleField">|<\/div> *(<div class="toggle">|$)/,"");
			var name = headline+" "+str.match(/<h3[^>]*>([^<]*)<\/h3>/)[1].replace(/I årskurs |, inom ramen för/g,"");
			subject.courses.push(name);
			var course = {
				name: name,
				code: name,
				content: {},
				subject: code,
				school: "grund",
				stadium: name.match("9") ? "hög" : name.match("6") ? "mellan" : "låg",
				goals: _.range(subject.goals.length).map(function(n){return 1;})
			};
			console.log(headline,"---",name);
			_.map(str.match(/<h4[^>]*>[^<]*<\/h4><ul[^>]*>.*?<\/ul>/g),function(contentpart){
				var contentname = contentpart.match(/<h4[^>]*> *([^<]*?) *<\/h4>/)[1],
					contentparts = _.map(contentpart.match(/<li>.*?<\/li>/g),function(cp){return cp.replace(/<\/?li>/g,"");});
				course.content[contentname] = contentparts;
				//console.log(name,contentname,contentparts.length);
			});
			courses[name] = course;
		});
		if (gradenames.length!==subject.courses.length){
			gradenames = ["BOGUS"].concat(gradenames);
			console.log("COMPANSAJTADE för",headline);
			if (gradenames.length!==subject.courses.length){
				console.log(headline,"grades",gradenames,"couress",subject.courses);
				throw "WHAAAT";
			}
		}
		_.each(subject.courses,function(cid,n){
			courses[cid].judge = grades[gradenames[n]];
			console.log(cid,"gets",gradenames[n],!!grades[gradenames[n]]);
		});
		subjects[code] = subject;
	});
});

_.each(subjects,function(sub){
	fs.writeFile("../json/grundsubjects/"+sub.code+".json",JSON.stringify(sub));
	console.log("Saved subject",sub.code,sub.name);
});

_.each(courses,function(course){
	fs.writeFile("../json/grundcourses/"+course.name+".json",JSON.stringify(course));
	console.log("Saved course",course.name);
});