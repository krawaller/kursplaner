/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
	_ = require('lodash');

var CourseGoals = React.createClass({
  render: function(){
    var course = this.props.course, subject = this.props.subject;
    return (
        <Section headline="Ämnesmål i kursen" {...this.props}>
            <p>
                {course.school==="grund"
                ? "På grundskolan så jobbar man hela tiden med ämnets samtliga mål:"
                : course.excludesgoals
                ? "Ej ingående ämnesmål visas överstrykna. "
                : subject.courses.length===1
                ? "Eftersom denna kurs är ensam i sitt ämne så täcker den samtliga ämnesmål:"
                : subject.someexcludes
                ? "Denna kurs täcker samtliga ämnesmål: "
                : "Liksom alla övriga kurser i ämnet så täcker denna kurs samtliga ämnesmål:"}
                {course.focusesgoals ? "Mål som kursen fokuserar på visas i fetstil. " : ""}
            </p>
            <ol>
                {subject.goals.map(function(goal,n){
                    return <li key={"goal"+n} className={"goal-"+["notused","used","focus"][course.goals[n]]}>{goal}</li>;
                })}
            </ol>
            {course.level==="basic"?<p>I kursen behandlas <strong>grundläggande</strong> kunskaper i ämnet.</p>
            :course.level==="high"?<p>I kursen behandlas <strong>fördjupade</strong> kunskaper i ämnet.</p>:''}
    	</Section>
    );
  }
});

module.exports = CourseGoals;
