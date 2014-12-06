/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
	CourseContent = React.createFactory(require('./course_content')),
	CourseGoals = React.createFactory(require('./course_goals')),
	CourseGrades = React.createFactory(require('./course_grades')),
	CourseDescription = React.createFactory(require('./course_description')),
	Section = React.createFactory(require('./section'));

var Course = React.createClass({
  render: function(){
  	var code = this.props.params && this.props.params.course,
  		course = this.props.DB.courses[code],
  		subject = course && this.props.DB.subjects[course.subject],
  		comm = course && course.comments || {};
    return !course ? <p>Hittar ingen kurs med kod {code}!</p> : !subject ? <p>Lyckades ej ladda ämne {course.subject} för {course.name}!</p> : (
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
    );
  }
});

module.exports = Course;
