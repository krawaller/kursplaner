/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    _ = require("lodash");


function linkToS(d,DB,sameschool){
	var sub = DB.subjects[d], s = sub.school || "gymn";
	return <Link to="subjectdesc" params={{subject:d}}>
		{sub.name}
		{s !== sameschool ? " ("+s+")" : null}
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
  render: function(){
    var sub = this.props.subject,
    	DB = this.props.DB;
    return (
        <Section headline="Beskrivning" {...this.props}>
        	{ sub.replacedby && <p>
        		Detta ämne <strong>ges inte längre efter juni 2015</strong> utan ersattes av {linkToS(sub.replacedby,DB)}.
        	</p> || null}
        	{ sub.replaces && <p>
        		Detta ämne skapades efter juni 2015 för att ersätta {linkToS(sub.replaces,DB)}.
        	</p> || null}
	        { sub.splitinto && <p>
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
        </Section>
    );
  }
});

module.exports = SubjectDesc;
