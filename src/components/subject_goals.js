/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
	_ = require('lodash');

var SubjectGoals = React.createClass({
  render: function(){
    var subject = this.props.subject;
    return (
        <Section headline="Ämnesmål" {...this.props}>
            <p>Undervisningen i {subject.name} på {subject.school==="grund"||subject.school==="grundvux"?"grundskolenivå":"gymnasienivå"} {subject.school==="grundvux"?"för vuxna":""} ska ge eleverna möjlighet att utveckla förmågan att:</p>
            <ol>
                {subject.goals.map(function(goal,n){
                    return <li key={"goal"+n} className={"goal-"+["notused","used","focus"][subject.goals[n]]}>{goal}</li>;
                })}
            </ol>
            <p>
                {subject.school === "grund" || subject.school === "grundvux"
                ? "På grundläggande nivå jobbar man med samtliga mål i ämnets alla \"kurser\"."
                : subject.someexcludes?"Vissa kurser täcker inte alla ämnesmål."
                : subject.courses.length > 1
                ? (subject.courses.length===2 ? "Båda ämnets kurser " : "Samtliga kurser i ämnet ")+" täcker alla mål."
                : "Ämnet har bara en enda kurs, som därmed givetvis täcker alla ämnesmålen. "}
                {subject.somefocuses ? (
                    subject.courses.length > 1 ? " Några mål har extra fokus i vissa kurser. " : " Kursen har dock extra fokus på vissa ämnesmål."
                ) : null}
            </p>
    	</Section>
    );
  }
});

module.exports = SubjectGoals;
