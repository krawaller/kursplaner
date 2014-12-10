/** @jsx React.DOM */

var Router = require('react-router'),
	Route = Router.Route,
	DefaultRoute = Router.DefaultRoute,
	Multiroute = require('./components/multiroute.js'),
	Courses = require('./components/courses.js'),
	Course = require('./components/course.js'),
  CourseContent = require('./components/course_content'),
  CourseGoals = require('./components/course_goals'),
  CourseGrades = require('./components/course_grades'),
  CourseDesc = require('./components/course_description'),
  CourseComparer = require('./components/course_comparer'),
  CourseCompareChoice = require('./components/course_comparechoice'),
	Subject = require('./components/subject.js'),
	Subjects = require('./components/subjects.js'),
  SubjectDesc = require('./components/subject_desc.js'),
  SubjectPurpose = require('./components/subject_purpose.js'),
  SubjectGoals = require('./components/subject_goals.js'),
  SubjectCourseList = require('./components/subject_courselist'),
  SubjectAuth = require('./components/subject_auth'),
  SubjectComments = require('./components/subject_comments'),
	Courses = require('./components/courses.js'),
	Wrapper = require('./components/wrapper.js'),
	Home = require('./components/home.js');

module.exports = (
    <Route handler={Wrapper}>
        <Route name="home" path="/" handler={Home} />
        
        <Route name="subjects" path="/subjects" handler={Multiroute}>
        	<Route name="subject" path="/subjects/:subject" handler={Subject}>
            <DefaultRoute handler={SubjectDesc}/>
            <Route name="subjectpurpose" path="/subjects/:subject/purpose" handler={SubjectPurpose}/>
            <Route name="subjectgoals" path="/subjects/:subject/goals" handler={SubjectGoals}/>
            <Route name="subjectcourses" path="/subjects/:subject/courses" handler={SubjectCourseList}/>
            <Route name="subjectauth" path="/subjects/:subject/auth" handler={SubjectAuth}/>
            <Route name="subjectcomments" path="/subjects/:subject/comments" handler={SubjectComments}/>
          </Route>
        	<DefaultRoute handler={Subjects}/>
      	</Route>

        <Route name="courses" path="/courses" handler={Multiroute}>
          <Route name="course" path="/courses/:course" handler={Course}>
            <DefaultRoute handler={CourseDesc}/>
            <Route name="coursegoals" path="/courses/:course/goals" handler={CourseGoals}/>
            <Route name="coursecontent" path="/courses/:course/content" handler={CourseContent}/>
            <Route name="coursegrades" path="/courses/:course/grades" handler={CourseGrades}/>
            <Route name="coursecomparetochoice" path="/courses/:course/compareto" handler={Multiroute}>
              <Route name="coursecomparetoother" path="/courses/:course/compareto/:other" handler={CourseComparer}/>
              <DefaultRoute handler={CourseCompareChoice}/>
            </Route>
          </Route>
          <DefaultRoute handler={Courses}/>
        </Route>

    </Route>
);