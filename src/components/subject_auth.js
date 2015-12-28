/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    prerender = require("../prerender");

var SubjectAuth = React.createClass({
  render: function(){
    var subject = this.props.subject
    return (
        <Section headline="Behörighet">
            <div dangerouslySetInnerHTML={{__html:prerender.subjectAuthorization(subject.code) }}/>
        </Section>
    );
  }
});

module.exports = SubjectAuth;
