/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
  Router = require('react-router'),
  Link = Router.Link;

var SubjectList = React.createClass({
  render: function(){
  	var DB = this.props.DB,
        subjects = DB.subjects
    function linkToS(d){return <Link to="subject" params={{subject:d}}>{DB.subjects[d].name}</Link>;}
    return (<div>
      <h2>Alla {DB.subjectcodes.length} ämnen</h2>
      {_.flatten(_.map(DB.subjectcodes,function(s){
        return [linkToS(s)," "];
      }))}
    </div>)
  }
});

module.exports = SubjectList;
