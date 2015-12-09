var fs = require('fs'),
	_ = require('lodash'),
	download = require('./download');

var found = {};

function cleanText(buffer){
	var ret = buffer.toString().replace(/<\!--.*?-->/g,"").replace(/[\n\t\r\f]/g,"").replace(/[\n\t\r\f]/g,"").replace(/ {2}/g," ").replace("TIG-svetsning rår","TIG-svetsning rör").replace(/[a-zåäö] *<br\/?> *[a-zåäö]/g,"").replace(/[-–]|&mdash;/g,"-");
	_.each({
		"0,4-24kV": /0\,4\-24 kV/g
	},function(regex,replace){ ret = ret.replace(regex,replace); });
	return ret;
};


var specialurls = {
	COMMON: {
		"FÖR": "http://www.skolverket.se/laroplaner-amnen-och-kurser/gymnasieutbildning/gymnasieskola/foer?tos=gy&subjectCode=F%C3%96R&lang=sv",
	},
	OTHER: {
		"HÅL": "http://www.skolverket.se/laroplaner-amnen-och-kurser/gymnasieutbildning/gymnasieskola/haal?tos=gy&subjectCode=H%C3%85L&lang=sv",
		"MÄK": "http://www.skolverket.se/laroplaner-amnen-och-kurser/gymnasieutbildning/gymnasieskola/maek?tos=gy&subjectCode=M%C3%84K&lang=sv"
	},
	VOCATIONAL: {
		"FÖS": "http://www.skolverket.se/laroplaner-amnen-och-kurser/gymnasieutbildning/gymnasieskola/foes?tos=gy&subjectCode=F%C3%96S&lang=sv",
		"MÄI": "http://www.skolverket.se/laroplaner-amnen-och-kurser/gymnasieutbildning/gymnasieskola/maei?tos=gy&subjectCode=M%C3%84I&lang=sv",
		"MÄN": "http://www.skolverket.se/laroplaner-amnen-och-kurser/gymnasieutbildning/gymnasieskola/maen?tos=gy&subjectCode=M%C3%84N&lang=sv",
		"MÅT": "http://www.skolverket.se/laroplaner-amnen-och-kurser/gymnasieutbildning/gymnasieskola/maat?tos=gy&subjectCode=M%C3%85T&lang=sv",
		"VÅR": "http://www.skolverket.se/laroplaner-amnen-och-kurser/gymnasieutbildning/gymnasieskola/vaar?tos=gy&subjectCode=V%C3%85R&lang=sv"
	}
};

function downloadCourse(type,name,code,urlcode,desperation){
	var path = [
		"http://www.skolverket.se/laroplaner-amnen-och-kurser/vuxenutbildning/komvux/gymnasial/sok-amnen-och-kurser/subject.htm?subjectCode="+urlcode+"&lang=sv&tos=gy",
		"http://www.skolverket.se/laroplaner-amnen-och-kurser/gymnasieutbildning/gymnasieskola/"+urlcode.toLowerCase()+"?"+"tos=gy&subjectCode="+code+"&lang=sv",
		"http://www.skolverket.se/laroplaner-amnen-och-kurser/vuxenutbildning/komvux/gymnasial/sok-amnen-och-kurser/subject.htm?subjectCode="+encodeURIComponent(code)+"&lang=sv&tos=gy"
	][desperation || 0] || specialurls[type][code];
	if (!path){
		console.log("...............No luck at all for",type,code,name,"......................");
	} else {
		download(path,function(data){
			if (!data || !data.length || data.match("Tyvärr kan vi inte hitta sidan du söker") || data.match("Ett fel har uppstått") || data.match("Ämnet eller kursen som efterfrågades kunde inte hittas")){
				downloadCourse(type,name,code,urlcode,desperation+1);
			} else if (data.match("Innehållet är för närvarande inte tillgängligt. Var god försök senare")){
				setTimeout(function(){
					console.log("New attempt for",name,"after unavailability");
					downloadCourse(type,name,code,urlcode,desperation);
				},1000);
			} else {
				console.log("Finished",name,"at desperation",desperation);
				data = data.toString().replace(/fram��t/g,"").replace(/[\n\t\r\f]/g,"").replace(/<div class="docs-wrapper">.*?<\/div>/g,"").replace("TIG-svetsning rår","TIG-svetsning rör").replace(/[a-zåäö] *<br\/?> *[a-zåäö]/g,"").replace(/[-–]|&mdash;/g,"-").replace("synen p�� männis","synen på männis").replace("H��lsopedagogik","Hälsopedagogik").replace("utvärderar med<br/>","utvärderar med").replace("I<br/>utvärderingen","I utvärderingen").replace(/\b/,"").replace(/[\x00-\x1F\x7F-\x9F]/g, "").replace("på kursen på kursen","på kursen").replace("��ven ","även ").replace("samr��d","samråd").replace("Fr��n","Från").replace("omr��den","områden").replace("s�� att","så att").replace("dialog lärare���elev","dialog lärare-elev").replace("Modersm��l","Modersmål").replace("po��ng","poäng").replace("inneh��ller","innehåller").replace("f��ljande","följande").replace("spr��k","språk").replace(/<!-- FW_SEARCH_INDEX_END -->/g,"").replace(/<!-- FW_SEARCH_INDEX_BEGIN -->/g,"").replace(/[Nn]ätunderhållsarbete på luftledningsnät 0,4([—-]|&mdash;)24 ?kV/g,"Nätunderhållsarbete på luftledningsnät 0,4–24kV").replace("bygger p�� kursen","bygger på kursen").replace(/<\/?italic>/g,"").replace("Kurser i ��mnet","Kurser i ämnet").replace("centrala inneh��ll","centrala innehåll").replace("mobila milj��er","mobila miljöer").replace("f��r vanliga","för vanliga").replace("r��r publicering","rör publicering").replace(/Mobila applikationer, 100 *poäng/g,"Mobila applikationer 1, 100 poäng").replace("v��xternas biologi","växternas biologi").replace("hj��lp","hjälp").replace("terr��ngtransport","terrängtransport").replace(/<header>.*?<\/header>/g,"").replace("inneh��ll","innehåll").replace("inneb��r","innebär").replace(/<i><i>/g,"<i>").replace(/<\/i><\/i>/g,"</i>").replace(/ {2}/g," ");
				fs.writeFile("subjects/"+type+"/"+code+"_"+name+".html",data);
			}
		});
	}
}

var extras = {
	COMMON: {},
	VOCATIONAL: {
		N: [
			'subject.htm?subjectCode=NÄV&amp;lang=sv&amp;tos=gy">Nätverksteknik'
		],
		G: [
			'subject.htm?subjectCode=GYN&amp;lang=sv&amp;tos=gy">Gymnasieingenjören i praktiken'
		],
		P: [
			'subject.htm?subjectCode=PRI&amp;lang=sv&amp;tos=gy">Produktionsfilosofi'
		]
	},
	OTHER: {
		D: [
			'subject.htm?subjectCode=DAL&amp;lang=sv&amp;tos=gy">Datalagring'
		],
		M: [
			'subject.htm?subjectCode=MJK&amp;lang=sv&amp;tos=gy">Mjukvarudesign'
		]
	}
};

_.each(["OTHER","VOCATIONAL","COMMON"],function(type){
	_.each(["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","Å","Ä","Ö"],function(l){
		fs.readFile("./letters/"+type+"/"+l+".html",function(err,data){
			if (err){
				console.log("ERROR for",type,l,err);
				throw "BARGHS"
			}
			var match = (data.toString()+" "+(extras[type][l]||[]).join(" ")).match(/subject\.htm\?subjectCode=([A-ZÅÄÖ]{3}|[A-Z%0-9]{8})&amp;lang=sv&amp;tos\=gy\"\>([^<]*)/g);
			_.each(match||[],function(str){
				//console.log("MATCHLOOKSLIKE",str);
				var urlcode = str.match(/subjectCode=([A-ZÅÄÖ]{3}|[A-Z%0-9]{8})/)[1],
					name = str.match(/>(.*)$/)[1],
					code = urlcode.replace("%C3%84","Ä").replace("%C3%85","Å").replace("%C3%B6","Ö").replace("%C3%96","Ö");
				if (!found[code]){
					found[code] = name;
					downloadCourse(type,name,code,urlcode,0);
					return;
				}
			});
		});
	});
});
