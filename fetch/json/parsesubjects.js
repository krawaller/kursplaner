var fs = require('fs'),
	_ = require('lodash'),
	subs = require('../subjects.json'),
	jsdom = require('jsdom');

fs.readFileS = function(path,callback){ callback(null,fs.readFileSync(path)); }

var otherrules = fs.readFileSync("../html/vissaamnen.html").toString();

var GLOBAL = { courses: {}, subjects: {}, coursetocode: {}, codetocode: {}, codetosubjcourse: {}, coursenames:[]};

_.each(["COMMON","VOCATIONAL","OTHER"],function(type){
	var folder = "../html/subjects/"+type+"/";
	_.each(_.without(fs.readdirSync(folder),".DS_Store"),function(path){
		fs.readFileS(folder+path,function(err,data){
			data = data.toString().replace(/[\n\t\r\f]/g,"").replace(/ {2}/g," ").replace("TIG-svetsning rår","TIG-svetsning rör").replace(/[a-zåäö] *<br\/?> *[a-zåäö]/g,"").replace(/[-–]|&mdash;/g,"-").replace("synen p�� männis","synen på männis").replace("H��lsopedagogik","Hälsopedagogik").replace("utvärderar med<br/>","utvärderar med").replace("I<br/>utvärderingen","I utvärderingen").replace(/\b/,"").replace(/[\x00-\x1F\x7F-\x9F]/g, "");
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
					//console.log("Subject",code,name,"has comment",cname,"with length",ccont.length);
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
			// SUBJECTS INFO ABOUT COURSE
			try {
				var defs = data.match(/Kurser i ämnet ?<\/h3><p> ?<\/p><ul.*?> ?(.*?) ?<\/ul>/)[1].replace(/^<li> ?/,"").replace(/<\/li> ?$/,"").replace("poång","poäng").split(/<\/li> ?<li>/);
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
					throw "GNUU";
				}
			}
			// INDIVIDUAL COURSES
			var datapart = data.match(/Kurser i ämnet ?<\/h3>.*?</)
			if (defs.length){
				for(var i=0;i < defs.length;i++){
					var def = defs[i], course = {subject:code};
					// NAME
					var trans={
						"Nätunderhållsarbete på luftledningsnät 0,4–24 kV":"Nätunderhållsarbete på luftledningsnät 0,4-24kV",
						"Kommunikationsteknik 3":"Kommunikationsnät 3",
						"Kontorssystem":"Kontorstekniksystem",
						"Historia 2b kultur": "Historia 2b - kultur"
					};
					def = def.replace("Svenska som andraspråk 1, som bygger","Svenska som andraspråk 1, 100 poäng, som bygger").replace("Svenska som andraspråk 2, som bygger","Svenska som andraspråk 2, 100 poäng, som bygger").replace("Svenska som andraspråk 3, som bygger","Svenska som andraspråk 3, 100 poäng, som bygger");
					course.name = def.split(/,?  ?\d{2,3}  ?poäng/)[0];
					if (trans[course.name]){
						course.name = trans[course.name];
					}
					// POÄNG
					try {
						course.points = +def.match(/(\d{2,3}) poäng/)[1];
					} catch(e){
						course.points = 100;
						console.log("Couldn't read points for course",i,course.name,"in",type,code,name,"so assumed 100");
					}
					// FURTHER INSTRUCTION
					function fixLinkStr(str){
						_.each({
							"MATMAT01b eller MATMAT01c": /matematik 1b eller 1c/gi,
							"MATMAT01a eller MATMAT01c": /matematik 1a eller 1c/gi,
							"MATMAT01a eller MATMAT01b": /matematik 1a eller 1b/gi,
							"MATMAT01a, MATMAT01b eller MATMAT01c": /matematik 1a\, 1b eller 1c/gi,
							"MATMAT02b eller MATMAT02c": /matematik 2b eller 2c/gi,
							"MATMAT02a eller MATMAT02c": /matematik 2a eller 2c/gi,
							"MATMAT02a eller MATMAT02b": /matematik 2a eller 2b/gi,
							"MATMAT02a, MATMAT02b eller MATMAT02c": /matematik 2a\, 2b eller 2c/gi,
							"MATMAT03b eller MATMAT03c": /matematik 3b eller 3c/gi,
							"DAKMOD01": /modern dans 1/gi,
							"DAKMOD02": /modern dans 2/gi,
							/*"PERBRO0": /Bromsar, kaross och chassi/gi,
							"SAHBYN0": /Byggnads-\, installations- och anläggningsteknik/gi,
							"VAEDRT0": /Drift, underhåll, säkerhet och miljö/gi,
							"VAEHYD0": /Hydraulik, kraftstationshydraulik och turbiner/gi,
							"MEEJOU01": /Journalistik, reklam och information 1/gi,
							"MEEJOU02": /Journalistik, reklam och information 2/gi,
							"HAAKOS0": /Kost, måltid och munhälsa/gi,*/
						},function(regex,replace){ str = str.replace(regex,replace); });
						return str;
					}
					var instr = def.split(/,?  ?\d{2,3}  ?poäng,?  ?/)[1];
					if (instr){
						course.instrRAW = instr = fixLinkStr(instr);
						// REPEAT
						var rep = instr.match(/och kan läsas flera gånger med olika innehåll|Kursen kan läsas (läsas )?flera? gånger med olika .*?\.|Kursen kan läsas flera gånger med innehåll från olika .*\.|som kan läsas flera gånger med olika innehåll\.|Kursen kan läsas flera gånger i olika språk\./)
						if (rep){
							instr = instr.replace(rep[0],"");
							course.repeat = rep[0].replace(/^och kan läsas/,"Kan läsas");
						}
						// REQUIREMENTS
						var req = instr.match(/som bygger på (.*?)\.|som beroende av valt kunskapsområde bygger på (.*?)\.|som beroende på valt kunskapsområde bygger på (.*?)\./);
						if (req){
							course.reqRAW = req[1]||req[2]||req[3];
							//course.requirements = courseList(req[1]||req[2]||req[3],course.name);
							instr = instr.replace(req[0],"");
							var alsoreq = instr.match(/Dessutom bygger den på (.*?)\.|Den bygger också på (.*?)\./);
							if (alsoreq){
								course.alsoreqRAW = alsoreq[1]||alsoreq[2];
								//course.requirements = {type:"AND",arr:[course.requirements,courseList(alsoreq[1]||alsoreq[2],course.name)]};
								instr = instr.replace(alsoreq[0],"");
							}
						}
						// NOTWITH
						var notwith = instr.match(/Betyg i kursen kan inte ingå i elevens examen tillsammans med betyg i (.*?)\.|( *I ett och samma språk kan endast betyg i en av kurserna språk specialisering – retorik 1[ab] eller språk specialisering – retorik 1[ab] ingå i elevens examen\. *)/);
						if (notwith){
							//course.notwith = courseList(notwith[1]||notwith[2],course.name);
							course.notwithRAW = notwith[1]||notwith[2];
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
							course.reqRAW = "som bygger på minst 800 poäng av yrkesprogrammets karaktärsämnen"
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
					}
					// RAW DATA
					var raw;
					try {
						var regdef = "> *"+course.name+', *\\d{2,3} *poäng<\\/h2><div id="([A-ZÅÄÖa-zåäö0-9 ]*?)".*?>(.*?)(<\\/div><script|<a id="anchor)',
							regex = new RegExp(regdef,"i"),
							match = data.match(regex);
						course.code = match[1].replace(" ","");
						data = data.replace(regdef,"");
						if (!GLOBAL.codetosubjcourse[course.code]){
							GLOBAL.codetosubjcourse[course.code] = code+" --- "+course.name;
						} else {
							console.log(code,"1:::",course.name,"WANTS TO BE",course.code,"but that's already taken by",GLOBAL.codetosubjcourse[course.code]);
							throw "EEE";
						}
						raw = match[2];
					} catch(e){
						try {
							var regdef = "> *"+course.name+', *\\d{2,3} *poäng<\\/h2><div id="([A-ZÅÄÖa-zåäö0-9]*?)".*?>(.*?)(<\\/div><script|<a id="anchor)',
								regex = new RegExp(regdef,"i"),
								match = data.match(regex);
							course.code = match[1];
							console.log("Step 2 delete ?",!!data.match(regdef,""));
							data = data.replace(regdef,"");
							raw = match[2];
							if (!GLOBAL.codetosubjcourse[course.code]){
								GLOBAL.codetosubjcourse[course.code] = code+" --- "+course.name;
							} else {
								console.log(code,"2:::",course.name,"WANTS TO BE",course.code,"but that's already taken by",GLOBAL.codetosubjcourse[course.code]);
								throw "EEE";
							}
						} catch(e) {
							console.log("Failed to read code and raw for course",type,code,course.name,"REG:",regdef);
							throw e;
						}
					}
					// STEAL EVENTUAL COURSE COMMENTS FROM SUBJECT
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
							var nums = _.map(val.trim().split(/\-/),function(s){return +s;});
							if (_.find(nums,function(n){return (typeof n === "string") && n.match(/\D/);})){
								//console.log("SHITPART",str,parts,nums,_.find(nums,function(n){return (typeof n === "string") && n.match(/\D/);}))
								return m;
							}
							//try{_.range(nums[0]-1,nums[1]);} catch(e){ console.log("SHIT",str,nums); throw e; }
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
						goalstr = match[1].replace(/<\/?italic>/g,"").replace("Ämnets syfte i ämnet materialkunskap.","Ämnets syfte.").replace("1-­5","1-5");
						if (goalstr.match(/omfattar samtliga mål/)){
							course.goals = _.range(sub.goals.length).map(function(l){return 1;});
							//console.log("ALL GOALS",course.name,course.goals)
						} else {
							var m = goalstr.match(/(Kursen bygger på |s?k?a? ?omfattar? punkte?r?n?a? )(.*?)( o?c?h? ?under r?u?b?r?i?k?e?n? ?[Ää]mnets? syfte[\.\,]|\.)/),
								f = (m && m[2] || ""),
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
					// JUDGEMENTS! FINALLY
					try {
						// ---- ERRORS ----
						// INULAB0 sista i C unik
						// HAVFIN05S näst sista i E saknar motsvarighet, samma plats i C och A stämmer överens men saknas i E
						// RINRID02 sista i E och C saknas i A
						// FÖRENT0 sista två i E och C saknas i A
						// ---- NEEDS ADJUST ----
						// MEDMED02 andra i C och A saknar motsvarighet i E
						var jraw = raw.match(/Kunskapskrav *<\/h2> *(.*?) *<\/div>/)[1].replace(/<br\/> *(<br\/>)? *<\/p>/g,"</p>").replace(/<p> *(<br\/?>)? *<\/p>/g,"").replace(/<b> *<br\/?> *<\/b>/g,"").replace("<br/>","</p><p>").replace(/<p> *\.? *<\/p>/g,"").replace(/[a-zåäö]<b> /g," <b>").replace(/ <\/b>/g,"</b> ");
						course.judgeraw = jraw;
						_.each({
							0: /<b> *<\/b>/g,
							"<b>med viss säkerhet": /<b>med<\/b> <b>viss säkerhet/g,
							"<b>med säkerhet": /<b>med<\/b> <b>säkerhet/g,
							"<b>i viss": /<b>i<\/b> <b>viss/g,
							"<b>utförligt och nyanserat": /<b>utförligt<\/b> <b>och nyanserat/g,
							"utförligt och</b> <b>nyanserat</b>": /utförligt och nyanserat<\/b>/g,
							"<b>välgrundade och nyanserade": /<b>välgrundade och<\/b><b> nyanserade/g,
							"<b>det huvudsakliga": /<b>det<\/b> <b>huvudsakliga/g,
							"<b> Eleven utvärderar": /<b> Eleven <\/b><b>utvärderar/g,
							"<b>mycket gott": /<b>mycket<\/b> <b>gott/g,
							"visst handlag": /visst <\/b><b>handlag/g,
							"efter samråd": /efter<\/b><b> samråd/g,
							"välgrundade och nyanserade": /välgrundade<\/b><b> och nyanserade/g,
							"välgrundade och nyanser": /välgrundade <\/b><b>och nyanser/g,
							"med viss": /med<\/b> <b>viss/g,
							"effektivt sätt": /effektivt<\/b> <b>sätt/g,
							"ett fåtal": /ett<\/b> <b>fåtal/g,
							"<b>Eleven utvärderar": /<b>Eleven<\/b> <b>utvärderar/g
						},function(regex,repl){jraw = jraw.replace(regex,repl||"");});
						_.each({
							"BAGBAG04": {
								"omdömen.</p><p>När eleven samråder": /omdömen. När eleven samråder/g,
								"förbättras.</b></p><p>När": /förbättras<\/b>. *När/g,
							},
							"BAGCHO0": {
								"omdömen.</p><p>När eleven samråder": /omdömen. När eleven samråder/g	
							},
							"HYGHYG0": {
								"förgiftningar.</p><p>I sitt": /förgiftningar. I sitt/g,
								"säker livsmedelshantering.</p><p>Eleven följer": /säker livsmedelshantering. Eleven följer/g,
								"bestämmelser.</p><p>När": /bestämmelser. När/g
							},
							"PSKPSY02a":{
								"helhetssynen på människan.</p><p>Eleven":/helhetssynen på människan. Eleven/g
							},
							"GERVÅR0": {
								"dagliga arbetet.</p><p>När eleven":/dagliga arbetet. När eleven/g
							},
							"ITIITI0": {
								".</p><p>När eleven":/\. *När eleven/g
							},
							"LANLAN02": {
								"produktionsekonomin.</p><p>När eleven": /produktionsekonomin\. När eleven/g
							},
							"PEGPEA0": {
								"förbättringar.</p><p>Eleven": /förbättringar\. *Eleven/g
							},
							"SAISAM04": {
								"uppkommer.</p><p>Eleven": /uppkommer\. Eleven/g
							},
							"SAISAM05": {
								"uppkommer.</p><p>Eleven beskriver": /uppkommer\. Eleven beskriver/g
							},
							"SERSER02": {
								".</p><p>När eleven samråder": /\. När eleven samråder/g
							},
							"SKOMÅN0": {
								"friluftsliv.</p><p>När eleven samråder": /\. När eleven samråder/g
							},
							"MEPMEI01": {
								"önskvärt resultat.</p><p>Eleven gör": /önskvärt resultat\. Eleven gör/g
							},
							"MEPMEI02": {
								"önskvärt resultat.</p><p>Eleven gör": /önskvärt resultat\. Eleven gör/g
							},
							"MEIRAD0": {
								"sjukvården.</p><p>Eleven installerar": /sjukvården\. Eleven installerar/g
							},
							"HIOHIL0": {
								"diskutera.</b></p><p>Eleven använde": /diskutera\.<\/b> Eleven använde/g
							},
							"HIOHIP0": {
								"diskutera.</b></p><p>Eleven använde": /diskutera\.<\/b> Eleven använde/g
							},
							"HIOHIO0": {
								"diskutera.</b></p><p>Eleven använde": /diskutera\.<\/b> Eleven använde/g
							},
							"TURGUI0": {
								"mottagare. När arbetet": /mottagare\.<\/p><p>När arbetet/g
							},
							"STYFIN0": {
								".</p><p>När eleven samråder": /\. När eleven samråder/g
							},
							"STYCHA00S": {
								".</p><p>När eleven samråder": /\. När eleven samråder/g
							},
							"STYCHA02": {
								".</p><p>När eleven samråder": /\. När eleven samråder/g
							},
							"SPEIDT0": {
								"ledarskap.</p><p>När eleven": /ledarskap\. När eleven/g
							},
							"SPEIDS01": {
								".</p><p>Dessutom diskuterar eleven": /\. Dessutom diskuterar eleven/g
							},
							"GRÄGRN0": {
								" ": /<br\/>/g,
								"andra bestämmelser": "andrestämmelser",
								"utformade efter geografisk kontext. Dessutom hänvisar eleven": "utformade efter geografisk kontext.<br/>Dessutom hänvisar eleven",
								"gränssnitt till en applikation. Projektplanen": "gränssnitt till epplikation. Projektplanen",
								"utformningen av datorsystem":"utformningen aatorsystem",
								"visuell design":"visuelesign",
								"en huvudsakligen":"euvudsakligen",
								"problemformulering utifrån":"problemformulerintifrån",
								"funktionsnedsättningar":"funktionsned­sättningar"
							},
							"RINRID02": { // warn
								"aktuella situationer.</p><p>När eleven samråder med handledare bedömer hon eller han <b>med säkerhet</b> den egna förmågan och situationens krav.</p>": /aktuella situationer\.<\/p> *$/g
							},
							"MEDMED02": { // warn
								"kan rubbas.</p><p>Eleven förklarar <b>översiktligt</b> några samband mellan människa, miljö, livsstil och specifika sjukdomar.</p>": /kan rubbas\.<\/p>/,
								"Eleven förklarar <b>utförligt</b> några samband mellan människa, miljö, livsstil och specifika sjukdomar": /<b>Eleven förklarar utförligt några samband mellan människa, miljö, livsstil och specifika sjukdomar<\/b>/,
								"Eleven förklarar <b>utförligt och nyanserat</b> några samband mellan människa, miljö, livsstil och specifika sjukdomar. <b>Dessutom": /<b>Eleven förklarar utförligt och nyanserat några samband mellan människa, miljö, livsstil och specifika sjukdomar\. Dessutom/
							},
							"INULAB0": { // warn
								" ": /<p>Eleven använder med viss säkerhet terminologi och fackspråk samt samarbetar med andra för att lösa arbetsuppgifter. Dessutom redogör eleven utförligt för betydelsen av samarbete.<\/p>/
							},
							"HAVFIN05S": { // warn
								" ": /<p>Eleven agerar kundorienterat i <b>bekanta<\/b> försäljnings- eller servicesituationer samt motiverar <b>översiktligt<\/b> sitt agerande\.<\/p>/g
								//"arbetsmiljön.</b></p><p>Eleven agerar kundorienterat i <b>bekanta</b> försäljnings- eller servicesituationer,<b> tar egna initiativ</b> samt motiverar <b>utförligt</b> sitt agerande.</p>": /arbetsmiljön<\/b>\./g,
								//"bidra till dessa.</b></p><p>Eleven agerar kundorienterat i <b>nya</b> försäljnings- eller servicesituationer, <b>tar egna initiativ</b> samt motiverar <b>utförligt och nyanserat</b> sitt agerande <b>och ger förslag på alternativa tillvägagångssätt i agerandet</b>.</p>":
							},
							"FÖRENT0": { // warn
								"<b>samt ger förslag på hur arbetsprocessen kan förbättras</b>.</p><p>Eleven använder <b>med säkerhet</b> relevanta företagsekonomiska begrepp och metoder för företagets arbetsområde.</p><p>När eleven samråder med handledare bedömer hon eller han <b>med säkerhet</b> den egna förmågan och situationens krav.</p>": /<strong>samt ger förslag på hur arbetsprocessen kan förbättras<\/str *> *<\/p>/
							}
						}[course.code]||{},function(regex,repl){
							jraw = jraw.replace(regex,repl||"");
						});
						var g = {
							e: jraw.match(/<h4>Betyget E<\/h4> *<p>(.*?) *<\/p> *<h4>/)[1].split(/<\/p> *<p>/),//.map(splitJudgeList),
							c: jraw.match(/<h4>Betyget C<\/h4> *<p>(.*?) *<\/p> *<h4>/)[1].split(/<\/p> *<p>/),//.map(splitJudgeList),
							a: jraw.match(/<h4>Betyget A<\/h4> *<p>(.*?) *<\/p> *$/)[1].split(/<\/p> *<p>/),//.map(splitJudgeList)
						}
						if (course.code==="GRÄGRN0" && g.e.length===8 && g.c.length===7){
							g.e[6] = g.e[6]+" "+g.e[7];
							g.e.pop();
							console.log("fixar lite med GRÄGRN0 dårå")
						}
						if (!(g.e.length === g.c.length && g.c.length === g.a.length)){
							console.log("Different number of ps in ",course.name,course.code,g.e.length,g.c.length,g.a.length)
							if (course.code==="GRÄGRN0"){
								console.log(g.e);
							}
						}
						course.judge = g;
						if ({"RINRID02":1,"MEDMED02":1,"INULAB0":1,"HAVFIN05S":1,"FÖRENT0":1}[course.code]){
							course.judgechangewarn = true;
						};
					} catch(e){
						console.log("Error reading judgement parts for",course.name);
						throw e;
					}

					// SAVE TO GLOBAL
					GLOBAL.courses[course.code] = course;
					GLOBAL.coursenames.push(course.name);
					GLOBAL.codetocode[course.code] = course.code;
					GLOBAL.coursetocode[course.name] = course.code;
				}
			}
			// FINISH
			fs.writeFile("./subjects/"+code+".json",JSON.stringify(sub).replace(/"\,"/g,'",\n"'));
			GLOBAL.subjects[sub.code]=sub;
		});
	});
});

// COURSELINKS

var text = {
	"de kunskaper grundskolan ger eller motsvarande":1,
	"grundskolans kunskaper eller motsvarande":1
};

function compileLinks(l,from){
	if (l.target || l.type === "text"){
		return l;
	} else if (_.isArray(l)){
		return _.map(l,function(s){return compileLinks(s,from);})
	} else if (l.type && l.arr){
		return {type:l.type,arr:compileLinks(l.arr,from)};
	} else if (typeof l === "string"){
		var low = l.toLowerCase(),
			find = GLOBAL.coursetocode[low];
		if (find){
			return {type:"link",target:find};
		} else if (text[l]){
			return {type:"text",target:l}
		} else {
			console.log("Failed",from,"when looking for",low);
		}
		if (GLOBAL.coursetocode[l]) {
			return ;
		}
	} else {
		console.warn("UNKNOWN LINK from",from,"which I don't get:",l);
		throw "MOO";
	}
};

fs.writeFile("./namelist.txt",_.keys(GLOBAL.coursetocode).sort().join("\n"));

function courseList(str,code){
	var ret, t;
	str = str.replace(/^ */,"");
	//if (t=str.match(/kursen (.*?) eller p?å? ?kurserna (.*?)/)){
	//	ret = {type:"OR",arr:[t[1],{type:"AND",arr:_.difference(t[2].replace("kursen ","").split(/, | (och|samt) /),[undefined,"kursen "])}]};
	//} else
	if (t=str.match(/någon av kurserna [^\.]*? eller/)){
		ret = {type:"OR",arr:str.replace(/^ *någon av kurserna /,"").split(/, | eller /)};
	} else if (str.match(/någon av kurserna [^\.]*? och/)){
		ret = {type:"AND",arr:str.replace(/^ *någon av kurserna /,"").split(/, | och /)};
	} else if (str.match(/^ *kursen/)&&str.match(/eller/)){
		ret = {type:"OR",arr:_.difference(str.replace(/^ *kursen */,"").split(/, *(kursen *)?| *eller *(kursen *)?/g),[undefined,"kursen "])};
	} else if (str.match(" samt ")){
		ret = {type:"AND",arr:str.split(" samt ")};
	} else if (str.match(" och ")){
		ret = {type:"AND",arr: _.difference(str.replace(/^ *kursen */,"").split(/, *(kursen *)?| *och *(kursen *)?/g),[undefined,"kursen "])};
	} else {
		ret = str.trim().replace(/^kursen /,"").replace(/ med innehåll från vald profil$/,"");
	}
	if (ret.arr){
		ret.arr = _.map(ret.arr,function(c,n,list){
			if (c.match(/^ *på kurserna /)){
				return courseList(c.replace(/^ *på */,"någon av kurserna "),code)
			}
			return (n && c[0].match(/^\d/) ? list[0].split(/ \d/)[0]+" "+c : c).trim().replace("kursen ","");
		});
	}
	if (code==="Samernas kultur och historia"){
		console.log("tried my best with",str,"for",code,", got",ret);
	}
	return ret;
}

var names = _.keys(GLOBAL.coursetocode).sort(function(s,t){return s.length>t.length?-1:s.length<t.length?1:s>t;});
_.each(GLOBAL.courses,function(course,code){
	_.each(["reqRAW","notwithRAW","alsoreqRAW"],function(prop){
		if (course[prop]){
			_.each(names,function(name){
				course[prop] = course[prop].replace(" "+name.toLowerCase().replace("vvs","VVS")," "+GLOBAL.coursetocode[name]);
			});
		}
	});
	/*_.each(["requirements","notwith"],function(prop){
		if (course[prop]){
			course[prop+"COMP"] = compileLinks(course[prop],code);
		}
	});*/
	fs.writeFile("./courses/"+course.code+".json",JSON.stringify(course).replace(/\,"/g,',\n"').replace("��","å"));
});


