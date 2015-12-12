/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    _ = require("lodash"),
    favs = require("../favourites.js"),
    Commercial = require("./aecommercial.js");


function linkToS(d,DB,sameschool){
	var sub = DB.subjects[d], s = sub.school || "gymn";
	return <Link key={d} to="subjectdesc" params={{subject:d}}>
		{sub.name}
		{s !== (sameschool||"gymn") ? " ("+s+")" : null}
	</Link>;
}

function list(subjects,DB,school){
	var l = subjects.length;
	return _.reduce(subjects,function(mem,sid,n){
		mem.push(linkToS(sid,DB,school));
		if (n === l-1){
			mem.push(".");
		} else if (n === l-2){
			mem.push(" och ");
		} else {
			mem.push(", ");
		}
		return mem;
	},[]);
}

var SubjectDesc = React.createClass({
	getInitialState: function(){
		return {isfav: favs.getSubjectState(this.props.subject.code)}
	},
	toggleFav: function(){
		console.log("TOGGLING!",this.props.subject.code);
		favs.toggleSubjectState(this.props.subject.code);
		this.setState({isfav:favs.getSubjectState(this.props.subject.code)});
	},
  render: function(){
    var sub = this.props.subject,
    	DB = this.props.DB,
    	isfav = this.state.isfav,
    	spec = {ELP:"INT",INT:"ELP"},
    	specreplacers = {TEY:"TES",TES:"TEY"};
    return (
        <Section headline="Beskrivning" {...this.props}>
        	{ spec[sub.code] ? <p className="obsolete">
        		Detta ämne <strong>ges inte längre efter juni 2015</strong> utan blev tillsammans med {' '}
        		{linkToS(spec[sub.code],DB)} ersatt av {linkToS("TEY",DB)} och {linkToS("TES",DB)}.
        	</p>: null}
        	{ specreplacers[sub.code] ? <p>
        		Detta ämne tillkom tillsammans med {linkToS(specreplacers[sub.code],DB)} i juli 2015 {' '}
        		för att ersätta {linkToS("ELP",DB)} och {linkToS("INT",DB)}.
        	</p>: null}
        	{ sub.replacedby && <p className="obsolete">
        		Detta ämne <strong>ges inte längre efter juni 2015</strong> utan ersattes av {linkToS(sub.replacedby,DB)} med den nya koden <strong>{sub.replacedby}</strong>.
        	</p> || null}
        	{ sub.replaces && <p>
        		Detta ämne skapades efter juni 2015 för att ersätta {linkToS(sub.replaces,DB)} som hade koden <strong>{sub.replaces}</strong>.
        	</p> || null}
	        { sub.splitinto && <p className="obsolete">
	        	Detta ämne <strong>ges inte längre efter juni 2015</strong>, utan är uppdelat i {list(sub.splitinto,DB)}
	        </p> || null}
	        { sub.shardof && <p>
	        	Efter juni 2015 så delades det gamla ämnet {linkToS(sub.shardof,DB)} upp i detta ämne samt {list(sub.shardofwith,DB)}
	        </p> || null}
	        { sub.novux && <p>
	        	Detta ämne får ej ges inom vuxenutbildningen utan endast på gymnasiet.
	        </p> || null}
            <div dangerouslySetInnerHTML={{__html:sub.description}}/>
            { sub.friends.length ? <p>
            	{ sub.school
            		? <span>Motsvarighet till detta ämne i andra skolformer är </span>
            		: <span>Via kursers förkunskapskrav och andra sammanhang så har detta ämne kopplingar till </span>
            	}
            	{list(sub.friends,DB,sub.school||"gymn")}
            </p> : null}
            {!this.props.sub ? <button onClick={this.toggleFav} className={"favvoknapp btn btn-default btn-sm"+(false?" active":"")}>
                {isfav?"Ta bort från favoriter":"Lägg till bland favoriter"}
            </button> : null}
            { !this.props.sub && _.contains(["GRNMAT2","GRGRMAT01","MAT"],sub.code) ? <Commercial/> : null}
        </Section>
    );
  }
});

module.exports = SubjectDesc;
