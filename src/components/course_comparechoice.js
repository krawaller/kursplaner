/** @jsx React.DOM */

var React = require('react'),
  Courses_select = require('./courses_select'),
  Section = React.createFactory(require('./section'));


var CourseCompareChoice = React.createClass({
  render: function(){
  	var course = this.props.course,
  		DB = this.props.DB;
    return (
    	<Section headline={"Jämförelse"}>
    		<p>Välj kurs att jämföra {course.name} med:</p>
      		<Courses_select DB={this.props.DB} compareto={course.code} />
    	</Section>
    )
  }
});

module.exports = CourseCompareChoice;
