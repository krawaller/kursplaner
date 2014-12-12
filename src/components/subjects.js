/** @jsx React.DOM */

var React = require('react'),
  Subjects_select = require('./subjects_select');

var Subjects = React.createClass({
  render: function(){
    return (<div>
      <h2>Välj ämne (totalt {Object.keys(this.props.DB.subjects).length})</h2>
      <Subjects_select {...this.props}/>
    </div>)
  }
});

module.exports = Subjects;
