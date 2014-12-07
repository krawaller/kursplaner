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

        /*comm = subject && subject.comments || {};
        ctitles = {
          ABOUT_THE_SUBJECT: "Kommentar till ämnet",
          COMPARISON_GY2000: "Jämförelse med Gy2000",
          COMPARISON_GR: "Jämförelse med grundskolan",
          DESCRIPTION: "Kommentar till beskrivning",
          PURPOSE: "Kommentar till syfte"
        }*/


/*
        <Section headline="Beskrivning"><div dangerouslySetInnerHTML={{__html:subject.description}}/></Section>
        <Section headline="Syfte"><div dangerouslySetInnerHTML={{__html:subject.purpose}}/></Section>
        <SubjectGoals subject={subject} />
        <SubjectCourseList subject={subject} DB={DB} />
        <SubjectAuth subject={subject}/>
        {_.map(comm,function(content,name){
            return (
              <Section headline={ctitles[name]}>
                  <div dangerouslySetInnerHTML={{__html:content}}/>
              </Section>
            )
        })}
*/