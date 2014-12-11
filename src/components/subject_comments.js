/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    _ = require('lodash'),
    NavSel = require('./navselect');

var SubjectComments = React.createClass({
  render: function(){
    var subject = this.props.subject;
    var keys = Object.keys(this.props.subject.comments);
    var names = {ABOUT_THE_SUBJECT:"ämnet",PURPOSE:"syftet",DESCRIPTION:"innehållet",COMPARISON_GY2000:"Gy2000",COMPARISON_GR:"grund"};
    var p = _.extend({},{type: keys[0]},this.props.params||{});
    var sel = keys.length>1?<NavSel to="subjectcommentstype" params={p} name="type" opts={_.pick(names,keys)}/>:names[p.type];
    return (
      <Section headline={["Kommentar till"," ",sel]}>
        <div dangerouslySetInnerHTML={{__html:subject.comments[p.type]}}/>
      </Section>
    );
  }
});

module.exports = SubjectComments;
