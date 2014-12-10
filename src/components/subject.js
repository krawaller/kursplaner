/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
  Router = require('react-router'),
  RouteHandler = Router.RouteHandler,
  NavBar = require('./navbar');

var Subject = React.createClass({
  render: function(){
  	var code = this.props.params && this.props.params.subject,
        DB = this.props.DB,
        subject = DB.subjects[code];
    var pre = "/subjects/"+code, links = {
      Beskrivning: pre,
      Syfte: pre+"/purpose",
      "Ämnesmål": pre+"/goals",
      "Kurser i ämnet": pre+"/courses",
      "Behörighet": pre+"/auth"
    };
    if (Object.keys(subject.comments||{}).length){
      links["Kommentarer"] = pre+"/comments";
    }
    return !subject ? <p>Hittar inget ämne med kod {code}!</p> : (
    	<div>
    		<h2>Ämne {subject.code}: {subject.name}</h2>
        <NavBar links={links}/>
        <RouteHandler subject={subject} DB={DB} />
    	</div>
    );
  }
});

module.exports = Subject;