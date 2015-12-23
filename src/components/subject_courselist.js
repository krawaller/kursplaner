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
        return <Link to="coursedesc" params={{course:d}}>{c.name}</Link>;
    }
    function makeList(courses){
        var l = courses.length;
        return _.reduce(courses,function(mem,cid,n){
            mem.push(linkToC(cid));
            if (n === l-1){
                //mem.push(".");
            } else if (n === l-2){
                mem.push(" och ");
            } else {
                mem.push(", ");
            }
            return mem;
        },[]);
    }

    return (
        <Section headline="Kurser i ämnet">
            {subject.school==="grund" ? (
                <div>
                    <p>Normalt skiljer man inte mellan kurser och ämnen på grundskolan, men eftersom det finns specifikt centralt innehåll och kunskapskrav för de olika stadierna inom grundskolans ämnen så har vi valt att hantera dessa som kurser, för att matcha strukturen på gymnasienivå.</p>
                    <p>Ämnet {subject.name} delas då in i följande "delkurser":</p>
                    <ul>
                        {_.map(list,function(cid){ return <li key={cid}>{linkToC(cid)}</li>; })}
                    </ul>
                </div>
            ) : (
                <div>
                    <p>Följande {list.length===1?"kurs är den enda i ämnet":(nums[list.length]||list.length)+" kurser ingår i ämnet"}:</p>
                    <table className="table coursetable bigtablecontainer">
                        <thead>
                            <tr>
                                <th colSpan="2"></th>
                                <th colSpan={subject.goals.length} className='coursegoals'>ingående ämnesmål</th>
                            </tr>
                            <tr>
                                <th>Kurs</th>
                                <th>Nivå</th>
                                {_.map(subject.goals,function(g,n){return <th key={n}>{n+1}</th>;})}
                            </tr>
                        </thead>
                        <tbody>
                            {_.map(list,function(cid,n){
                                var course = DB.courses[cid];
                                return (
                                    <tr key={cid}>
                                        <td>{linkToC(cid)}</td>
                                        <td>{{basic:"grundl",normal:"normal",high:"fördjup"}[course.level]}</td>
                                        {_.map(course.goals,function(u,n){
                                            return <td key={n}>{["--","ja",<strong>ja</strong>][u]}</td>;
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {subject.hasreqs ? <div>
                        <p>
<span>Nedan visas en karta över förkunskapskrav som kurser i detta ämne ingår i. </span>
{subject.foreignlinks ?
    <span> Berörda kurser som tillhör andra ämnen ({makeList(subject.foreignlinks)}) visas streckade.</span>
: null}
                        </p>
                        <p className="mapcontainer">
                            <img src={"./img/"+subject.code+".png"}/>
                        </p>
                    </div>: subject.school ? null : subject.courses.length === 1 ? <p>Kursen har inga förkunskapskrav och ingår inte i några andra kursers förkunskapskrav.</p> : <p>Ingen av kurserna har några förkunskapskrav, och de ingår inte heller i förkunskapskraven för några andra kurser.</p>}
                </div>
            )}
        </Section>
    );
  }
});

module.exports = SubjectCourseList;
