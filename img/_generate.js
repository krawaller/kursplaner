var util = require('util'),
    graphviz = require('graphviz'),
    DB = require('../fetch/json/master.json'),
    _ = require('lodash');

var fixName = function(str,thissub,mainsub){
	//str = str;
	if (thissub!==mainsub){
		str+="\n("+thissub+")";
	}
	return str;
}

function drawSubject(sid){
	var sub = DB.subjects[sid],
		nodes = {},
		edges = {},
		g;
	if (sub.hasreqs){
		g = graphviz.digraph("G");
		sub.courses.forEach(function(cid){
			var course = DB.courses[cid],
				cname = fixName(course.name,course.subject,sid),
				debug = false; // cid === "SVESKR0";
			if (course.hasreqs){
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
			}
		});
		g.output( "png", sub.code+".png" );
	}
	//console.log("Finished",sub.name);
}

function drawCourse(cid){
	var course = DB.courses[cid],
		cname = course.name, //fixName(course.name,course.subject,sid),
		debug = false,
		nodes = {},
		g;
	if (course.hasreqs){
		g = graphviz.digraph("G");
		debug && console.log("Drawing",cid);
		nodes[cname] = g.addNode(cname,{style:"bold"});
		(course.reqarr||[]).forEach(function(rcid){
			var rcourse = DB.courses[rcid],
				rname = fixName(rcourse.name,rcourse.subject,course.subject);
				styles = rcourse.subject !== course.subject ? {style:"dashed"} : {};
			nodes[rname] = g.addNode(rname,styles);
			debug && console.log("adding edge from",cid,"to",rcid);
			g.addEdge( nodes[rname], nodes[cname], styles );
		});
		(course.reqBy||[]).forEach(function(rcid){
			var rcourse = DB.courses[rcid],
				rname = fixName(rcourse.name,rcourse.subject,course.subject),
				styles = rcourse.subject !== course.subject ? {style:"dashed"} : {};
			if (!(rcourse.obsolete && !course.obsolete)){
				nodes[rname] = g.addNode(rname,styles);
				debug && console.log("adding edge from",rcid,"to",cid);
				g.addEdge( nodes[cname], nodes[rname], styles );
			}
		});
		try {
			g.output( "png", course.code+".png" );
		} catch(e) {
			console.log("The eff?!",cid,cname,course.reqarr,course.reqBy);
			throw e;
		}
	} else {
		debug && console.log("Ignoring",cid);
	}
}


//DB.gysubjects.forEach(drawSubject);

//drawCourse = _.debounce(drawCourse,100);
//DB.gycourses.forEach(drawCourse);
var pertime = 25,
	betweeneach = 800;
_.range(0,Math.ceil(DB.gycourses.length/pertime)+1).forEach(function(n){
	_.delay(function(){
		console.log("Dealing with",n*pertime,"to",(n+1)*pertime);
		DB.gycourses.slice(n*pertime,(n+1)*pertime).forEach(drawCourse)
	},n*betweeneach);
});

console.log(DB.gycourses);


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