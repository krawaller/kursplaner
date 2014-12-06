/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
  SubjectCourseList = React.createFactory(require('./subject_courselist')),
  SubjectAuth = React.createFactory(require('./subject_auth')),
  SubjectGoals = React.createFactory(require('./subject_goals')),
  Section = React.createFactory(require('./section'));

var Subject = React.createClass({
  render: function(){
  	var code = this.props.params && this.props.params.subject,
        DB = this.props.DB,
        subject = DB.subjects[code],
        comm = subject && subject.comments || {};
        ctitles = {
          ABOUT_THE_SUBJECT: "Kommentar till ämnet",
          COMPARISON_GY2000: "Jämförelse med Gy2000",
          COMPARISON_GR: "Jämförelse med grundskolan",
          DESCRIPTION: "Kommentar till beskrivning",
          PURPOSE: "Kommentar till syfte"
        }
    return !subject ? <p>Hittar inget ämne med kod {code}!</p> : (
    	<div>
    		<h2>Ämne {subject.code}: {subject.name}</h2>
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
    	</div>
    );
  }
});

module.exports = Subject;
