/** @jsx React.DOM */

var React = require('react'),
  Subjects_select = require('./subjects_select');

var Subjects = React.createClass({
  render: function(){
    return (<div>
      <h2>Alla {this.props.DB.subjectcodes.length} ämnen</h2>
      <Subjects_select {...this.props}/>
    </div>)
  }
});

module.exports = Subjects;
