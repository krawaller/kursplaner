var fs = require('fs'),
	_ = require('lodash'),
	subs = require('../subjects.json'),
	jsdom = require('jsdom');

var otherrules = fs.readFileSync("../html/vissaamnen.html").toString();

_.each(["COMMON","VOCATIONAL","OTHER"],function(type){
	var folder = "../html/subjects/"+type+"/";
	_.each(_.without(fs.readdirSync(folder),".DS_Store"),function(path){
		fs.readFile(folder+path,function(err,data){
			data = data.toString().replace(/[\n\t\r\f]/g,"").replace(/ {2}/g," ");
			if (err || !data || data===" "){
				console.log("Error reading",folder+path)
				throw "FileReadError";
			}
			var code = path.split("_")[0], name = path.split("_")[1].replace(".html","").replace(/ä/g,"ä").replace(/å/g,"å").replace(/ö/g,"ö");
			var sub = {name:name,code:code,type:type};
			// AUTHORITY
			if (type==="OTHER"){
				var regex = new RegExp('<h3><b>Ämnet '+name.toLowerCase()+' ?</b></h3>(.*?)<h3>'),
					match = otherrules.match(regex);
				try {
					sub.auth = match[1];
				} catch(e){
					console.log("Error reading rule for",name);
				}
			}
			// DESCRIPTION
			try{
				sub.description = data.match(/textInclude\"\>(.*?)<h2/)[1];
			} catch(e) {
				console.log("Error reading description for",type,code,name,"DATA",data,typeof data,data.length);
			}
			// VUX
			sub.vux = !_.contains(["SPE","DAG","DAK","BYL","DAL","GYM","INO","MJU","PRT","HUA","NAE"],code); // http://www.skolverket.se/laroplaner-amnen-och-kurser/vuxenutbildning/komvux/gymnasial/amnen-som-inte-kan-ges-inom-kommunal-vuxenutbildning-1.177099
			// PURPOSE
			try {
				if (code==="ITI"){
					sub.purpose = data.match(/(<p> Ämnet it i vård och omsorg ska .*?)<h4>/)[1];
				} else {
					sub.purpose = data.match(/(<p>\s?Undervisningen i .*? ska syfta till .*?)<h4>/)[1];
				}
			} catch(e) {
				console.log("Boomed purpose for",code,name);
			}
			// GOALS
			try {
				if (code==="DAG"){
					var goals = data.match(/förutsättningar att utveckla följande:<\/h4>(.*?)<h3>/)[1];
					goals = goals.replace(/[1-9]\. /g,"").replace(/<p>/g,"<li>").replace(/<\/p>/g,"</li>");
				} else {
					var goals = data.match(/<ol>(.*?)<\/ol>/)[1];
				}
				sub.goals = goals.replace(/^\s?<li>|<\/li>\s?$/g,"").split(/<\/li>\s?<li>/);
			} catch(e) {
				console.log("Boomed goals for",code,name);
			}
			// COURSELIST
			try {
				var defs = data.match(/Kurser i ämnet ?<\/h3><p> ?<\/p><ul.*?> ?(.*?) ?<\/ul>/)[1].replace(/^<li> ?/,"").replace(/<\/li> ?$/,"").replace("poång","poäng").split(/<\/li> ?<li>/);
				var courses = [];
				if (!defs.length) throw "Foo";
			} catch(e) {
				try {
					defs = [data.match(/Kurser i ämnet ?<\/h3><p>(.*?)<\/p>/)[1]];
					if (!defs[0]){
						throw "Foo";
					}
				}
				catch(e){
					console.log("Boomed parsing courselist for",type,code,name,data.match(/Kurser i ämnet ?<\/h3><p>(.*?)<\/p>/).length);
					if (code==="BIN"){
						console.log("BIODLING",data.match(/Kurser i ämnet ?<\/h3><p>(.*?)<\/p>/))
					}
					defs = [];
				}
			}
			// INDIVIDUAL COURSES
			var datapart = data.match(/Kurser i ämnet ?<\/h3>.*?</)
			if (defs.length){
				for(var i=0;i < defs.length;i++){
					var def = defs[i], course = {subject:code};
					// NAME
					var trans={
						"Nätunderhållsarbete på luftledningsnät 0,4–24 kV":"Nätunderhållsarbete på luftledningsnät 0,4&mdash;24kV",
						"Kommunikationsteknik 3":"Kommunikationsnät 3",
						"Kontorssystem":"Kontorstekniksystem",
						"Historia 2b kultur": "Historia 2b - kultur"
					};
					def = def.replace("Svenska som andraspråk 1, som bygger","Svenska som andraspråk 1, 100 poäng, som bygger").replace("Svenska som andraspråk 2, som bygger","Svenska som andraspråk 2, 100 poäng, som bygger").replace("Svenska som andraspråk 3, som bygger","Svenska som andraspråk 3, 100 poäng, som bygger");
					course.name = def.split(/,?  ?\d{2,3}  ?poäng/)[0];
					if (trans[course.name]){
						course.name = trans[course.name];
					}
					course.name = course.name.replace(/ [-–] /g," &mdash; ");
					// POÄNG
					try {
						course.points = +def.match(/(\d{2,3}) poäng/)[1];
					} catch(e){
						course.points = 100;
						console.log("Couldn't read points for course",i,course.name,"in",type,code,name,"so assumed 100");
					}
					// FURTHER INSTRUCTION
					var instr = def.split(/,?  ?\d{2,3}  ?poäng,?  ?/)[1];
					var instructiontext = instr;
					if (instr){
						function courseList(str,coursename){
							var ret;
							if (str.match(/ *någon av kurserna [^\.]*? eller/)){
								ret = {type:"OR",arr:str.replace(/^ *någon av kurserna /,"").split(/, | eller /)};
							} else if (str.match(/ *någon av kurserna [^\.]*? och/)){
								ret = {type:"AND",arr:str.replace(/^ *någon av kurserna /,"").split(/, | och /)};
							} else if (str.match(/^ *kursen/)&&str.match(/eller/)){
								ret = {type:"OR",arr:_.difference(str.replace(/^ *kursen */,"").split(/, *(kursen *)?| *eller *(kursen *)?/g),[undefined,"kursen "])};
							} else if (str.match(" samt ")){
								ret = {type:"AND",arr:str.split(" samt ")};
							} else {
								ret = str.trim().replace(/^kursen /,"").replace(/ med innehåll från vald profil$/,"");
							}
							if (ret.arr){
								ret.arr = _.map(ret.arr,function(c,n,list){
									if (c.match(/^ *på kurserna /)){
										return courseList(c.replace(/^ *på */,"någon av kurserna "))
									}
									return (n && c[0].match(/^\d/) ? list[0].split(/ \d/)[0]+" "+c : c).trim().replace("kursen ","");
								});
							}
							return ret;
						}
						// REPEAT
						var rep = instr.match(/och kan läsas flera gånger med olika innehåll|Kursen kan läsas (läsas )?flera? gånger med olika .*?\.|Kursen kan läsas flera gånger med innehåll från olika .*\.|som kan läsas flera gånger med olika innehåll\.|Kursen kan läsas flera gånger i olika språk\./)
						if (rep){
							instr = instr.replace(rep[0],"");
							course.repeat = rep[0].replace(/^och kan läsas/,"Kan läsas");
						}
						// REQUIREMENTS
						var req = instr.match(/som bygger på (.*?)\.|som beroende av valt kunskapsområde bygger på (.*?)\.|som beroende på valt kunskapsområde bygger på (.*?)\./);
						if (req){
							course.requirements = courseList(req[1]||req[2]||req[3],course.name);
							instr = instr.replace(req[0],"");
							var alsoreq = instr.match(/Dessutom bygger den på (.*?)\.|Den bygger också på (.*?)\./);
							if (alsoreq){
								course.requirements = {type:"AND",arr:[course.requirements,courseList(alsoreq[1]||alsoreq[2],course.name)]};
								instr = instr.replace(alsoreq[0],"");
							}
						}
						// NOTWITH
						var notwith = instr.match(/Betyg i kursen kan inte ingå i elevens examen tillsammans med betyg i (.*?)\.|( *I ett och samma språk kan endast betyg i en av kurserna språk specialisering – retorik 1[ab] eller språk specialisering – retorik 1[ab] ingå i elevens examen\. *)/);
						if (notwith){
							course.notwith = courseList(notwith[1]||notwith[2],course.name);
							instr = instr.replace(notwith[0],"");
						}
						// PROGRAM
						var prog = instr.match(/Kursen ska ingå i (.*?)\./);
						if (prog){
							course.prog = prog[1];
							instr = instr.replace(prog[0],"");
						}
						// SPECIALCASES
						if (instr.match(/^ *som bygger på minst *$/)){
							course.req = "minst 800 poäng av yrkesprogrammets karaktärsämnen"
							instr="";
						}
						if (instr.match(/^ *Kursen får endast anordnas inom kommunal vuxenutbildning\. *$/)){
							course.onlyadults = true;
							instr="";
						}
						// ALL?
						if (instr.replace(/ |<b> <\/b>/g,"").length){
							console.log("Warning, did not understand instruction for",course.name," ---- ",instr);
						}
						if (instructiontext){
							course.instructiontext = instructiontext;
						}
					}
					// DATA
					try {
						var regdef = course.name+',  ?\\d{2,3}  ?poäng<\\/h2><div id="([A-ZÅÄÖa-zåäö0-9 ]*?)".*?>(.*?)(<\\/div><script|<a id="anchor)',
							regex = new RegExp(regdef,"i"),
							match = data.match(regex);
						course.code = match[1].replace(" ","");
						//course.raw = match[2];
					} catch(e){
						try {
							var regdef = course.name.replace("&mdash;","-")+',  ?'+course.points+'  ?poäng<\\/h2><div id="([A-ZÅÄÖa-zåäö0-9]*?)".*?>(.*?)(<\\/div><script|<a id="anchor)',
								regex = new RegExp(regdef,"i"),
								match = data.match(regex);
							course.code = match[1];
							course.raw = match[2];
						} catch(e) {
							console.log("Failed to read code and raw for course",type,code,course.name,regdef);
							throw "MOO"
						}
					}
					// SAVE
					fs.writeFile("./courses/"+course.code+".json",JSON.stringify(course).replace(/\,"/g,',\n"'));
				}
			}
			// FINISH
			fs.writeFile("./subjects/"+code+".json",JSON.stringify(sub).replace(/"\,"/g,'",\n"'));
		});
	});
});
