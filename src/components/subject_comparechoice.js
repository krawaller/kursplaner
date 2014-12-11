/** @jsx React.DOM */

var React = require('react'),
  Subjects_select = require('./subjects_select'),
  Section = React.createFactory(require('./section'));


var SubjectCompareChoice = React.createClass({
  render: function(){
  	var subject = this.props.subject,
  		DB = this.props.DB;
    return (
    	<Section headline={"Jämförelse"}>
    		<p>Välj ämne att jämföra {subject.name} med:</p>
      		<Subjects_select DB={this.props.DB} compareto={subject.code} />
    	</Section>
    )
  }
});

module.exports = SubjectCompareChoice;
