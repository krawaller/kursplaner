var util = require('util'),
    graphviz = require('graphviz'),
    DB = require('../fetch/json/master.json'),
    _ = require('lodash'),
    writepngfromdot = require('./_writepngfromdot');

var rev = {
	DAT: {
		"Klassisk balett 1a": "Klassisk balett 1-3",
		"Klassisk balett 1b": "Klassisk balett 1-3",
		"Klassisk balett 2": "Klassisk balett 1-3",
		"Klassisk balett 3": "Klassisk balett 1-3",
		"Modern nutida dans 1a": "Modern nutida dans 1-3",
		"Modern nutida dans 1b": "Modern nutida dans 1-3",
		"Modern nutida dans 2": "Modern nutida dans 1-3",
		"Modern nutida dans 3": "Modern nutida dans 1-3"
	},
	DAK: {
		"Dansteknik 1": "Dansteknik 1-4",
		"Dansteknik 2": "Dansteknik 1-4",
		"Dansteknik 3": "Dansteknik 1-4",
		"Dansteknik 4": "Dansteknik 1-4"
	},
	MOB: {
		"Anläggningsförare 1": "Anläggningsförare 1-4",
		"Anläggningsförare 2": "Anläggningsförare 1-4",
		"Anläggningsförare 3": "Anläggningsförare 1-4",
		"Anläggningsförare 4": "Anläggningsförare 1-4"
	}
}

var fixName = function(str,thissub,mainsub){
	str = rev[mainsub] && rev[mainsub][str] || str;
	if (thissub!==mainsub){
		str+="\n("+thissub+")";
	}
	return str;
}

function drawSubject(sid){
	var sub = DB.subjects[sid],
		nodes = {},
		edges = {},
		g,
		notcount = 0;
	if (sub.hasreqs){
		g = graphviz.digraph("G");
		sub.courses.forEach(function(cid){
			var course = DB.courses[cid],
				cname = fixName(course.name,course.subject,sid),
				debug = false; // cid === "SVESKR0"
			if (course.hasreqs || course.notwitharr){
				if (!nodes[cname]){
					nodes[cname] = g.addNode(cname);
				}
				(course.reqarr||[]).forEach(function(rcid){
					var rcourse = DB.courses[rcid],
						rname = fixName(rcourse.name,rcourse.subject,sid);
						styles = rcourse.subject !== course.subject ? {style:"dashed"} : {};
					if (!nodes[rname]){
						nodes[rname] = g.addNode(rname,styles)
					}
					if (!edges[rcid+"_"+cid]){
						edges[rcid+"_"+cid] = 1;
						debug && console.log("adding edge from",cid,"to",rcid);
						g.addEdge( nodes[rname], nodes[cname], styles );
					}
				});
				(course.reqBy||[]).forEach(function(rcid){
					var rcourse = DB.courses[rcid],
						rname = fixName(rcourse.name,rcourse.subject,sid),
						styles = rcourse.subject !== course.subject ? {style:"dashed"} : {};
					if (!(rcourse.obsolete && !course.obsolete)){
						if (!nodes[rname]){
							nodes[rname] = g.addNode(rname,styles)
						}
						if (!edges[cid+"_"+rcid]){
							edges[cid+"_"+rcid] = 1;
							debug && console.log("adding edge from",rcid,"to",cid);
							g.addEdge( nodes[cname], nodes[rname], styles );
						}
					}
				});
				(course.notwitharr||[]).forEach(function(ncid){
					var ncourse = DB.courses[ncid],
						nname = fixName(ncourse.name,ncourse.subject,course.subject),
						styles = ncourse.subject !== course.subject ? {style:"dashed"} : {},
						edgename = [cname,nname].sort().join("_");
					if (!edges[edgename]){
						if (!nodes[nname]){
							nodes[nname] = g.addNode(nname,styles);
						}
						notcount = notcount+1;
						edges[edgename] = 1;
						g.addEdge( nodes[cname], nodes[nname], {
							color: "red",
							dir: "both",
							arrowhead: "tee",
							arrowtail: "tee",
							constraint: false
						});
					}
				});
			}
		});
		if (notcount > 5){
			console.log("Check out sub",sub.code)
		}
		g.output( "png", sub.code+".png" );
	}
	//console.log("Finished",sub.name);
}

function drawCourse(cid){
	var course = DB.courses[cid],
		cname = course.name, //fixName(course.name,course.subject,sid),
		debug = false,
		nodes = {},
		g, before, after, same;
	if (course.hasreqs || course.notwitharr){
		g = graphviz.digraph("G",{foo:"BAR",rankdir:"UD"});
		before = g.addCluster("cluster_before");
		same = g.addCluster("cluster_same",{rank:"same"});
		g.set("rankdir","UD");
		after = g.addCluster("cluster_after");
		debug && console.log("Drawing",cid);
		nodes[cname] = same.addNode(cname,{style:"bold",group:cid});
		// FIRST JUST NODES AND EDGES IN SAME LEVEL
		(course.notwitharr||[]).forEach(function(ncid){
			var ncourse = DB.courses[ncid],
				nname = fixName(ncourse.name,ncourse.subject,course.subject),
				styles = ncourse.subject !== course.subject ? {style:"dashed",group:cid} : {group:cid};
			if (!nodes[nname]){
				nodes[nname] = same.addNode(nname,styles);
			}
			same.addEdge( nodes[nname], nodes[cname], {
				color: "red",
				dir: "both",
				arrowhead: "tee",
				arrowtail: "tee",
				weight: 2
			});
		});

		(course.reqarr||[]).forEach(function(rcid){
			var rcourse = DB.courses[rcid],
				rname = fixName(rcourse.name,rcourse.subject,course.subject);
				styles = rcourse.subject !== course.subject ? {style:"dashed"} : {};
			nodes[rname] = before.addNode(rname,styles);
			debug && console.log("adding edge from",cid,"to",rcid);
			g.addEdge( nodes[rname], nodes[cname], _.extend({weight:1},styles) );
		});
		(course.reqBy||[]).forEach(function(rcid){
			var rcourse = DB.courses[rcid],
				rname = fixName(rcourse.name,rcourse.subject,course.subject),
				styles = rcourse.subject !== course.subject ? {style:"dashed"} : {};
			if (!(rcourse.obsolete && !course.obsolete)){
				nodes[rname] = after.addNode(rname,styles);
				debug && console.log("adding edge from",rcid,"to",cid);
				g.addEdge( nodes[cname], nodes[rname], _.extend({weight:3},styles) );
			}
		});




		try {
			console.log( g.to_dot() ); 
			g.output( "png", course.code+".png" );
		} catch(e) {
			console.log("The eff?!",cid,cname,course.reqarr,course.reqBy);
			throw e;
		}
	} else {
		debug && console.log("Ignoring",cid);
	}
}

function drawCourse2(cid){
	var course = DB.courses[cid],
		cname = course.name, //fixName(course.name,course.subject,sid),
		debug = false,
		g,
		flip = false;
	if (course.hasreqs || course.notwitharr){
		g = 'digraph G { rankdir=TB; "'+cname+'" [style=bold]; ';
		debug && console.log("Drawing",cid);
		// FIRST JUST NODES AND EDGES IN SAME LEVEL
		if (course.notwitharr){
			var samestr = '{ rank=same; "'+cname+'"; ';
			course.notwitharr.forEach(function(ncid){
				var ncourse = DB.courses[ncid],
					nname = fixName(ncourse.name,ncourse.subject,course.subject),
					styles = ncourse.subject !== course.subject ? '[style=dashed]' : '';
				g += '"'+nname+'" '+styles+';';
				g += ((flip = !flip) ? '"'+nname+'" -> "'+cname+'"' : '"'+cname+'" -> "'+nname+'" ')+'[ color = red, dir = both, arrowhead = tee, arrowtail = tee]; ';
				samestr+= '"'+nname+'"; ';
			});
			g += samestr+' } '; // { rank=same; "Matematik 2a"; "Matematik 2b"; "Matematik 2c"; }
		}
		(course.reqarr||[]).forEach(function(rcid){
			var rcourse = DB.courses[rcid],
				rname = fixName(rcourse.name,rcourse.subject,course.subject);
				styles = rcourse.subject !== course.subject ? '[style=dashed]' : '';
			g += '"'+rname+'" '+styles+'; ';
			g += '"'+rname+'" -> "'+cname+'"; ';
		});
		(course.reqBy||[]).forEach(function(rcid){
			var rcourse = DB.courses[rcid],
				rname = fixName(rcourse.name,rcourse.subject,course.subject);
				styles = rcourse.subject !== course.subject ? '[style=dashed]' : '';
			if (!(!course.obsolete && rcourse.obsolete)){
				g += '"'+rname+'" '+styles+'; ';
				g += '"'+cname+'" -> "'+rname+'"; ';
			};
		});
		writepngfromdot(g+' }','./'+course.code+".png");
	} else {
		debug && console.log("Ignoring",cid);
	}
}


DB.gysubjects.forEach(drawSubject);

//drawCourse = _.debounce(drawCourse,100);
//DB.gycourses.forEach(drawCourse);
/*
var pertime = 25,
	betweeneach = 800;
_.range(0,Math.ceil(DB.gycourses.length/pertime)+1).forEach(function(n){
	_.delay(function(){
		console.log("Dealing with",n*pertime,"to",(n+1)*pertime);
		DB.gycourses.slice(n*pertime,(n+1)*pertime).forEach(drawCourse2)
	},n*betweeneach);
});
*/

/*


// Create digraph G
var g = graphviz.digraph("G");

// Add node (ID: Hello)
var n1 = g.addNode( "Hello", {"color" : "blue"} );
n1.set( "style", "filled" );

// Add node (ID: World)
g.addNode( "World" );

// Add edge between the two nodes
var e = g.addEdge( n1, "World" );
e.set( "color", "red" );

// Print the dot script
console.log( g.to_dot() ); 

// Set GraphViz path (if not in your path)
//g.setGraphVizPath( "/usr/local/bin" );

// Generate a PNG output
g.output( "png", "test01.png" );

*/