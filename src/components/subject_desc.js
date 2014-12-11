/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section'));

var SubjectDesc = React.createClass({
  render: function(){
    var subject = this.props.subject
    return (
        <Section headline="Beskrivning" {...this.props}>
            <div dangerouslySetInnerHTML={{__html:subject.description}}/>
        </Section>
    );
  }
});

module.exports = SubjectDesc;
