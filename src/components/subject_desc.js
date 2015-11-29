/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    _ = require("lodash");


function linkToS(d,DB){return <Link to="subjectdesc" params={{subject:d}}>{DB.subjects[d].name}</Link>;}

function list(subjects,DB){
	var l = subjects.length;
	return _.reduce(subjects,function(mem,sid,n){
		mem.push(linkToS(sid,DB));
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
	        	Detta ämne <strong>ges inte längre efter juli 2015</strong>, utan är ersatt av {list(sub.replacedby,DB)}
	        </p> || ""}
	        { sub.replacing && <p>
	        	I juli 2015 så delades det gamla ämnet {linkToS(sub.replacing,DB)} upp i detta ämne samt {list(sub.replacingwith,DB)}
	        </p> || ""}
            <div dangerouslySetInnerHTML={{__html:sub.description}}/>
        </Section>
    );
  }
});

module.exports = SubjectDesc;
