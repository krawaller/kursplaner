/** @jsx React.DOM */

var React = require('react'),
  Courses_select = require('./courses_select');


var Courses = React.createClass({
  render: function(){
    return (<div>
      <h2>Alla {this.props.DB.coursecodes.length} kurser</h2>
      <Courses_select {...this.props}/>
    </div>)
  }
});

module.exports = Courses;
