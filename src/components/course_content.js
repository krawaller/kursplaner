/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    prerender = require('../prerender');

var CourseContent = React.createClass({
  render: function(){
    var course = this.props.course, other = this.props.other;
    return (
        <Section {...this.props} headline="Centralt innehåll">
            <div dangerouslySetInnerHTML={{__html:prerender.courseContent(course.code)}} />
    	</Section>
    );
  }
});

module.exports = CourseContent;
