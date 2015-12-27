/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
	_ = require('lodash'),
    prerender = require('../prerender');

var CourseGoals = React.createClass({
  render: function(){
    var course = this.props.course, subject = this.props.subject;
    return (
        <Section headline="Ämnesmål i kursen" {...this.props}>
            <div dangerouslySetInnerHTML={{__html:prerender.courseGoals(course.code)}}/>
    	</Section>
    );
  }
});

module.exports = CourseGoals;
