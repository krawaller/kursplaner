/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    Router = require('react-router'),
    Link = Router.Link,
    _ = require('lodash');

var CourseDescription = React.createClass({
  render: function(){
    var course = this.props.course,
        subject = this.props.subject,
        tot = subject.courses.length,
        nums = [0,0,"två","tre","fyra","fem","sex","sju","åtta","nio","tio","elva","tolv","tretton","fjorton","femton"],
        desc = course.descarr,
        by = course.reqBy,
        DB = this.props.DB;
    function linkToC(d){return <Link to="course" params={{course:d}}>{DB.courses[d].name}</Link>;}
    function linkToS(d){return <Link to="subject" params={{subject:d}}>{DB.subjects[d].name}</Link>;}
    return (
        <Section headline="Beskrivning">
            <p>
              {course.name} har kod <strong>{course.code}</strong> och är på <strong>{course.points}</strong> poäng. Den är {tot===1?"enda kursen":"en av "+(nums[tot]||tot)+" kurser "} i ämnet {linkToS(subject.code)}.
              {desc && [" "].concat(desc.map(function(d){
                return DB.courses[d]?linkToC(d):d;
              }))}
              {by && [" Kursen ingår i förkunskapskraven för "].concat(_.reduce(by,function(m,part,n){
                return m.concat([linkToC(part)].concat(n===by.length-1?[]:n===by.length-2?[" och "]:[", "]));
              },[])).concat([". "])}
            </p>
        </Section>
    );
  }
});

module.exports = CourseDescription;
