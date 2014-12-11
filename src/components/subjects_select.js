/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
  Router = require('react-router'),
  Link = Router.Link;

var SubjectsSelect = React.createClass({
  render: function(){
  	var subjects = this.props.DB.subjects,
        compareto = this.props.compareto;
    function linkToC(d){return <Link to={compareto?"subjectcomparetoother":"subjectdesc"} params={compareto?{subject:compareto,other:d}:{subject:d}}>{subjects[d].name}</Link>;}
    return (<div>
      {_.flatten(_.map(subjects,function(def,code){
        return [linkToC(code)," "];
      }))}
    </div>)
  }
});

module.exports = SubjectsSelect;
