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
      "Centralt innehåll": ["coursecontent",{course:code}],
      "Ämnesmål": ["coursegoals",{course:code}],
      "Kunskapskrav": ["coursegrades",{course:code}],
      "Jämför med annan kurs": ["coursecomparetochoice",{course:code}]
    };
    return !course ? <p>Hittar ingen kurs med kod {code}!</p> : !subject ? <p>Lyckades ej ladda ämne {course.subject} för {course.name}!</p> : (
      <div>
        <h2>Kursen {course.name}</h2>
        <NavBar links={links}/>
        <RouteHandler course={course} subject={subject} {...this.props} />
      </div>
    );
  }
});

module.exports = Course;