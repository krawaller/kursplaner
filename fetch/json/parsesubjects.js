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
			// COMMENTS
			var comm, commentblock = (data.match(/<div id="commentDivContainer">(.*?)<\/div><div id="printUp">/)||[])[1]||"";
			if (commentblock){
				sub.comments={};
				while ((comm=commentblock.match(/<div id="([A-Z0-9\-a-z_]*)" class="commentContainer".*?<\/a>(<h2>.*?)<\/div><\/div>/))){
					var cname = comm[1], ccont = comm[2];
					sub.comments[cname] = ccont;
					console.log("Subject",code,name,"has comment",cname,"with length",ccont.length);
					commentblock=commentblock.replace(comm[0],"");
				}
			}
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
					// RAW DATA
					var raw;
					try {
						var regdef = course.name+',  ?\\d{2,3}  ?poäng<\\/h2><div id="([A-ZÅÄÖa-zåäö0-9 ]*?)".*?>(.*?)(<\\/div><script|<a id="anchor)',
							regex = new RegExp(regdef,"i"),
							match = data.match(regex);
						course.code = match[1].replace(" ","");
						raw = match[2];
					} catch(e){
						try {
							var regdef = course.name.replace("&mdash;","-")+',  ?'+course.points+'  ?poäng<\\/h2><div id="([A-ZÅÄÖa-zåäö0-9]*?)".*?>(.*?)(<\\/div><script|<a id="anchor)',
								regex = new RegExp(regdef,"i"),
								match = data.match(regex);
							course.code = match[1];
							raw = match[2];
						} catch(e) {
							console.log("Failed to read code and raw for course",type,code,course.name,regdef);
							throw "MOO"
						}
					}
					// STEAL COMMENTS
					_.each([["CC-","","comment"],["KR-","E","judgehelp"]],function(a){
						var pre=a[0],suf=a[1],call=a[2], cid=pre+course.code+suf;
						if (sub.comments && sub.comments[cid]){
							course[call] = sub.comments[cid];
							delete sub.comments[cid];
						}
					});
					// PARSE COURSEDESCRIPTION
					function which(str){
						var parts = str.split(/, | ?och | ?samt /);
						return _.reduce(parts,function(m,val){
							var nums = _.map(val.trim().split(/&mdash;|[-–]/),function(s){return +s;});
							if (_.find(nums,function(n){return (typeof n === "string") && n.match(/\D/);})){
								//console.log("SHITPART",str,parts,nums,_.find(nums,function(n){return (typeof n === "string") && n.match(/\D/);}))
								return m;
							}
							return m.concat(nums.length===2 ? _.range(nums[0]-1,nums[1]) : nums[0]-1);
						},[]);
					}
					function addToArr(arr,add){
						_.map(add,function(pos){arr[pos] = (arr[pos]||0)+1;});
						return arr;
					}
					var regdef = '<h2>Kurskod: '+course.code+' ?<\\/h2><p>(.*?)<\/p><h2',
						regex = new RegExp(regdef),
						match = raw.match(regex),
						goalstr;
					try {
						goalstr = match[1].replace(/<\/?italic>/g,"").replace("Ämnets syfte i ämnet materialkunskap.","Ämnets syfte.").replace("&mdash;­-","");
						course.goaltext = goalstr;
						if (goalstr.match(/omfattar samtliga mål/)){
							course.goals = _.range(sub.goals.length).map(function(l){return 1;});
							//console.log("ALL GOALS",course.name,course.goals)
						} else {
							var m = goalstr.match(/(Kursen bygger på |s?k?a? ?omfattar? punkte?r?n?a? )(.*?)( o?c?h? ?under r?u?b?r?i?k?e?n? ?[Ää]mnets? syfte[\.\,]|\.)/),
								f = (m && m[2] || "").replace("&mdash;­","&mdash;"),
								w = which(f);
							course.goals = addToArr(_.range(sub.goals.length).map(function(l){return 0;}),w);
							//console.log("GOAL",course.name,course.goals,f,w,goalstr);
						}
						if (goalstr.match(/särskild betoning/)){
							var M = goalstr.match(/särskild betoning på (punkte?r?n?a? )?(.*?)\./),
								F = M && (M[2]||"").replace(/^[A-ZÅÄÖa-zåäö ,]*punkterna/,"")
								W = which(F);
							course.goals = addToArr(course.goals,W);
						}
						course.level = goalstr.match("I kursen behandlas grundläggande kunskaper i ämnet") ? "basic" :
							goalstr.match("I kursen behandlas fördjupade kunskaper i ämnet.") ? "high" : "normal";
					} catch(e) {
						console.log("Error reading goaldata for course",course.code,course.name,f,goalstr);
						throw e;
					}
					// CENTRAL CONTENT
					_.map({
						simple: [6,(/följande c?e?n?t?r?a?l?a? ?(innehåll|områden)(<\/i>)?(<i>)?[\:\;]?(<\/i>)? *<\/[h4p]{1,2}> *(<p> *<\/p>)?<ul> *<li>(.*?)<\/li> *<\/ul>/)],
						noheadline: [2,(/Centralt innehåll<\/h2><div style="padding-bottom:10px; border-bottom:5px solid #EEEEE9;"><\/div> *(<p> ?<\/p>)?<ul> ?<li>(.*?)<\/li> ?<\/ul>/)],
						italic: [2,(/följande c?e?n?t?r?a?l?a? ?innehåll<\/i>\:? *<\/italic>\:? ?<\/p> *(<p> *<\/p>)?<ul> ?<li>(.*?)<\/li> ?<\/ul>/)]
					},function(a,name){
						if (!course.content){
							var match = raw.match(a[1]);
							if (match){
								try {
									if (match[a[0]].length < 10){
										console.warn("Very small hit for",name,"for course",course.code,course.name,match);
										throw "ERROR";
									}
									course.content = match[a[0]].split("</li> <li>");
								} catch(e){
									console.warn("Error while singletrying",name,"for course",course.code,course.name,match);
									throw e;
								}
							}
						}
					});
					if (!course.content){
						_.map({
							normalmulti: [4,(/följande (centrala )?innehåll: ?<\/[h4i]{1,2}>(<\/p>)?(<p> ?<\/p>)?(.*?)<p> *(<b> *<\/b>)? *<\/p>/)],
							italicmulti: [2,(/följande (centrala )?innehåll<\/i>\:? *<\/italic>\:? ?<\/p> *(.*?) *<p> *<\/p>  *<div class="clearer">/)]
						},function(a,name){
							if (!course.content){
								var match = raw.match(a[1]);
								if (match){
									try {
										var o={}, part, block = match[a[0]];
										while(part = block.match(/^<p>(.*?)<\/p><ul>(.*?)<\/ul>/)){
											//console.log("PART",part);
											var title = part[1].replace(/<\/?[a-z0-9]*>/g,"").trim(),
												lines = part[2].replace(/^ *<li>| *<\/li> *$/g,"").trim().split(/<\/li> *<li>/);
											o[title]=lines;
											block = block.replace(part[0],"");
										}
										course.content = o;
									} catch(e){
										console.warn("Error while multitrying",name,"for course",course.code,course.name);
										throw e;
									}
								}
							}
						});
					}
					if (!course.content){
						console.warn("Couldn't figure out where central content is for",course.code,course.name,raw);
						throw "ERROR";
					}
					// SAVE
					fs.writeFile("./courses/"+course.code+".json",JSON.stringify(course).replace(/\,"/g,',\n"').replace("��","å"));
				}
			}
			// FINISH
			fs.writeFile("./subjects/"+code+".json",JSON.stringify(sub).replace(/"\,"/g,'",\n"'));
		});
	});
});
