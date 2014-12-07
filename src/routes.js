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
	Subject = require('./components/subject.js'),
	SubjectList = require('./components/subjectlist.js'),
  SubjectDesc = require('./components/subject_desc.js'),
  SubjectPurpose = require('./components/subject_purpose.js'),
  SubjectGoals = require('./components/subject_goals.js'),
  SubjectCourseList = require('./components/subject_courselist'),
  SubjectAuth = require('./components/subject_auth'),
	CourseList = require('./components/courselist.js'),
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
          </Route>
        	<DefaultRoute handler={SubjectList}/>
      	</Route>

        <Route name="courses" path="/courses" handler={Multiroute}>
          <Route name="course" path="/courses/:course" handler={Course}>
            <DefaultRoute handler={CourseDesc}/>
            <Route name="coursegoals" path="/courses/:course/goals" handler={CourseGoals}/>
            <Route name="coursecontent" path="/courses/:course/content" handler={CourseContent}/>
            <Route name="coursegrades" path="/courses/:course/grades" handler={CourseGrades}/>
          </Route>
          <DefaultRoute handler={CourseList}/>
        </Route>

    </Route>
);