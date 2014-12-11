/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    _ = require('lodash'),
    Sel = require('../mixins/select');

var CourseComments = React.createClass({
  componentWillMount: function(){
    if (this.props.course.code==="BIOBIO01"){
      console.log("SPECIAL WOOO",Object.keys(this.props.course.comments));
    }
    Sel("comm",Object.keys(this.props.course.comments),this);
  },
  render: function(){
    var course = this.props.course;
    var now = this.state.comm,
        keys = Object.keys(this.props.course.comments);
    return (
        <Section>
          <h3>Kommentar till {keys.length>1 ? this.comm() : keys[0]}</h3>
            <div dangerouslySetInnerHTML={{__html:course.comments[now]}}/>
        </Section>
    );
  }
});

module.exports = CourseComments;
