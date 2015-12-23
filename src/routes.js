/** @jsx React.DOM */

var Router = require('react-router'),
	Route = Router.Route,
	DefaultRoute = Router.DefaultRoute,
	Multiroute = require('./components/multiroute.js'),
  Masterplans = require('./components/masterplans.js'),
  Masterplan = require('./components/masterplan.js'),
  MasterplanMission = require('./components/masterplanmission.js'),
  MasterplanGoals = require('./components/masterplangoals.js'),
  MasterplanCompare = require('./components/masterplancomp.js'),
	Courses = require('./components/courses.js'),
	Course = require('./components/course.js'),
  CourseContent = require('./components/course_content'),
  CourseGoals = require('./components/course_goals'),
  CourseGrades = require('./components/course_grades'),
  CourseDesc = require('./components/course_description'),
  CourseComparer = require('./components/course_comparer'),
  CourseCompareChoice = require('./components/course_comparechoice'),
  CourseComments = require('./components/course_comments'),
	Subject = require('./components/subject.js'),
	Subjects = require('./components/subjects.js'),
  SubjectDesc = require('./components/subject_desc.js'),
  SubjectPurpose = require('./components/subject_purpose.js'),
  SubjectGoals = require('./components/subject_goals.js'),
  SubjectCourseList = require('./components/subject_courselist'),
  SubjectAuth = require('./components/subject_auth'),
  SubjectComments = require('./components/subject_comments'),
  SubjectComparer = require('./components/subject_comparer'),
  SubjectCompareChoice = require('./components/subject_comparechoice'),
	Wrapper = require('./components/wrapper.js'),
	Home = require('./components/home.js');

module.exports = (
    <Route handler={Wrapper}>
        <Route name="home" path="/" handler={Home} />

        <Route name="masterplans" path="/masters" handler={Multiroute}>
          <Route name="masterplan" path="/masters/:level" handler={Masterplan}>
            <Route name="masterplanmission" path="/masters/:level/mission" handler={MasterplanMission}/>
            <Route name="masterplangoals" path="/masters/:level/goals" handler={MasterplanGoals}/>
            <Route name="masterplancompdefault" path="/masters/:level/compare" handler={Multiroute}>
              <Route name="masterplancomp" path="/masters/:level/compare/:part/:other" handler={MasterplanCompare}/>
              <DefaultRoute handler={MasterplanCompare}/>
            </Route>
          </Route>
          <DefaultRoute handler={Masterplans} />
        </Route>

        <Route name="subjects" path="/subjects" handler={Multiroute}>
          <Route name="subject" path="/subjects/:subject" handler={Subject}>
            <Route name="subjectdesc" path="/subjects/:subject/desc" handler={SubjectDesc}/>
            <Route name="subjectpurpose" path="/subjects/:subject/purpose" handler={SubjectPurpose}/>
            <Route name="subjectgoals" path="/subjects/:subject/goals" handler={SubjectGoals}/>
            <Route name="subjectcourses" path="/subjects/:subject/courses" handler={SubjectCourseList}/>
            <Route name="subjectauth" path="/subjects/:subject/auth" handler={SubjectAuth}/>
            <Route name="subjectcomparetochoice" path="/subjects/:subject/compareto" handler={Multiroute}>
              <Route name="subjectcomparetoother" path="/subjects/:subject/compareto/:other" handler={SubjectComparer}/>
              <DefaultRoute handler={SubjectCompareChoice}/>
            </Route>
            <Route name="subjectcomments" path="/subjects/:subject/comments" handler={SubjectComments}>
              <Route name="subjectcommentstype" path="/subjects/:subject/comments/:type" handler={SubjectComments}/>
              <DefaultRoute handler={SubjectComments} />
            </Route>
          </Route>
          <Route name="subjectselect" path="/subjects/select/:cat" handler={Subjects}/>
          <DefaultRoute name="subjectselectdefault" handler={Subjects}/>
        </Route>

        <Route name="courses" path="/courses" handler={Multiroute}>
          <Route name="course" path="/courses/:course" handler={Course}>
            <Route name="coursedesc" path="/courses/:course/desc" handler={CourseDesc}/>
            <Route name="coursegoals" path="/courses/:course/goals" handler={CourseGoals}/>
            <Route name="coursecontent" path="/courses/:course/content" handler={CourseContent}/>
            <Route name="coursegrades" path="/courses/:course/grades" handler={Multiroute}>
              <Route name="coursegradessel" path="/courses/:course/grades/:grade" handler={CourseGrades}/>
              <DefaultRoute handler={CourseGrades}/>
            </Route>
            <Route name="coursecomparetochoice" path="/courses/:course/compareto" handler={Multiroute}>
              <Route name="coursecomparetoother" path="/courses/:course/compareto/:other" handler={CourseComparer}/>
              <DefaultRoute handler={CourseCompareChoice}/>
            </Route>
            <Route name="coursecomments" path="/courses/:course/comments" handler={CourseComments}/>
          </Route>
          <DefaultRoute handler={Courses}/>
        </Route>

    </Route>
);
