/** @jsx React.DOM */

var React = require('react'),
  _ = require('lodash'),
  Router = require('react-router'),
  Link = Router.Link,
  favs = require("../favourites.js"),
  Columnlist = require("./parts/columnlist"),
  NavSelectPath = require("./parts/navselpath"),
  fav = require("../favourites");

var base = "/subjects/select/";

var sel1 = _.mapValues({
	favoriter: "fav", // fav
	grund: "grund",
	grundvux: "grundvux",
	gymn: "common",
},function(p){return base+p;});
var sel2 = _.mapValues({
	vanliga: "common",
	yrkes: "voc_a-g",
	"övriga": "other",
	nedlagda: "obsolete"
},function(p){return base+p;});
var sel3 = _.mapValues({
	"a-g": "voc_a-g",
	"h-o": "voc_h-o",
	"p-ö": "voc_p-ö"
},function(p){return base+p;});


function linkToS(DB,d){
  return <Link key={d} to="subjectdesc" params={{subject:d}}>{DB.subjects[d].name}</Link>;
}

var cache = {};

var Subjects = React.createClass({
  render: function(){
  	var cat = this.props.params.cat || "fav";
  	if (cat === "fav"){
  		return this.renderMe();
  	} else {
  		var stuff = cache[cat] || (cache[cat]=React.renderToStaticMarkup(this.renderMe()));
  		return <div dangerouslySetInnerHTML={{__html:stuff}}/>;
  	}
  },
  renderMe: function(){
	var DB = this.props.DB,
		cat = this.props.params.cat || "fav",
		subs, msg,
		depth = {fav:1,grund:1,grundvux:1,common:2,other:2,obsolete:2}[cat] || 3;
	console.log("Rendering for real",cat);
	switch(cat){
		case "fav":
			subs = fav.getSubjectFavourites();
			msg = subs.length ? <p>Visar de ämnen som du valt som favoriter.</p> : <p>Här listas de ämnen som du valt som favoriter, men du har inga än. Lägg till ett ämne genom att navigera till dess beskrivning och klicka på "Lägg till favorit"!</p>;
			break;
		case "grund":
			subs = DB.grundsubjects;
			msg = <p>Visar ämnen på grundskolan:</p>;
			break;
		case "grundvux":
			subs = DB.grundvuxsubjects;
			msg = <p>Visar ämnen på grundläggande nivå för vuxenutbildningen:</p>;
			break;
		case "common":
			subs = DB.subjectsCOMMON;
			msg = <p>Visar gymnasieämnen som kategoriseras som "vanliga":</p>;
			break;
		case "other":
			subs = DB.subjectsOTHER;
			msg = <p>Visar gymnasieämnen som kategoriseras som "vissa". De har individuella behörighetsregler.</p>;
			break;
		case "obsolete":
			subs = DB.subjectsobsolete;
			msg = <p>Visar gymnasieämnen som inte längre är aktuella:</p>;
			break;
		case "voc_a-g":
			subs = DB["subjectsVOCa-g"];
			msg = <p>Visar gymnasiala yrkesämnen mellan A-G:</p>;
			break;
		case "voc_h-o":
			subs = DB["subjectsVOCh-o"];
			msg = <p>Visar gymnasiala yrkesämnen mellan H-O:</p>;
			break;
		case "voc_p-ö":
			subs = DB["subjectsVOCp-ö"];
			msg = <p>Visar gymnasiala yrkesämnen mellan P-Ö:</p>;
			break;
	}

    return (<div key={cat}>
      <h2>Välj ämne (totalt {Object.keys(this.props.DB.subjects).length})</h2>
      <div>
        <p key="lvl1">
        	<NavSelectPath links={sel1} active={depth===1 ? base+cat : base+"common"} />
        	{depth > 1 ? <span key="lvl2">
        		<span> bland </span>
        		<NavSelectPath links={sel2} active={depth===2 ? base+cat : base+"voc_a-g"} />
        		{depth > 2 ? <span key="lvl3">
        			<span> på </span>
        			<NavSelectPath links={sel3} active={base+cat} />
        		</span> : null}
        	</span> : null}
        </p>
        {msg}
        <div key={cat}>
        	<Columnlist list={subs} fn={linkToS.bind(null,DB)} />
        </div>
      </div>
    </div>)
  }
});

module.exports = Subjects;
