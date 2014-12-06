/** @jsx React.DOM */

var Router = require('react-router'),
	Route = Router.Route,
	DefaultRoute = Router.DefaultRoute,
	Multiroute = require('./components/multiroute.js'),
	Courses = require('./components/courses.js'),
	Course = require('./components/course.js'),
	Subject = require('./components/subject.js'),
	SubjectList = require('./components/subjectlist.js'),
	CourseList = require('./components/courselist.js'),
	Wrapper = require('./components/wrapper.js'),
	Home = require('./components/home.js');

module.exports = (
    <Route handler={Wrapper}>
        <Route name="home" path="/" handler={Home} />
        <Route name="subjects" path="/subjects" handler={Multiroute}>
        	<Route name="subject" path="/subjects/:subject" handler={Subject}/>
        	<DefaultRoute handler={SubjectList}/>
      	</Route>
      	<Route name="courses" path="/courses" handler={Multiroute}>
        	<Route name="course" path="/courses/:course" handler={Course}/>
        	<DefaultRoute handler={CourseList}/>
      	</Route>
    </Route>
);