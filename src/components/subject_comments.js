/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    _ = require('lodash'),
    Sel = require('../mixins/select');

var SubjectComments = React.createClass({
  componentWillMount: function(){
    Sel("comm",Object.keys(this.props.subject.comments),this);
  },
  render: function(){
    var subject = this.props.subject;
    var names = {ABOUT_THE_SUBJECT:"Om ämnet",PURPOSE:"Om syftet",DESCRIPTION:"Innehåll",COMPARISON_GY2000:"Kontra Gy2000",COMPARISON_GR:"Kontra grund"};
    var now = this.state.comm;
    return (
        <Section headline="Kommentarer">
        	{Object.keys(this.props.subject.comments).length>1 && [<p className='clearfix'>{this.comm()}</p>]}
            <div dangerouslySetInnerHTML={{__html:subject.comments[now]}}/>
        </Section>
    );
  }
});

module.exports = SubjectComments;
