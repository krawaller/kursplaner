/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section'));

var SubjectPurpose = React.createClass({
  render: function(){
    var subject = this.props.subject
    return (
        <Section headline="Syfte" {...this.props}>
            <div dangerouslySetInnerHTML={{__html:subject.purpose}}/>
        </Section>
    );
  }
});

module.exports = SubjectPurpose;
