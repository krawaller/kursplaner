/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
  Router = require('react-router'),
  RouteHandler = Router.RouteHandler,
  NavBar = require('./parts/navbar');

var Subject = React.createClass({
  render: function(){
  	var code = this.props.params && this.props.params.subject,
        DB = this.props.DB,
        subject = DB.subjects[code];
    var links = {
      Beskrivning: ["subjectdesc",{subject:code}],
      Syfte: ["subjectpurpose",{subject:code}],
      "Ämnesmål": ["subjectgoals",{subject:code}],
      "Kurser i ämnet": ["subjectcourses",{subject:code}],
      "Behörighet": ["subjectauth",{subject:code}]
    };
    if (subject.friends && subject.friends.length){
      links["Jämför"] = ["subjectcomparetochoice",{subject:code}];
    }
    if (Object.keys(subject.comments||{}).length){
      links["Kommentarer"] = ["subjectcomments",{subject:code}];
    }
    return !subject ? <p>Hittar inget ämne med kod {code}!</p> : (
    	<div>
    		<h2>Ämne {subject.code}: {subject.name}</h2>
        <NavBar key={code} links={links}/>
        <RouteHandler subject={subject} DB={DB} {...this.props} />
    	</div>
    );
  }
});

module.exports = Subject;