/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    Router = require('react-router'),
    Link = Router.Link,
    _ = require('lodash');

var SubjectCourseList = React.createClass({
  render: function(){
    var subject = this.props.subject,
        list = subject.courses,
        nums = [0,0,"två","tre","fyra","fem","sex","sju","åtta","nio","tio","elva","tolv","tretton","fjorton","femton"],
        DB = this.props.DB;
    function linkToC(d){
        var c = DB.courses[d];
        return <Link to="course" params={{course:d}}>{c.name}, {c.points} poäng</Link>;
    }
    return (
        <Section headline="Ingående kurser">
            <p>Följande {list.length===1?"kurs är den enda i ämnet":nums[list.length]+" kurser ingår i ämnet"}:</p>
            <ul>{list.map(function(c,n){
                return <li key={n}>{linkToC(c)}</li>;
            })}</ul>
        </Section>
    );
  }
});

module.exports = SubjectCourseList;
