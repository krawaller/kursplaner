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

DB.gysubjects.forEach(function(sid){
	var sub = DB.subjects[sid],
		nodes = {},
		edges = {},
		g = graphviz.digraph("G");
	if (sub.hasreqs){
		sub.courses.forEach(function(cid){
			var course = DB.courses[cid],
				cname = fixName(course.name,course.subject,sid),
				debug = cid === "SVESKR0";
			if (course.hasreqs){
				if (!nodes[cname]){
					nodes[cname] = g.addNode(cname);
				}
				if (sub.code === "MAT"){
					console.log("MATTE",cid,cname);
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
});



DB.gycourses.forEach(function(cid){
	var course = DB.courses[cid],
		cname = course.name, //fixName(course.name,course.subject,sid),
		debug = false, // cid === "SVESKR0";
		nodes = {},
		g = graphviz.digraph("G");
	if (course.hasreqs){
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
		g.output( "png", course.code+".png" );
	}
});


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