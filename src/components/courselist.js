/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
  Router = require('react-router'),
  Link = Router.Link;

var CourseList = React.createClass({
  render: function(){
  	var DB = this.props.DB,
        courses = DB.courses
    function linkToS(d){return <Link to="course" params={{course:d}}>{DB.courses[d].name}</Link>;}
    return (<div>
      <h2>Alla {DB.coursecodes.length} kurser</h2>
      {_.flatten(_.map(DB.coursenames,function(s){
        return [linkToS(DB.coursetocode[s])," "];
      }))}
    </div>)
  }
});

module.exports = CourseList;
