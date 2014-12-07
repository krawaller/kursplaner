/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
  Router = require('react-router'),
  Link = Router.Link;

var SubjectsSelect = React.createClass({
  render: function(){
  	var DB = this.props.DB,
        subjects = DB.subjects
    function linkToC(d){return <Link to="subject" params={{subject:d}}>{DB.subjects[d].name}</Link>;}
    return (<div>
      {_.flatten(_.map(DB.subjects,function(def,code){
        return [linkToC(code)," "];
      }))}
    </div>)
  }
});

module.exports = SubjectsSelect;
