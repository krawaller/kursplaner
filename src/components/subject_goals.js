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
                {subject.school === "grund" || subject.school === "grundvux" ? "På grundläggande nivå jobbar man med samtliga mål i ämnets alla \"kurser\"." : subject.someexcludes?"Vissa kurser täcker inte alla ämnesmål.":"Samtliga kurser i ämnet täcker alla mål. "}
                {subject.somefocuses && " Några mål har extra fokus i vissa kurser."}
            </p>
    	</Section>
    );
  }
});

module.exports = SubjectGoals;
