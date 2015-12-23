/** @jsx React.DOM */

var React = require('react'),
  Courses_select = require('./courses_select');


var Courses = React.createClass({
  render: function(){
    return (<div>
      <h2>Välj kurs (totalt {Object.keys(this.props.DB.courses).length} st)</h2>
      <div className="mainbox">
      	<Courses_select {...this.props}/>
      </div>
    </div>)
  }
});

module.exports = Courses;
