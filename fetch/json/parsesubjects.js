var fs = require('fs'),
	_ = require('lodash'),
	subs = require('../subjects.json'),
	jsdom = require('jsdom');

fs.readFileS = function(path,callback){ callback(null,fs.readFileSync(path)); }

var otherrules = fs.readFileSync("../html/vissaamnen.html").toString();

var GLOBAL = {
	grundsubjects: [],
	grundcourses:[],
	grundvuxsubjects: [],
	grundvuxcourses:[],
	gysubjects:[],
	gycourses:[],
	courses: {},
	subjects: {},
	coursetocode: {},
	codetocode: {},
	codetosubjcourse: {},
	coursenames:[],
	subjectcodes:[],
	coursecodes: [],
	livecoursenamestocode: {},
	deadcoursenamestocode: {},
	lowercasecourses: []
};

var novux = { // http://www.skolverket.se/laroplaner-amnen-och-kurser/vuxenutbildning/komvux/gymnasial/amnen-som-inte-kan-ges-inom-kommunal-vuxenutbildning-1.177099
	SPE: 1, // Specialidrott
	DAG: 1, // Dansgestaltning för yrkesdansare
	DAK: 1, // Dansteknik för yrkesdansare
	BYL: 1, BYP: 1, // byggproduktionsledning
	DAA: 1, DAL: 1, // datalagring
	GYM: 1, GYN: 1, // gymnasieingejnör i praktiken
	INA: 1, INO: 1, // Informationsteknisk arkitektur och infrastruktur
	MJU: 1, MJK: 1, // mjukvarudesign
	PRT: 1, PRI: 1, // produktionsfilosifi
	HUA: 1, // hum spets
	NAE: 1, // naturspets
	ELP: 1, // elprojektering
	INT: 1,
	TEY: 1,
	TES: 1
};

var newauthrules = {
	// uppdaterade SKOLFS 2012
	DAA: "<p>En lärares kompetens är relevant för ämnet datalagring om han eller hon</p><p>&#160;&#160; 1. med godkänt resultat har genomgått utbildning om 90 högskolepoäng inom datateknik, datalogi eller informatik varav 30 högskolepoäng inom programmering eller webbserverprogrammering och 7,5 högskolepoäng inom databashantering och datalagring, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	DIG: "<p>En lärares kompetens är relevant för ämnet digitalt skapande om han eller hon</p><p>&#160;&#160; 1. har behörighet i något av ämnena mediekommunikation i gymnasieskolan eller medieproduktion i gymnasieskolan, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	EST: "<p>En lärares kompetens är relevant för ämnet estetisk kommunikation om han eller hon</p><p>&#160;&#160; 1. har behörighet i något av ämnena animation i gymnasieskolan, bild i gymnasieskolan, cirkus i gymnasieskolan, dans i gymnasieskolan, digitalt skapande i gymnasieskolan, fotografisk bild i gymnasieskolan, musik i gymnasieskolan eller teater i gymnasieskolan, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	EUR: "<p>En lärares kompetens är relevant för ämnet eurytmi om han eller hon</p><p>&#160;&#160; 1. med godkänt resultat genomgått eurytmilärarutbildningen vid Rudolf Steinerhögskolan, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser i eurytmi.</p>",
	FIL: "<p>En lärares kompetens är relevant för ämnet film- och tv-produktion om han eller hon</p><p>&#160;&#160; 1. har behörighet i något av ämnena bild i gymnasieskolan, mediekommunikation i gymnasieskolan eller medieproduktion i gymnasieskolan och med godkänt resultat har genomgått en utbildning om 15 högskolepoäng inom film eller rörlig bild, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	GRA: "<p>En lärares kompetens är relevant för ämnet grafisk kommunikation om han eller hon</p><p>&#160;&#160; 1. har behörighet i något av ämnena bild i gymnasieskolan, mediekommunikation i gymnasieskolan, medieproduktion i gymnasieskolan eller visuell kommunikation i gymnasieskolan och med godkänt resultat har genomgått en utbildning om 15 högskolepoäng inom grafisk kommunikation, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	"GRÄ": "<p>En lärares kompetens är relevant för ämnet gränssnittsdesign om han eller hon</p><p>&#160;&#160; 1. har behörighet i något av ämnena animation i gymnasieskolan, digitalt skapande i gymnasieskolan, grafisk kommunikation i gymnasieskolan, programmering i gymnasieskolan eller webbteknik i gymnasieskolan samt med godkänt resultat har genomgått utbildning om 15 högskolepoäng inom mjukvarudesign, programmering eller webbutveckling och dessutom med godkänt resultat har genomgått utbildning om 15 högskolepoäng inom gränssnitts-design, interaktionsdesign, användbarhet eller informationsarkitektur, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	HUM: "<p>En lärares kompetens är relevant för ämnet humanistisk och samhällsvetenskaplig specialisering om han eller hon</p><p>&#160;&#160; 1. har behörighet i något av ämnena engelska i gymnasieskolan, filosofi i gymnasieskolan, företagsekonomi i gymnasieskolan, geografi i gymnasieskolan, grekiska i gymnasieskolan, historia i gymnasieskolan, juridik i gymnasieskolan, konst och kultur i gymnasieskolan, latin i gymnasieskolan, mediekommunikation i gymnasieskolan, medier, samhälle och kommunikation i gymnasieskolan, moderna språk i gymnasieskolan, modersmål i gymnasieskolan, människans språk i gymnasieskolan, pedagogik i gymnasieskolan, psykologi i gymnasieskolan, religionskunskap i gymnasieskolan, samhällskunskap i gymnasieskolan, sociologi i gymnasieskolan, svenska i gymnasieskolan, svenska som andraspråk i gymnasieskolan eller svenskt teckenspråk i gymnasieskolan, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	HUA: "<p>En lärares kompetens är relevant för ämnet humanistisk och samhällsvetenskaplig spets inom försöksverksamhet med riksrekryterande gymnasial spetsutbildning om han eller hon</p><p>&#160;&#160; 1. har behörighet i något av ämnena engelska i gymnasieskolan, filosofi i gymnasieskolan, företagsekonomi i gymnasieskolan, geografi i gymnasieskolan, grekiska i gymnasieskolan, historia i gymnasieskolan, juridik i gymnasieskolan, konst och kultur i gymnasieskolan, latin i gymnasieskolan, mediekommunikation i gymnasieskolan, medier, samhälle och kommunikation i gymnasieskolan, moderna språk i gymnasieskolan, modersmål i gymnasieskolan, människans språk i gymnasieskolan, pedagogik i gymnasieskolan, psykologi i gymnasieskolan, religionskunskap i gymnasieskolan, samhällskunskap i gymnasieskolan, sociologi i gymnasieskolan, svenska i gymnasieskolan, svenska som andraspråk i gymnasieskolan eller svenskt teckenspråk i gymnasieskolan, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	KOS: "<p>En lärares kompetens är relevant för ämnet konst och kultur om han eller hon</p><p>&#160;&#160; 1. har behörighet i något av ämnena bild i gymnasieskolan, dans i gymnasieskolan, historia i gymnasieskolan, musik i gymnasieskolan eller teater i gymnasieskolan samt därutöver breddat sin utbildning inom ett annat ämnesområde genom att med godkänt resultat ha genomgått utbildning om 15 högskolepoäng inom arkitektur, dansvetenskap, estetik, filmvetenskap, idéhistoria, konstvetenskap, kulturvetenskap, musikvetenskap eller teatervetenskap, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	LJU: "<p>En lärares kompetens är relevant för ämnet ljudproduktion om han eller hon</p><p>&#160;&#160; 1. har behörighet i ämnet film- och tv-produktion i gymnasieskolan och med godkänt resultat har genomgått en utbildning om 15 högskolepoäng inom ljudproduktion och ljudmedier, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	MEE: "<p>En lärares kompetens är relevant för ämnet mediekommunikation om han eller hon</p><p>&#160;&#160; 1. har behörighet i något av ämnena film- och tv-produktion i gymnasieskolan, grafisk kommunikation i gymnasieskolan, ljudproduktion i gymnasieskolan, medieproduktion i gymnasieskolan, medier, samhälle och kommunikation i gymnasieskolan eller visuell kommunikation i gymnasieskolan och med godkänt resultat genomgått utbildning om 15 högskolepoäng inom medieområdet med inriktning mot information och reklam eller medieproduktion omfattande kunskaper i mediekommunikation, mediekunskap eller journalistik,</p><p>&#160;&#160; 2. med godkänt resultat har genomgått utbildning om 90 högskolepoäng inom medieområdet med inriktning mot information och reklam eller medieproduktion omfattande kunskaper i mediekommunikation, mediekunskap eller journalistik, eller</p><p>&#160;&#160; 3. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	MEP: "<p>En lärares kompetens är relevant för ämnet medieproduktion om han eller hon</p><p>&#160;&#160; 1. har behörighet i något av ämnena film- och tv-produktion i gymnasieskolan, grafisk kommunikation i gymnasieskolan, ljudproduktion i gymnasieskolan, mediekommunikation i gymnasieskolan eller visuell kommunikation i gymnasieskolan, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	MER: "<p>En lärares kompetens är relevant för ämnet medier, samhälle och kommunikation om han eller hon</p><p>&#160;&#160; 1. har behörighet i något av ämnena film- och tv-produktion i gymnasieskolan, grafisk kommunikation i gymnasieskolan, ljudproduktion i gymnasieskolan, mediekommunikation i gymnasieskolan, medieproduktion i gymnasieskolan eller visuell kommunikation i gymnasieskolan och med godkänt resultat har genomgått utbildning om 15 högskolepoäng inom medieområdet eller kommunikation med relevans för ämnet,</p><p>&#160;&#160; 2. har behörighet i ämnet samhällskunskap i gymnasieskolan och med godkänt resultat har genomgått utbildning om 30 högskolepoäng inom medieområdet eller kommunikation med relevans för ämnet,</p><p>&#160;&#160; 3. med godkänt resultat har genomgått utbildning om 90 högskolepoäng inom medieområdet med inriktning mot information och reklam eller medie-produktion omfattande kunskaper i mediekommunikation, mediekunskap eller journalistik, eller</p><p>&#160;&#160; 4. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	MJK: "<p>En lärares kompetens är relevant för ämnet mjukvarudesign om han eller hon </p><p>&#160;&#160; 1. har behörighet i något av ämnena programmering i gymnasieskolan eller webbteknik i gymnasieskolan och har genomgått utbildning om 7,5 högskolepoäng inom projektmetodik och verktyg för mjukvaruutveckling, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	NAV: "<p>En lärares kompetens är relevant för ämnet naturvetenskaplig specialisering om han eller hon </p><p>&#160;&#160; 1. har behörighet i något av ämnena biologi i gymnasieskolan, geografi i gymnasieskolan, fysik i gymnasieskolan, kemi i gymnasieskolan, naturkunskap i gymnasieskolan eller teknik i gymnasieskolan, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	NAE: "<p>En lärares kompetens är relevant för ämnet naturvetenskaplig spets inom försöksverksamhet med riksrekryterande gymnasial spetsutbildning om han eller hon</p><p>&#160;&#160; 1. har behörighet i något av ämnena biologi i gymnasieskolan, geografi i gymnasieskolan, fysik i gymnasieskolan, kemi i gymnasieskolan, naturkunskap i gymnasieskolan eller teknik i gymnasieskolan, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	PRR: "<p>En lärares kompetens är relevant för ämnet programmering om han eller hon </p><p>&#160;&#160; 1. med godkänt resultat har genomgått utbildning om 90 högskolepoäng inom datateknik, datalogi eller informatik varav 30 högskolepoäng inom programmering, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	VIS: "<p>En lärares kompetens är relevant för ämnet visuell kommunikation om han eller hon </p><p>&#160;&#160; 1. har behörighet i något av ämnena bild i gymnasieskolan, fotografisk bild i gymnasieskolan, grafisk kommunikation i gymnasieskolan, mediekommunikation i gymnasieskolan eller medieproduktion i gymnasieskolan, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>",
	WEB: "<p>En lärares kompetens är relevant för ämnet webbteknik om han eller hon </p><p>&#160;&#160; 1. med godkänt resultat har genomgått utbildning om 90 högskolepoäng inom datateknik, datalogi eller informatik varav 15 högskolepoäng inom webbstandardbaserad webbutveckling på klientsidan, 7,5 högskolepoäng webbaserad interaktiv datorgrafik och 15 högskolepoäng inom webbserverprogrammering, eller</p><p>&#160;&#160; 2. på annat sätt visar likvärdiga kunskaper och kompetenser.</p>"
};



var splitinto = {
	AUT: ["AUO","ELI","FAI","INR"],
	ELT: ["ELO","MAY"],
	MÖN: ["DAI","MNU"],
	HOT: ["REC","VAI"],
	TUR: ["AKT","RES"],
	NAB: ["FOH","LAU","LAS","SKM","TRS"],
	ODL: ["VAO","TRR"],
	RID: ["RIN","TRV"],
	STY: ["STC","CHA"],
	VVS: ["VVI","INV"]
};

var shardof = _.reduce(splitinto,function(mem,arr,old){
	_.each(arr,function(c){ mem[c] = old; });
	return mem;
},{});

var replacedby = {
	BYL: "BYP",
	DAL: "DAA",
	GYM: "GYN",
	MJU: "MJK",
	INO: "INA",
	"NÄV": "NAI",
	PRT: "PRI"
};

var replaces = _.invert(replacedby);

_.each(["COMMON","VOCATIONAL","OTHER"],function(type){
	var folder = "../html/subjects/"+type+"/";
	_.each(_.without(fs.readdirSync(folder),".DS_Store"),function(path){
		fs.readFileS(folder+path,function(err,data){
			data = data.toString().replace(/s��kerhet/g,"säkerhet").replace(/fram��t/g,"framåt").replace(/[\n\t\r\f]/g,"").replace(/<div class="docs-wrapper">.*?<\/div>/g,"").replace("TIG-svetsning rår","TIG-svetsning rör").replace(/[a-zåäö] *<br\/?> *[a-zåäö]/g,"").replace(/[-–]|&mdash;/g,"-").replace(/redog��r/g,"redogör").replace(/n��gra/g,"några").replace(/utf��rlig/g,"utförlig").replace(/ramen f��r språkval/g,"ramen för språkval").replace("synen p�� männis","synen på männis").replace("H��lsopedagogik","Hälsopedagogik").replace("utvärderar med<br/>","utvärderar med").replace("I<br/>utvärderingen","I utvärderingen").replace(/st��ll/g,"ställ").replace(/\b/,"").replace(/[\x00-\x1F\x7F-\x9F]/g, "").replace("på kursen på kursen","på kursen").replace("��ven ","även ").replace("samr��d","samråd").replace("Fr��n","Från").replace("omr��den","områden").replace(/anv��nd/g,"använd").replace("s�� att","så att").replace("dialog lärare���elev","dialog lärare-elev").replace("Modersm��l","Modersmål").replace("po��ng","poäng").replace("inneh��ller","innehåller").replace("f��ljande","följande").replace("spr��k","språk").replace(/<!-- FW_SEARCH_INDEX_END -->/g,"").replace(/<!-- FW_SEARCH_INDEX_BEGIN -->/g,"").replace(/[Nn]ätunderhållsarbete på luftledningsnät 0,4([—-]|&mdash;)24 ?kV/g,"Nätunderhållsarbete på luftledningsnät 0,4–24kV").replace("bygger p�� kursen","bygger på kursen").replace(/<\/?italic>/g,"").replace("Kurser i ��mnet","Kurser i ämnet").replace("centrala inneh��ll","centrala innehåll").replace("mobila milj��er","mobila miljöer").replace("f��r vanliga","för vanliga").replace("r��r publicering","rör publicering").replace(/Mobila applikationer, 100 *poäng/g,"Mobila applikationer 1, 100 poäng").replace("v��xternas biologi","växternas biologi").replace("hj��lp","hjälp").replace("terr��ngtransport","terrängtransport").replace(/<header>.*?<\/header>/g,"").replace("inneh��ll","innehåll").replace("inneb��r","innebär").replace(/<i><i>/g,"<i>").replace(/<\/i><\/i>/g,"</i>").replace(/<p class="helper"><a href="(.*?)">Kommentar<\/a><\/p>/g,"").replace(/Underhåll ��� hydraulik/g,"Underhåll - hydraulik").replace(/ fr��n /g," från ").replace(/med arbetet g��r eleven en/g,"med arbetet gör eleven en").replace(/bes��ksnäring/g,"besöksnäring").replace("kursen psykologi 2, kursen historia 2 eller","kursen PSKPSY02a, kursen PSKPSY02b, kursen HISHIS02a, kursen HISHIS02b eller").replace(/som bygger på kursen byggprocessens organisation/g,"som bygger på kursen SAHBYC0").replace(/rubriken ��mnets/g,"rubriken Ämnets").replace(/flera g��nger/g,"flera gånger").replace(/ p�� /g," på ").replace(/Ö/g,"Ö").replace(/A¨/g,"Ä").replace(/ {2}/g," ");
			if (err || !data || data===" "){
				console.log("Error reading",folder+path)
				throw "FileReadError";
			}
			path = path.replace(/ä/g,"ä").replace(/å/g,"å").replace(/ö/g,"ö").replace(/Ä/g,"Ä").replace(/Å/g,"Å").replace(/Ö/g,"Ö");
			var code = path.split("_")[0],
				name = path.split("_")[1].replace(".html",""),
				origname = name;
			if (splitinto[code] || code==="ELP" || code === "INT"){
				name += " [uppdelad]";
			} else if (replacedby[code]){
				name += " [ersatt]";
			}
			var sub = {
				name:name,
				code:code,
				type:type,
				courses:[],
				obsolete: !!(splitinto[code] || replacedby[code] || code==="ELP" || code === "INT"),
				splitinto: splitinto[code],
				replacedby: replacedby[code],
				replaces: replaces[code],
				shardof: shardof[code],
				shardofwith: shardof[code] && splitinto[shardof[code]].filter(function(i){return i!==code;})
			};
			GLOBAL.gysubjects.push(code);
			/*var replacecode = {
				BYL: "BYP",
				DAL: "DAA",
				GYM: "GYN",
				INO: "INA",
				MJU: "MJK",
				NÄV: "NAI",
				PRT: "PRI"
			}[code], oldcode;
			if (replacecode){
				oldcode = code;
				code = replacecode;
				sub.oldcode = oldcode;
			}*/
			GLOBAL.subjectcodes.push(code);
			// COMMENTS
			var comm, commentblock = (
				data.match(/<div id="commentDivContainer">(.*?)<\/div><div id="printUp">/)||
				data.match(/Kommentarer till texten<\/h2> *(.*?)<\/article/) ||
				[]
			)[1]||"";
			if (commentblock){
				sub.comments={};
				while (comm=(
					commentblock.match(/<div id="([A-Z0-9\-a-z_]*)" class="commentContainer".*?<\/a>(<h.*?)<\/div><\/div>/) ||
					commentblock.match(/<div class="white-popup-block mfp-hide" id="([A-Z0-9\-a-z_]*)">(.*?)<\/div>/)
				)){
					var cname = comm[1], ccont = comm[2];
					sub.comments[cname] = ccont.replace(/<h2> *<\/h2>/g,"").replace(/^ *<h2>[^<]*<\/h2>/,"").replace(/h[123]>/g,"h4>").replace(/<img[^>]*>/g,"");
					//console.log("Subject",code,name,"has comment",cname,"with length",ccont.length);
					commentblock=commentblock.replace(comm[0],"");
				}
			}
			// AUTHORITY
			if (type==="OTHER"){
				if (newauthrules[sub.code]){
					sub.auth = newauthrules[sub.code];
					sub.auth2012 = true;
				} else {
					var regex = new RegExp('<h3><b>Ämnet '+origname.toLowerCase()+' ?</b></h3>(.*?)<h3>'),
						match = otherrules.match(regex);
					try {
						sub.auth = match[1];
					} catch(e){
						console.log("Error reading rule for",origname);
					}
				}
			}
			// DESCRIPTION
			try{
				sub.description = data.match(/textInclude\"\>(.*?)<h2/)[1];
			} catch(e) {
				try {
					sub.description = data.match(/<\/h2> *(.*?)<h2 id="anchor2"/)[1];
				} catch(e) {
					console.log("Error reading description for",type,code,name,"DATA",data,typeof data,data.length);
				}
			}
			// VUX
			sub.novux = !!novux[code]   //!_.contains(["SPE","DAG","DAK","BYL","DAL","GYM","INO","MJU","PRT","HUA","NAE"],code); // http://www.skolverket.se/laroplaner-amnen-och-kurser/vuxenutbildning/komvux/gymnasial/amnen-som-inte-kan-ges-inom-kommunal-vuxenutbildning-1.177099
			// PURPOSE
			try {
				if (code==="ITI"){
					sub.purpose = data.match(/(<p> Ämnet it i vård och omsorg ska .*?)<h4>/)[1];
				} else if (code==="SPA"){
					sub.purpose = data.match(/(<p>\s?Undervisninge?n? i .*? ska syfta till .*?)<\/p><p><\/p><ol> *<li>Förmåga/)[1];
					//sub.purpose = sub.purpose.replace(/<p><\/p><ol> <li>Förmåga att använda språket utifrån kunskaper.*$/,"")
				} else {
					sub.purpose = (
						data.match(/(<p>\s?Undervisninge?n? i .*? ska syfta till .*?)<h4>/)
					)[1];
				}
				
			} catch(e) {
				console.log("Boomed purpose for",code,name);
				throw e;
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
					console.log("Boomed parsing courselist for",type,code,name);
					throw "GNUU";
				}
			}
			// INDIVIDUAL COURSES
			var datapart = data.match(/Kurser i ämnet ?<\/h3>.*?</)
			if (defs.length){
				for(var i=0;i < defs.length;i++){
					var def = defs[i], course = {
						subject: code,
						novux: sub.novux
					};
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
					// UTGÅNGEN KURS
					course.origname = course.name;
					if (sub.obsolete){
						course.obsolete = true;
						course.name += " [ej aktuell]";
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
							"kurserna": "kurserna kurserna",
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
							"VÅRVÅR01": /vård och omsorgsarbete 1/,
							"VÅRVÅR02": /vård och omsorgsarbete 2/,
							"RENREE01.": /renen och rennäringen\./,
							"PRTPRO01": /produktionsfilosofi 1/g,
							"DATDAS01S, DATDAS02S, DATDAS03S eller DATDAS04S": /dansteknik 1, 2, 3 eller 4/,
							" ": /Betyg i kursen kan inte ingå i elevens examen tillsammans med betyg i kursen träningslära 3./,
							"HUSHUS03.": /husbyggnad 3\./,
							"BIIVAT01": "biologi i vattenmiljöer 1",
							"NAKNAK01a1": "naturkunskap 1a1",
							"FIKFIS01": "fiskevård 1",
							"FIKFIS02": "fiskevård 2",
							"som bygger på kursen besöksnäringen eller på kursen RENREN01": "som bygger på kursen besöksnäringen eller kursen renen och dess miljö",
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
					var instr = def.split(/,?  ?\d{2,3}  ?poäng,?\.? ? ?/)[1];
					if (instr){
						course.instrRAW = instr;
						instr = fixLinkStr(course.instrRAW);
						course.descarr = instr;
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
						if (instr.match(/^ *I ett och samma språk kan endast betyg i en av kurserna språk specialisering - retorik 1[ab] eller språk specialisering - retorik 1[ab] ingå i elevens examen\. *$/)){
							course.notwithRAW = instr;
							instr = "";
						}
						if (instr.match(/^ *Kursen den unga hästens utveckling [12][ab]? får bara anordnas inom av Skolverket beviljad särskild variant med riksrekryterande yrkesutbildning för naturbruksprogrammet, inriktning djur\. *$/)){
							//course.descarr = course.descarr.replace(/Kursen Den unga hästens utveckling [12][ab]? får bara anordnas/,"Kursen får bara anordnas");
							course.onlynaturyrk = true;
							instr = "";
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
						course.code = match[1].replace(/ /g,"");
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
							var regdef = "> *"+course.origname+', *\\d{2,3} *poäng<\\/h2><div id="([A-ZÅÄÖa-zåäö0-9]*?)".*?>(.*?)(<\\/div><script|<a id="anchor)',
								regex = new RegExp(regdef,"i"),
								match = data.match(regex);
							course.code = match[1].replace(/ /g,"");
							console.log("Step 2 delete ?",!!data.match(regdef,""));
							data = data.replace(regdef,"");
							raw = match[2];
							if (!GLOBAL.codetosubjcourse[course.code]){
								GLOBAL.codetosubjcourse[course.code] = code+" --- "+course.origname;
							} else {
								console.log(code,"2:::",course.origname,"WANTS TO BE",course.code,"but that's already taken by",GLOBAL.codetosubjcourse[course.code]);
								throw "EEE";
							}
						} catch(e) {
							try {
								var raw = data.match(new RegExp("> *"+course.origname+", *\\d{2,3} *poäng<\\/a> *<\\/h3>(.*?)<\\/article","i") )[1];
								//var secraw = data.match(/courses-wrapper">(.*?)<\/section/)[1],
								//	raw = secraw.match(/<article>(.*?)<\/article>/)[1+i];
								course.code = raw.match(/Kurskod: *([^<]*)</)[1].replace(/ /g,"");
								if (!GLOBAL.codetosubjcourse[course.code]){
									GLOBAL.codetosubjcourse[course.code] = code+" --- "+course.origname;
								} else {
									console.log(code,"2:::",course.origname,"WANTS TO BE",course.code,"but that's already taken by",GLOBAL.codetosubjcourse[course.code]);
									throw "EEE";
								}
							} catch(e){
								console.log("Failed to read code and raw for course",type,code,course.origname,"REG:",regdef);
								throw e;
							}
						}
					}
					sub.courses.push(course.code);
					GLOBAL.gycourses.push(course.code);
					// fix thingimajig
					if (course.obsolete){
						GLOBAL.deadcoursenamestocode[course.origname] = course.code;
						GLOBAL.deadcoursenamestocode[course.name] = course.code;
					} else {
						GLOBAL.livecoursenamestocode[course.origname] = course.code;
					}

					// STEAL EVENTUAL COURSE COMMENTS FROM SUBJECT
					_.each([["CC-","","innehållet"],["KR-","E","kunskapskraven"]],function(a){
						var pre=a[0],suf=a[1],call=a[2], cid=pre+course.code+suf;
						if (sub.comments && sub.comments[cid]){
							if (!course.comments) course.comments={};
							course.comments[call] = sub.comments[cid];
							//console.log(course.code,"has comment",cid);
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
					try {
						var regdef, regex, match, goalstr;
						try {
							regdef = '<h2>Kurskod: '+course.code+' ?<\\/h2><p>(.*?)<\/p><h2';
							regex = new RegExp(regdef);
							match = raw.match(regex);
							goalstr = match[1].replace(/<\/?italic>/g,"").replace("Ämnets syfte i ämnet materialkunskap.","Ämnets syfte.").replace("1-­5","1-5");
						} catch(e) {
							try {
								regdef = '<strong>Kurskod: '+course.code+' *<\\/strong><\\/p> *<p>(.*?)<\\/p> *<h4';
								regex = new RegExp(regdef);
								raw = raw.replace(/<div class=["']docs-wrapper["'] *>(.*?)<\/div>/g,"");
								match = raw.match(regex);
								goalstr = match[1].replace(/<\/?italic>/g,"").replace("Ämnets syfte i ämnet materialkunskap.","Ämnets syfte.").replace("1-­5","1-5");
							} catch(e) {
								console.log("failed in new too",course.code,raw);
								throw e
							}
						}
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
						course.excludesgoals = _.contains(course.goals,0);
						course.focusesgoals = _.contains(course.goals,2);
						sub.someexcludes = sub.someexcludes || course.excludesgoals;
						sub.somefocuses = sub.somefocuses || course.focusesgoals;
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
						italic: [2,(/följande c?e?n?t?r?a?l?a? ?innehåll<\/i>\:? *<\/italic>\:? ?<\/p> *(<p> *<\/p>)?<ul> ?<li>(.*?)<\/li> ?<\/ul>/)],
						newthing: [2,(/Centralt innehåll<\/h4> *(<p><\/p>)? *<ul> *<li>(.*?)<\/li> *<\/ul>/)]
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
							italicmulti: [2,(/följande (centrala )?innehåll<\/i>\:? *\:? ?<\/p> *(.*?) *<p> *<\/p>  *<div class="clearer">/)],
							italicmultinew: [2,(/följande (centrala )?innehåll<\/i>\:? *\:? ?<\/p> *(.*?) *<p> *<\/p>  *<h4>/)]
						},function(a,name){
							if (!course.content){
								var match = raw.match(a[1]);
								if (match){
									try {
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
						var jraw;
						try {
						    jraw = raw.match(/Kunskapskrav *<\/h2> *(.*?) *<\/div>/)[1]	
						} catch(e) {
							try {
								jraw = raw.match(/Kunskapskrav *<\/h4> *(.*) *<\/div>/)[1];
							} catch(e) {
								console.log("Error fetching judgement parts for",course.name);
							}
						}
						jraw = jraw.replace(/<br\/> *(<br\/>)? *<\/p>/g,"</p>").replace(/<p> *(<br\/?>)? *<\/p>/g,"").replace(/<b> *<br\/?> *<\/b>/g,"").replace("<br/>","</p><p>").replace(/<p> *\.? *<\/p>/g,"").replace(/[a-zåäö]<b> /g," <b>").replace(/ <\/b>/g,"</b> ").replace(/<a [^>]*>.*?<\/a>/g,"").trim();
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
							"<b>Eleven utvärderar": /<b>Eleven<\/b> <b>utvärderar/g,
							" med ": " me "
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
							E: jraw.match(/<h4>Betyget E<\/h4> *<p>(.*?) *<\/p> *<h4>/)[1].split(/<\/p> *<p>/),//.map(splitJudgeList),
							C: jraw.match(/<h4>Betyget C<\/h4> *<p>(.*?) *<\/p> *<h4>/)[1].split(/<\/p> *<p>/),//.map(splitJudgeList),
							A: jraw.match(/<h4>Betyget A<\/h4> *<p>(.*?) *<\/p> *$/)[1].split(/<\/p> *<p>/),//.map(splitJudgeList)
						}
						if (course.code==="GRÄGRN0" && g.E.length===8 && g.C.length===7){
							g.E[6] = g.E[6]+" "+g.E[7];
							g.E.pop();
							console.log("fixar lite med GRÄGRN0 dårå")
						}
						if (!(g.E.length === g.C.length && g.C.length === g.A.length)){
							console.log("Different number of ps in ",course.name,course.code,g.E.length,g.C.length,g.A.length)
							if (course.code==="GRÄGRN0"){
								console.log(g.E);
							}
						}
						course.judge = g;
						if ({"RINRID02":1,"MEDMED02":1,"INULAB0":1,"HAVFIN05S":1,"FÖRENT0":1}[course.code]){
							course.judgechangewarn = true;
						};
					} catch(e){
						console.log("Error parsing judgement parts for",course.name);
						throw e;
					}

					// SAVE TO GLOBAL
					GLOBAL.courses[course.code] = course;
					GLOBAL.coursenames.push(course.name);
					GLOBAL.codetocode[course.code] = course.code;
					GLOBAL.coursetocode[course.name] = course.code;
					GLOBAL.lowercasecourses[course.name.toLowerCase()] = course.code;
					GLOBAL.coursecodes.push(course.code);
				}
			}
			// FINAL MANIP
			if (sub.code==="MOE"){
				sub.name = "Modersmål";
				console.log("--------------- CHANGED ----------------",sub.name);
			}
			// FINISH
			fs.writeFile("./subjects/"+code+".json",JSON.stringify(sub).replace(/"\,"/g,'",\n"'));
			GLOBAL.subjects[sub.code]=sub;
		});
	});
});


// SAMENAMES

/*_.each(GLOBAL.courses,function(def,cid){
	_.each(GLOBAL.courses,function(def2,cid2){
		if (cid!==cid2 && def.name === def2.name){
			def.samenamecoursecode = cid2;
			def.samenamesubjectcode = def2.subject;
			def.samenamesubjectname = GLOBAL.subjects[def2.subject].name;
			//console.log(def.name,def.code,def2.code);
		}
	});
});*/


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

// to check: TURHÅL0, AUOAVH0, PESPER00S

function courseList(str,code){
	var ret, t;
	str = str.trim();
	//if (t=str.match(/kursen (.*?) eller p?å? ?kurserna (.*?)/)){
	//	ret = {type:"OR",arr:[t[1],{type:"AND",arr:_.difference(t[2].replace("kursen ","").split(/, | (och|samt) /),[undefined,"kursen "])}]};
	//} else
	if (str.match("I ett och samma språk kan endast")){
		ret = {type:"LINK",target:{SPAXXX01a:"SPAXXX01b",SPAXXX01b:"SPAXXX01a"}[code],comment:"i samma språk"};
	} else if (t=str.match(/någon av kurserna [^\.]*? eller [^\.]* samt [^\.]*/)){
		ret = {type:"OR",arr:str.replace(/^ *någon av kurserna /,"").split(/, | samt | eller /)};
	} else if ((t=str.split(/eller på/)).length===2){
		ret = {type:"OR",arr:[courseList(t[0],code),courseList("på "+t[1].trim(),code)]}
	} else if (t=str.match(/någon av kurserna [^\.]*? eller/)){
		ret = {type:"OR",arr:str.replace(/^ *någon av kurserna /,"").split(/, | eller /)};
	} else if (t=str.match(/någon av kurserna [^\.]*? samt/)){
		ret = {type:"OR",arr:str.replace(/^ *någon av kurserna /,"").split(/, | samt /)};
	} else if (t=str.match(/beroende på valt kunskapsområde bygger på kursen [^\.]*? eller/)) {
		ret = {type:"OR",arr:str.replace(/^ *beroende på valt kunskapsområde bygger på kursen /,"").split(/, | eller /)};
	} else if (!str.match(/eller/) && str.match(/^p?å? ?(någon av )?(kurser?na? )?[^\.]*? (och|samt)/)){
		ret = {type:"AND",arr:str.replace(/^p?å? ?(någon av )?(kurser?na? )?/,"").split(/, | och | samt /)};
	} else if (str.match(/^kursen [^]* eller på .*? (samt|och)/)){
		ret = {type:"OR",arr: [str.split(" eller på ")[0],{type:"AND",arr:str.split(" eller på ")[1].split(/, | samt | och /)}]}
	} else if (str.match(/^ *kursen/)&&str.match(/eller/)){
		ret = {type:"OR",arr:_.difference(str.replace(/^ *kursen */,"").split(/, *(kursen *)?| *eller *(kursen *)?/g),[undefined,"kursen ",""," ",null])};
		ret.arr[ret.arr.length-1] = courseList(ret.arr[ret.arr.length-1],code);
	} else if (str.match(" samt ")){
		ret = {type:"AND",arr:str.split(/, | samt /)};
	} else if (str.match(" och ")){
		ret = {type:"AND",arr: _.difference(str.replace(/^ *kursen */,"").split(/, *(kursen *)?| *och *(kursen *)?/g),[undefined,"kursen ",""," ",null])};
	} else {
		ret = str.trim().replace(/^p?å? ?kursen /,"");//.replace(/ med innehåll från vald profil$/,"");
		var potcode = ret.split(" ")[0];
		if (GLOBAL.codetocode[potcode] && ret.match(/ med (innehåll|inriktning)/)){
			ret = {type:"LINK",target:potcode,comment:ret.replace(potcode+" ","")};
		} else {
			ret = fixStr(str,code);
		}
	}
	if (ret.arr){
		ret.arr = _.map(ret.arr,function(s){return fixStr(s,code)});
	}
	return ret;
}

var okTexts = {
	"grundskolans kunskaper eller motsvarande":1,
	"de kunskaper grundskolan ger eller motsvarande":1,
	"moderna språk inom ramen för elevens val i grundskolan":1,
	"moderna språk inom ramen för språkval i grundskolan":1,
	"kinesiska inom ramen för elevens val i grundskolan":1,
	"kinesiska inom ramen för språkval i grundskolan":1,
	"som bygger på minst 800 poäng av yrkesprogrammets karaktärsämnen":1,
	"specialskolans kunskaper eller motsvarande":1,
	"de kunskaper specialskolan ger eller motsvarande":1,
	"svenskt teckenspråk för hörande inom ramen för elevens val i grundskolan":1,
	"svenskt teckenspråk för hörande inom ramen för språkval i grundskolan":1
};

function fixStr(s,code){
	if (typeof s !== "string"){return s;}
	s = s.trim();
	if (s.match(/^ *på kurserna /)){ return courseList(s.replace(/^ *på */,"någon av kurserna "),code) }
	if (s.match(/(kursen )?[Pp]sykologi 2/)){ return {type:"OR",arr:["PSKPSY02a","PSKPSY02b"]} }
	if (s.match(/(kursen )?[Hh]istoria 2/)){ return {type:"OR",arr:["HISHIS02a","HISHIS02b"]} }
	s = s.trim().replace(/^p?å? ?kursen */,"");
	//return (n && c[0].match(/^\d/) ? list[0].split(/ \d/)[0]+" "+c : c).trim().replace("kursen ","");
	if (!GLOBAL.codetocode[s] && !okTexts[s] && !GLOBAL.lowercasecourses[s]){
		console.log(code,"Waaat?",s);
	}
	return s;
}

function harvestFiles(o){
	if (typeof o === "string" && GLOBAL.codetocode[o]){
		return [o];
	} else if (typeof o === "string" && GLOBAL.lowercasecourses[o]) {
		return [GLOBAL.lowercasecourses[o]];
	} else if (o.target){
		return [o.target];
	} else if (o.arr){
		return _.flatten(_.compact((_.map(o.arr,harvestFiles))));
	} else {
		return [];
	}
}

var names = _.keys(GLOBAL.coursetocode)
	.map(function(s){return s.replace(" [ej aktuell]","")})
	.sort(function(s,t){return s.length>t.length?-1:s.length<t.length?1:s>t?1:-1;})
	//.filter(function(n){ return !n.match(" [ej aktuell]"); });

_.each(GLOBAL.courses,function(course,code){
	if (!course.obsolete && GLOBAL.deadcoursenamestocode[course.name]){
		course.replaces = GLOBAL.deadcoursenamestocode[course.name];
	} else if (course.obsolete && GLOBAL.livecoursenamestocode[course.name]){
		course.replacedby = GLOBAL.livecoursenamestocode[course.name];
	}
	//betterbehaved
	_.each(["descarr","reqRAW","notwithRAW","alsoreqRAW"],function(prop){
		if (course[prop]){
			_.each(names,function(name,namenum){
				name = name.replace(" [ej aktuell]","");
				var repcid = (course.obsolete && GLOBAL.deadcoursenamestocode[name]) || GLOBAL.livecoursenamestocode[name] || GLOBAL.deadcoursenamestocode[name], //  GLOBAL.coursetocode[name],
					repcourse = GLOBAL.courses[repcid],
					debug = false && code === "DAODIG0" && {NAINAR0:1,DAODAC0:1}[repcid];
				if (!repcourse){
					console.log("ALARM! dealing with course",course.name,prop,"with code",code,"trying to find match for",name,"which should be",repcid);
					console.log(course.prop);
				}
				if (!(code.match("HÄTDEN0")&&name.toLowerCase()==="naturbruk") && 
					!(name.toLowerCase()==="form" && !course.name.match("Bild"))
				) {
					if (course[prop].match(" "+name) && repcourse.obsolete && !course.obsolete){
						console.log("ALAAARM! Live course",course.name,course.code,"requiring dead",repcourse.name,repcid,", name was",name,"which in live returns",GLOBAL.livecoursenamestocode[name]);
						throw "FOO";
					}
					debug && console.log("Replacing in course",code,prop,"which was",course[prop],"looking for ",name,repcid,namenum);
					course[prop] = course[prop].replace(new RegExp(" "+name,"i")," "+repcid);
					debug && console.log("Afterwards we now have",course[prop]);
				    //course[prop] = course[prop].replace(" "+name.toLowerCase().replace("vvs","VVS")," "+(GLOBAL.coursetocode[name]));//repcid)); // GLOBAL.coursetocode[name]));
				}
			});
			if (prop !== "descarr") course[prop.replace("RAW","")] = courseList(course[prop],code);
		}
	});
	if (course.descarr){
		_.each(course.descarr.split(/[^A-Za-zÅÄÖåäö\-_0-9]/g),function(part){
			if (GLOBAL.courses[part]){
				course.descarr = course.descarr.replace(part,"___"+part+"___")
			}
			if (code==="VÅRVÅR02"){
				console.log("AIE AIE AIE",part,Object.keys(GLOBAL.courses[part]||{}));
			}
		});
		course.descarr = course.descarr.replace(/^som /,"Den ").split("___");
	};
	if (course.alsoreq){
		course.req = {type:"AND",arr:[course.req,course.alsoreq]};
		delete course.alsoreq;
	}
	if (course.req){
		course.reqarr = [];
		var mine = harvestFiles(course.req);
		_.each(_.uniq(mine),function(cid){
			if (!GLOBAL.courses[cid]){
				console.log("NO COURSE FOR",cid,GLOBAL.lowercasecourses[cid]);
				throw "FOO";
			}
			if (!GLOBAL.courses[cid].reqBy){GLOBAL.courses[cid].reqBy = [];}
			GLOBAL.courses[cid].reqBy = (GLOBAL.courses[cid].reqBy||[]).concat([code]);
			course.reqarr.push(cid);
		});
	}
	if (course.notwith){
		course.notwitharr = harvestFiles(course.notwith);
	}
});

// course selection
//var dividers = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","R","S","T","U","V","W"];
var dividers = ["A-C","D-E","F-G","H-J","K-L","M-N","O-R","S","T-Ö"];
var dict = {};

// check notwithstuff
_.each(GLOBAL.courses,function(course,code){
	if (course.notwitharr){
		course.notwitharr.forEach(function(othercid){
			var othercourse = GLOBAL.courses[othercid];
			if (!othercourse.notwitharr || !_.contains(othercourse.notwitharr,code)){
				console.log("WHAT THE HECK",code,"cannot join",othercid,"but that course lacks same warning!");
				othercourse.notwitharr = (othercourse.notwitharr||[]).concat(code);
				othercourse.remotenotwitharr = (othercourse.remotenotwitharr||[]).concat(code);
			}
		});
	}
});

_.each(GLOBAL.courses,function(course,code){
	var name = course.name;
	var cat = _.contains(["Å","Ä","Ö"],name[0]) ? dividers[dividers.length-1] : _.find(dividers,function(l,n){
		return name > l && n===dividers.length-1 || name < dividers[n+1];
	});
	if (!cat){
		console.log("No category for",name,code);
	} else {
		dict[cat] = (dict[cat]||[]).concat(code);
	}
	// find foreing reqs
	var foreign = (course.reqarr||[]).concat(course.reqBy||[]).concat(course.notwitharr||[]).filter(function(cid){
		var other = GLOBAL.courses[cid];
		return other.subject !== course.subject && !(other.obsolete && !course.obsolete);
	});
	if (foreign.length){
		var sub = GLOBAL.subjects[course.subject];
		course.foreignlinks = foreign;
		sub.foreignlinks = _.uniq((sub.foreignlinks||[]).concat(foreign));
	}
});

_.each(GLOBAL.subjects,function(subject,code){
	var type = subject.type;
	if (type){ // means gymnasiekurs
		if (subject.obsolete){
			type = "obsolete";
		} else if (type==="VOCATIONAL"){
			type = subject.name < "H" ? "VOCa-g" : subject.name < "P" ? "VOCh-o" : "VOCp-ö";
		}
		if (!GLOBAL["subjects"+type]){
			GLOBAL["subjects"+type]=[];
		}
		GLOBAL["subjects"+type].push(code);
	}
});

_.each(_.without(fs.readdirSync("./grundcourses/"),".DS_Store"),function(path){
	fs.readFileS("./grundcourses/"+path,function(err,data){
		var course = JSON.parse(data.toString());
		GLOBAL.courses[course.code] = course;
		GLOBAL.grundcourses.push(course.code);
	});
});

_.each(_.without(fs.readdirSync("./grundsubjects/"),".DS_Store"),function(path){
	fs.readFileS("./grundsubjects/"+path,function(err,data){
		var subject = JSON.parse(data.toString());
		GLOBAL.subjects[subject.code] = subject;
		GLOBAL.grundsubjects.push(subject.code);
	});
});



_.each(_.without(fs.readdirSync("./grundvuxcourses/"),".DS_Store"),function(path){
	fs.readFileS("./grundvuxcourses/"+path,function(err,data){
		var course = JSON.parse(data.toString());
		GLOBAL.courses[course.code] = course;
		GLOBAL.grundvuxcourses.push(course.code);
	});
});

_.each(_.without(fs.readdirSync("./grundvuxsubjects/"),".DS_Store"),function(path){
	fs.readFileS("./grundvuxsubjects/"+path,function(err,data){
		var subject = JSON.parse(data.toString());
		GLOBAL.subjects[subject.code] = subject;
		GLOBAL.grundvuxsubjects.push(subject.code);
	});
});


// SORT SUBJECTS
_.each(["subjectsOTHER","subjectsVOCa-g","subjectsVOCh-o","subjectsVOCp-ö","grundsubjects","grundvuxsubjects","subjectsobsolete"],function(key){
	GLOBAL[key] = GLOBAL[key].sort(function(s1,s2){
		return GLOBAL.subjects[s1].name > GLOBAL.subjects[s2].name ? 1 : -1;
	});
});



_.each(dividers,function(l){
	//console.log("Letter",l,"has",(dict[l]||[]).length,"courses");
	dict[l] = dict[l].sort(function(a,b){
		return GLOBAL.courses[a].name > GLOBAL.courses[b].name ? 1 : -1;
	});
});
//console.log(dict);
GLOBAL.coursedict = dict;



var friends = [
	["GRGRBIL01","BIL"],
	["GRGRBIO01","BIO","GRNBIO2"],
	["GRGRENG01","ENG","GRNENG2"],
	["GRGRFYS01","FYS"],
	["GRGRGEO01","GEO"],
	["GRGRHIS01","HIS","GRNHIS2"],
	["GRGRIDR01","IDR"],
	["GRGRKEM01","KEM","GRNKEM2"],
	["GRGRMAT01","MAT","GRNMAT2"],
	["GRGRMSP01","MOD"],
	["GRGRMUS01","MUS"],
	["GRGRREL01","REL","GRNREL2"],
	["GRGRSAM01","SAM","GRNSAM2"],
	["GRGRSVA01","GRGRSVE01","SVA","SVE","GRNSVA2","GRNSVE2"],
	["GRGRTEK01","TEK"],
	["GRGRTSP01","SVK"], // teckenspråk
	["GRGRMOD01","MOE"], // modersmål
	["GRNHEM2","GRGRHKK01"], // hem- & konsumentkunskap
	["LAT","KLA"], // latin och grekiska
	["TES","TEY"], // tekniska system el och vvs
	["GER","GRU","ITI","PEA","TEN","VÅR","VAD","SJU"], // vårdämnen
	["SAE","SAI","SAS"], // samerna
	["HUM","HUA"], // weird humaniststuff
	["NAE","NAV"], // same weird but for natur
	["DAK","DAG"], // danskurser
	["BIL","BID"] // bildkurser
];

friends = _.reduce(splitinto,function(mem,newcodes,oldcode){
	mem.push([oldcode].concat(newcodes));
	return mem;
},friends);

friends = _.reduce(replacedby,function(mem,newcode,oldcode){
	mem.push([newcode,oldcode]);
	return mem;
},friends);

_.each(friends,function(rel){
	_.each(rel,function(sid){
		if (!GLOBAL.subjects[sid]){
			console.log("SUBJECT ERROR",sid,"WAH");
		}
		GLOBAL.subjects[sid].friends = _.without(rel,sid);
	});
});

// add all subjects connected through förkunskapskrav! :D
_.each(GLOBAL.subjects,function(subject,sid){
	subject.friends = subject.friends || [];
	_.each(subject.courses,function(cid){
		var course = GLOBAL.courses[cid];
		_.each((course.reqarr||[]).concat(course.reqBy||[]).concat(course.notwitharr||[]),function(othercid){
			subject.hasreqs = true;
			course.hasreqs = true;
			var othercourse = GLOBAL.courses[othercid];
			othercourse.hasreqs = true;
			if (othercourse.subject !== sid){
				subject.friends.push(othercourse.subject);
				GLOBAL.subjects[othercourse.subject].hasreqs = true;
			}
		});
	});
	subject.friends = _.uniq(subject.friends);
});


_.each(GLOBAL.courses,function(course,code){
	var subject = GLOBAL.subjects[course.subject];
	course.friends = _.without(subject.courses,code).concat(course.reqarr||[]).concat(course.reqBy||[]);
	_.each(subject.friends||[],function(friend){
		course.friends = course.friends.concat(GLOBAL.subjects[friend].courses);
	});
	/*if (course.samenamecoursecode){
		course.friends.push(course.samenamecoursecode);
	}*/
	course.friends = _.uniq(course.friends);
	course.friends.sort(function(c1,c2){
		return GLOBAL.courses[c1].name > GLOBAL.courses[c2].name ? 1 : -1;
	});
});

GLOBAL.plans={};
_.each(["grund","vux","gymn"],function(level){
	fs.readFileS("../markdown/"+level+".html",function(err,data){
		var split = data.toString().split(/<h1.*?<\/h1>/g),
			mission = split[1],
			goals = split[2].split("<script>")[0];
		GLOBAL.plans[level]={mission:mission,goals:goals};
		console.log(level,mission.length,goals.length);
	});
});




_.each(GLOBAL.courses,function(course,code){
	fs.writeFile("./courses/"+course.code+".json",JSON.stringify(course).replace(/\,"/g,',\n"').replace("��","å"));
});
GLOBAL.coursenames = GLOBAL.coursenames.sort();
fs.writeFile("./master.json",JSON.stringify(GLOBAL));

