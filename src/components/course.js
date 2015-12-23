/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
	Router = require('react-router'),
  RouteHandler = Router.RouteHandler,
  NavBar = require('./parts/navbar');

var Course = React.createClass({
  render: function(){
  	var code = this.props.params && this.props.params.course,
        DB = this.props.DB,
  		  course = DB.courses[code],
  		  subject = course && DB.subjects[course.subject];
    var links = {
      Beskrivning: ["coursedesc",{course:code}],
      "Centralt innehåll": ["coursecontent",{course:code}],
      "Ämnesmål": ["coursegoals",{course:code}],
      "Kunskapskrav": ["coursegrades",{course:code}],
      "Jämför": ["coursecomparetochoice",{course:code}]
    };
    if (Object.keys(course.comments||{}).length){
      links["Kommentarer"] = ["coursecomments",{course:code}];
    }
    return !course ? <p>Hittar ingen kurs med kod {code}!</p> : !subject ? <p>Lyckades ej ladda ämne {course.subject} för {course.name}!</p> : (
      <div key={code}>
        <h2>Kursen {course.name}</h2>
        <NavBar links={links}/>
        <RouteHandler course={course} subject={subject} {...this.props} />
      </div>
    );
  }
});

module.exports = Course;