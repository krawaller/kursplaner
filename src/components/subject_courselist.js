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
        return <Link to="coursedesc" params={{course:d}}>{c.name}, {c.points} poäng</Link>;
    }
    return (
        <Section headline="Ingående kurser">
            <p>Följande {list.length===1?"kurs är den enda i ämnet":(nums[list.length]||list.length)+" kurser ingår i ämnet"}:</p>
            <table className="table">
                <thead>
                    <tr>
                        <th>Kurs</th>
                        <th>Nivå</th>
                        {_.map(subject.goals,function(g,n){return <th>{n+1}</th>;})}
                    </tr>
                </thead>
                <tbody>
                    {_.map(list,function(cid,n){
                        var course = DB.courses[cid];
                        return (
                            <tr key={n}>
                                <td>{linkToC(cid)}</td>
                                <td>{{basic:"grundl",normal:"normal",high:"fördjup"}[course.level]}</td>
                                {_.map(course.goals,function(u){
                                    return <td>{["--","ja",<strong>ja</strong>][u]}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Section>
    );
  }
});

module.exports = SubjectCourseList;
