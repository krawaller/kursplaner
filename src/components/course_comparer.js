/** @jsx React.DOM */

var React = require('react'),
  Courses_select = require('./courses_select'),
  Section = React.createFactory(require('./section')),
  CourseContent = require('./course_content'),
  CourseGrades = require('./course_grades'),
  _ = require('lodash');
  Router = require('react-router'),
  Link = Router.Link,
  Sel = require('../mixins/select');


var CourseComparer = React.createClass({
  mixins: [Sel("what",["centralt innehåll","kunskapskrav"]),Sel("grade",["E","C","A"])],
  render: function(){
  	var course = this.props.course,
        coursesuff = (course.school ? " ("+course.school+")" : " (gy)")
        DB = this.props.DB,
        othercode = this.props.params && this.props.params.other,
        other = DB.courses[othercode],
        othersuff = (other.school ? " ("+other.school+")" : " (gy)")
        now = this.state.what,
        nowg = this.state.grade,
        Comp = (now==="kunskapskrav"?CourseGrades:CourseContent),
        diff = (course.school!==other.school);
    return (
    	<Section headline={<span>Jämför {this.what()} {now==="kunskapskrav" && ["för"," ",this.grade()]}</span>}>
        <div className="row">
          <div className="col-xs-6">
            <h5>{course.name}{diff && coursesuff}</h5>
          </div>
          <div className="col-xs-6">
            <Link to="coursedesc" params={{course:othercode}}>
              <h5>{other.name}{diff && othersuff}</h5>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <Comp DB={DB} course={course} sub={true} grade={nowg} />
          </div>
          <div className="col-xs-6">
              <Comp DB={DB} course={other} sub={true} grade={nowg} />
          </div>
        </div>
    	</Section>
    )
  }
});

module.exports = CourseComparer;
