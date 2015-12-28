/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    prerender = require("../prerender");

var SubjectGoals = React.createClass({
  render: function(){
    var subject = this.props.subject;
    return (
        <Section headline="Ämnesmål" {...this.props}>
            <div dangerouslySetInnerHTML={{__html:prerender.subjectGoals(subject.code) }}/>
    	</Section>
    );
  }
});

module.exports = SubjectGoals;
