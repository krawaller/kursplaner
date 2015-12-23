/** @jsx React.DOM */

var React = require('react'),
  Subjects_select = require('./subjects_select'),
  Section = React.createFactory(require('./section')),
  Columnlist = require("./parts/columnlist");


var SubjectCompareChoice = React.createClass({
  render: function(){
    var subject = this.props.subject,
      DB = this.props.DB;
    function linkToS(d){
      var suffix = "";
      if (DB.subjects[d].school!==subject.school){
        suffix = (DB.subjects[d].school ? " ("+DB.subjects[d].school+")" : " (gy)");
      }
      return <Link key={d} to="subjectcomparetoother" params={{subject:subject.code,other:d}}>{DB.subjects[d].name}{suffix}</Link>;
    }
    return (
      <Section headline={"Jämförelse"}>
        <p>Välj ämne att jämföra {subject.name} med:</p>
        <Columnlist fn={linkToS} list={subject.friends}/>
      </Section>
    )
  }
});

module.exports = SubjectCompareChoice;
