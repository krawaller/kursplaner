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

function downloadCourse(type,name,code,urlcode,desperation){
	if (desperation===3){
		var f = fs.readFileSync('./manual/'+type+'/'+code+".html"),
			d = cleanText(f && f.toString() || "");
		if (d.length){
			fs.writeFile("subjects/"+type+"/"+code+"_"+name+".html",d);
			console.log("Ok, found manual backup for",type,code,name);
		} else {
			console.log("...............No luck at all for",type,code,name,"......................");
		}
	} else {
		var path = [
			"http://www.skolverket.se/laroplaner-amnen-och-kurser/vuxenutbildning/komvux/gymnasial/sok-amnen-och-kurser/subject.htm?subjectCode="+urlcode+"&lang=sv&tos=gy",
			"http://www.skolverket.se/laroplaner-amnen-och-kurser/gymnasieutbildning/gymnasieskola/"+urlcode.toLowerCase()+"?"+"tos=gy&subjectCode="+code+"&lang=sv",
			"http://www.skolverket.se/laroplaner-amnen-och-kurser/vuxenutbildning/komvux/gymnasial/sok-amnen-och-kurser/subject.htm?subjectCode="+encodeURIComponent(code)+"&lang=sv&tos=gy"
		][desperation || 0];
		download(path,function(data){
			if (!data || !data.length || data.match("Tyvärr kan vi inte hitta sidan du söker" || data.match("Ämnet eller kursen som efterfrågades kunde inte hittas"))){
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

_.each(["OTHER","VOCATIONAL","COMMON"],function(type){
	_.each(["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","Å","Ä","Ö"],function(l){
		fs.readFile("./letters/"+type+"/"+l+".html",function(err,data){
			if (err){
				console.log("ERROR for",type,l,err);
				throw "BARGHS"
			}
			var match = data.toString().match(/subject\.htm\?subjectCode=([A-ZÅÄÖ]{3}|[A-Z%0-9]{8})&amp;lang=sv&amp;tos\=gy\"\>([^<]*)/g);
			_.each(match||[],function(str){
				var urlcode = str.match(/subjectCode=([A-ZÅÄÖ]{3}|[A-Z%0-9]{8})/)[1],
					name = str.match(/>(.*)$/)[1],
					code = urlcode.replace("%C3%84","Ä").replace("%C3%85","Å").replace("%C3%B6","Ö").replace("%C3%96","Ö");
				if (!found[code]){
					found[code] = name;
					downloadCourse(type,name,code,urlcode,0);
					return;

					var path = "http://www.skolverket.se/laroplaner-amnen-och-kurser/vuxenutbildning/komvux/gymnasial/sok-amnen-och-kurser/subject.htm?subjectCode="+urlcode+"&lang=sv&tos=gy";
					download(path,function(data){
						data = cleanText(data);
						if (data.length && !data.match("Tyvärr kan vi inte hitta sidan du söker")){
							fs.writeFile("subjects/"+type+"/"+code+"_"+name+".html",data);
							console.log("saved type",type,"letter",l,"subject",code,name)
						} else {
							var path = "http://www.skolverket.se/laroplaner-amnen-och-kurser/gymnasieutbildning/gymnasieskola/"+urlcode.toLowerCase()+"?"+"tos=gy&subjectCode="+code+"&lang=sv";
							download(path,function(data){
								data = cleanText(data);
								if (data.length  && !data.match("Tyvärr kan vi inte hitta sidan du söker")){
									fs.writeFile("subjects/"+type+"/"+code+"_"+name+".html",data);
									console.log("second chance saved type",type,"letter",l,"subject",code,name)
								} else {
									var path = "http://www.skolverket.se/laroplaner-amnen-och-kurser/vuxenutbildning/komvux/gymnasial/sok-amnen-och-kurser/subject.htm?subjectCode="+encodeURIComponent(code)+"&lang=sv&tos=gy";
									download(path,function(data){
										data = cleanText(data);
										if (data.length && !data.match("Tyvärr kan vi inte hitta sidan du söker")){
											fs.writeFile("subjects/"+type+"/"+code+"_"+name+".html",data);
											console.log("third chance saved type",type,"letter",l,"subject",code,name)
										} else {
											var f = fs.readFileSync('./manual/'+type+'/'+code+".html"),
												d = cleanText(f && f.toString() || "");
											if (d.length){
												fs.writeFile("subjects/"+type+"/"+code+"_"+name+".html",d);
												console.log("Ok, found manual backup for",type,l,code,name);
											} else {
												console.log(".....No luck at all for",type,l,code,name);
											}
										}
									})
								}
							});
						}
					});
				}
			});
		});
	});
});

/*
ATV ATV- och MC-teknik
ADM Administration
AFF Affärskommunikation
AKT Aktiviteter och värdskap
ANI Animation
ANL Anläggning
ANA Anläggningsförare
ARK Arkitektur
AUT Automationsteknik
AUO Automatiserade system
BEV Brand, bevakning och säkerhet
CIR Cirkus
DRI Driftsäkerhet och underhåll
ELR Elektroteknik
FLY Flygyrkesteknik
HAN Handel
JUR Juridik
MAS Maskin- och lastbilsteknik
MUI Musikteori
NAB Naturbruksteknik
PED Pedagogik
SER Serveringskunskap
SJU Sjukvård
SKM Skogsmaskiner
TUR Turism
BAG Bageri- och konditorikunskap
BEL Beläggning
BER Berghantering
BET Betong
BIL Bild
BID Bildteori
BIN Biodling
BIO Biologi
BII Biologi i vattenmiljöer
BIG Biologi – naturbruk
BYG Bygg och anläggning
BYL Byggproduktionsledning
BAT Båtkunskap
DRY Dryckeskunskap
ELD Eldistributionsteknik
ELT Elektroniksystem
ELO Elektroniksystem – installation och underhåll
FRI Fritids- och friskvårdsverksamheter
FRD Fritidsbåtteknik
HAA Hälsovård
INS Installationsteknik
LAC Lackeringsteknik
LAR Larm och säkerhetsteknik
MAI Marin el och elektronik
MOB Mobila arbetsmaskiner
MUS Musik
NAR Naturbrukets byggnader
PER Personbilsteknik
PLT Plåtslageriteknik
SAH Samhällsbyggande
TEI Teknisk isolering
CAD Cad
CHA Charkuterikunskap
DAR Datorstyrd produktion
STY Stycknings- och charkuterikunskap
DAN Dansgestaltning
DAG Dansgestaltning för yrkesdansare
DAS Dansorientering
DAT Dansteknik
DAK Dansteknik för yrkesdansare
DAE Dansteori
DAL Datalagring
DAO Dator- och kommunikationsteknik
DAI Datoriserad mönsterhantering
DES Design
DIG Digitalt skapande
DJU Djur
DJR Djurvård inom djurens hälso- och sjukvård
DAC Däckstjänst
INO Informationsteknisk arkitektur och infrastruktur
MAN Marinmotorteknik
PEG Pedagogiskt arbete
SPF Spårfordonsteknik
TEA Teater
VAT Vatten- och miljöteknik
VAE Vattenkraftteknik
VER El- och verkstadsteknik
ELE Elektronik
ELK Elektronikproduktion
ELM Elementmontering
ELL Ellära
ELI Elmotordrivsystem
ELP Elprojektering
ENE Energiteknik
ENG Engelska
ENL Engelska för döva
ENT Entreprenörskap
EST Estetisk kommunikation
EUR Eurytmi
EVE Eventteknik
HAL Hälsa
KON Konferens och evenemang
MEI Medicinsk teknik
SOI Sociologi
VVI VVS – installation
VVS VVS-teknik
FAR Fartygsteknik
FAI Fastighetsautomation
FAF Fastighetsförvaltning
FAS Fastighetsservice
FIL Film- och tv-produktion
FIO Filosofi
FIS Fiske
FIK Fiskevård
FLG Flygplatsteknik
FOH Fordon och redskap inom naturbruk
FOR Fordons- och transportbranschen
FOD Fordonsteknik
FOO Fordonstestteknik
FOM Formgivning
FOT Fotografisk bild
FRT Fritids- och idrottskunskap
FYS Fysik
HAV Hantverk
HOT Hotell
KOS Konst och kultur
LJU Ljudproduktion
SKO Skog, mark och vatten
STC Styckningskunskap
TRA Transportteknik
VAN Vattenbruk
GEO Geografi
GER Gerontologi och geriatrik
GOD Godshantering
GOS Godstransporter
GOL Golvläggning
GRA Grafisk kommunikation
GRF Grafisk produktion
GRU Grundläggande vård och omsorg
GYM Gymnasieingenjören i praktiken
NAG Naturguidning
SJO Sjöfartssäkerhet
HVK Hantverkskunskap
HIO Hippologi
HIS Historia
HJU Hjulutrustningsteknik
HUM Humanistisk och samhällsvetenskaplig specialisering
HUA Humanistisk och samhällsvetenskaplig spets inom försöksverksamhet med riksrekryterande gymnasial spetsutbildning
HUN Hundkunskap
HUS Husbyggnad
HUB Husbyggnad – specialyrken
HYG Hygienkunskap
RES Reseproduktion och marknadsföring
IDR Idrott och hälsa
INR Industriautomation
INV Industrirör svets VVS
IND Industrirörteknik
PRF Industriteknisk fördjupning
INU Industritekniska processer
INF Information och kommunikation
INK Inköp och logistik
INT Installationsteknik VVS
ITI It i vård och omsorg
PRU Produktionsutrustning
PRR Programmering
SAM Samhällskunskap
SPE Specialidrott
SYS Systemkunskap
MEE Mediekommunikation
KAR Karosseriteknik
KEM Kemi
KLA Klassisk grekiska – språk och kultur
KOH Konsthantverk
KOT Konstruktion
KRA Kraft- och värmeteknik
KYL Kyl- och värmepumpsteknik
MOD Moderna språk
RID Rid- och körkunskap
RIN Ridning och körning
SAA Sammanfogningsteknik
SUP Support och servicearbete
NAT Natur- och landskapsvård
NAU Naturbruk
NAK Naturkunskap
NAV Naturvetenskaplig specialisering
NAE Naturvetenskaplig spets inom försöksverksamhet med riksrekryterande gymnasial spetsutbildning
ODL Odling
ODI Odling i växthus
VAO Växtodling
MNU Manuell mönsterkonstruktion
MAY Marina elektroniksystem
MAK Maskintjänst
MAA Massage
MAO Mat och butik
MAC Mat och dryck i kombination
MAT Matematik
MAE Materialkunskap
MAL Matlagningskunskap
MED Medicin
MEP Medieproduktion
MER Medier, samhälle och kommunikation
MEK Mekatronik
MJU Mjukvarudesign
MOE Modersmål
MOT Motor- och röjmotorsåg
MUR Mur- och putsverk
MAR Måleri
LAG Lager och terminal
PEA Pedagogik i vård och omsorg
PES Persontransporter
PRO Processautomation
PRT Produktionsfilosofi
PRD Produktionskunskap
PRK Produktutveckling
PSY Psykiatri
PSK Psykologi
SNO Snöfordonsteknik
REC Reception
REL Religionskunskap
REN Rennäring
SVE Svenska
SAE Samernas kultur och historia
SAS Samisk mat och matkultur
SAI Samiskt hantverk
SEV Service och bemötande
SEI Serviceteknik – naturbruk
SKG Skogsproduktion
SOC Socialt arbete
SPC Specialpedagogik
SPA Språk specialisering
SVN Svenska för döva
SVA Svenska som andraspråk
SVK Svenskt teckenspråk
SVT Svenskt teckenspråk för hörande
TEK Teknik
TEN Teknik i vård och omsorg
TIL Tillverkningsunderlag
TRV Travkunskap
TRD Trädgårdsanläggning
TRS Trädgårdsmaskiner
TRR Trädgårdsodling
TRN Träningslära
UTS Utställningsdesign
VEN Ventilationsplåtslageri
VET Ventilationsteknik
VEK Verktygs- och materialhantering
VIS Visuell kommunikation
VAI Våningsservice
VAD Vård och omsorg specialisering
WEB Webbteknik
YTT Yttre miljö
LAN Lantbruksdjur
LAU Lantbruksmaskiner
LAS Lastmaskiner och truckar inom naturbruk
LAT Latin – språk och kultur
LED Ledarskap och organisation
LIV Livsmedels- och näringskunskap
*/