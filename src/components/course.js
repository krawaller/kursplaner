/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
	Router = require('react-router'),
  RouteHandler = Router.RouteHandler,
  NavBar = require('./navbar');

var Course = React.createClass({
  render: function(){
  	var code = this.props.params && this.props.params.course,
        DB = this.props.DB,
  		  course = DB.courses[code],
  		  subject = course && DB.subjects[course.subject];
    var pre = "/courses/"+code, links = {
      Beskrivning: pre,
      "Centralt innehåll": pre+"/content",
      "Ämnesmål": pre+"/goals",
      "Kunskapskrav": pre+"/grades"
    };
    return !course ? <p>Hittar ingen kurs med kod {code}!</p> : !subject ? <p>Lyckades ej ladda ämne {course.subject} för {course.name}!</p> : (
      <div>
        <h2>Kursen {course.name}</h2>
        <NavBar links={links}/>
        <RouteHandler course={course} subject={subject} DB={DB} />
      </div>
    );
  }
});

module.exports = Course;

/*
<div>
        <h2>Kurs {course.code}: {course.name}, {course.points} poäng</h2>
        <CourseDescription course={course} subject={subject} DB={this.props.DB}/>
        <CourseGoals course={course} subject={subject}/>
        <CourseContent content={course.content}/>
        <CourseGrades grades={course.judge}/>
        {comm.comment && (
          <Section headline="Kommentar till innehåll">
            <div dangerouslySetInnerHTML={{__html:comm.comment}}/>
          </Section>
        )}
        {comm.judgehelp && (
          <Section headline="Kommentar till kunskapskrav">
            <div dangerouslySetInnerHTML={{__html:comm.judgehelp}}/>
          </Section>
        )}
      </div>
*/