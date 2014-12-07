/** @jsx React.DOM */

var React = require('react'),
  Courses_select = require('./courses_select'),
  Section = React.createFactory(require('./section')),
  CourseContent = require('./course_content'),
  CourseGrades = require('./course_grades'),
  _ = require('lodash');


var CourseComparer = React.createClass({
  getInitialState: function(){
    return {choice:"centralt innehåll"};
  },
  choose: function(w){
    this.setState({choice:w});
  },
  render: function(){
  	var course = this.props.course,
        DB = this.props.DB,
        othercode = this.props.params && this.props.params.other,
        other = DB.courses[othercode],
        now = this.state.choice,
        Comp = (now==="kunskapskrav"?CourseGrades:CourseContent);
    var sel = (
      <div style={{display:"inline-block"}} className="btn-group">
        {_.map(["centralt innehåll","kunskapskrav"],function(g){
          return <button onClick={_.partial(this.choose,g)} className={'btn btn-default'+(g===now?' active':'')}>{g.toUpperCase()}</button>
        },this)}
      </div>
    );
    return (
    	<Section headline={"Jämförelse"}>
        <h4>Jämför {sel} med {other.name}</h4>
        <div className="row">
          <div className="col-xs-6">
            <h5>{course.name}</h5>
          </div>
          <div className="col-xs-6">
            <h5>{other.name}</h5>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <Comp DB={DB} course={course} sub={true} />
          </div>
          <div className="col-xs-6">
            <Comp DB={DB} course={other} sub={true} />
          </div>
        </div>
    	</Section>
    )
  }
});

module.exports = CourseComparer;
