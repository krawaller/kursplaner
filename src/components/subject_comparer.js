/** @jsx React.DOM */

var React = require('react'),
  Subjects_select = require('./subjects_select'),
  Section = React.createFactory(require('./section')),
  SubjectDesc = require('./subject_desc'),
  SubjectPurpose = require('./subject_purpose'),
  SubjectGoals = require('./subject_goals'),
  _ = require('lodash');
  Router = require('react-router'),
  Link = Router.Link,
  Sel = require('../mixins/select');


var SubjectComparer = React.createClass({
  mixins: [Sel("what",["beskrivning","syfte","ämnesmål"])],
  render: function(){
  	var subject = this.props.subject,
        subsuff = (subject.school? " ("+subject.school+")" : " (gy)"),
        DB = this.props.DB,
        othercode = this.props.params && this.props.params.other,
        other = DB.subjects[othercode],
        othersuff = (other.school? " ("+subject.school+")" : " (gy)")
        now = this.state.what,
        Comp = (now==="ämnesmål"?SubjectGoals:now==="syfte"?SubjectPurpose:SubjectDesc),
        diff = (subject.school!==other.school);
    return (
    	<Section headline={<span>Jämför {this.what()}</span>}>
        <div className="row">
          <div className="col-xs-6">
            <h5>{subject.name}{diff && subsuff}</h5>
          </div>
          <div className="col-xs-6">
            <Link to="subjectdesc" params={{subject:othercode}}>
              <h5>{other.name}{diff && othersuff}</h5>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <Comp DB={DB} subject={subject} sub={true} />
          </div>
          <div className="col-xs-6">
              <Comp DB={DB} subject={other} sub={true} />
          </div>
        </div>
    	</Section>
    )
  }
});

module.exports = SubjectComparer;
