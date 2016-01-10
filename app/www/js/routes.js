angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('tabsController.home', {
      url: '/home',
      views: {
        'tab1': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state('tabsController.subjects', {
      url: '/subjects',
      views: {
        'tab2': {
          templateUrl: 'templates/subjects.html',
          controller: 'SubjectsCtrl'
        }
      }
    })
    .state('tabsController.subject', {
      url: '/subjects/:subject',
      views: {
        'tab2': {
          templateUrl: 'templates/subject.html',
          controller: 'SubjectCtrl'
        }
      }
    })
    .state('tabsController.subject_description', {
      url: '/subjects/:subject/description',
      views: {
        'tab2': {
          templateUrl: 'templates/subject_desc.html',
          controller: 'SubjectCtrl'
        }
      }
    })
    .state('tabsController.subject_facts', {
      url: '/subjects/:subject/facts',
      views: {
        'tab2': {
          templateUrl: 'templates/subject_facts.html',
          controller: 'SubjectCtrl'
        }
      }
    })
    .state('tabsController.subject_goals', {
      url: '/subjects/:subject/goals',
      views: {
        'tab2': {
          templateUrl: 'templates/subject_goals.html',
          controller: 'SubjectCtrl'
        }
      }
    })
    .state('tabsController.subject_purpose', {
      url: '/subjects/:subject/purpose',
      views: {
        'tab2': {
          templateUrl: 'templates/subject_purpose.html',
          controller: 'SubjectCtrl'
        }
      }
    })
    .state('tabsController.subject_auth', {
      url: '/subjects/:subject/auth',
      views: {
        'tab2': {
          templateUrl: 'templates/subject_auth.html',
          controller: 'SubjectCtrl'
        }
      }
    })
    .state('tabsController.subject_comment', {
      url: '/subjects/:subject/commenton/:comment',
      views: {
        'tab2': {
          templateUrl: 'templates/subject_comment.html',
          controller: 'SubjectCtrl'
        }
      }
    })
    .state('tabsController.courses', {
      url: '/courses',
      views: {
        'tab3': {
          templateUrl: 'templates/courses.html',
          controller: 'CoursesCtrl'
        }
      }
    })
    .state('tabsController.course', {
      url: '/courses/:course',
      views: {
        'tab3': {
          templateUrl: 'templates/course.html',
          controller: 'CourseCtrl'
        }
      }
    })
    .state('tabsController.course_description', {
      url: '/courses/:course/description',
      views: {
        'tab3': {
          templateUrl: 'templates/course_desc.html',
          controller: 'CourseCtrl'
        }
      }
    })
    .state('tabsController.course_content', {
      url: '/courses/:course/content',
      views: {
        'tab3': {
          templateUrl: 'templates/course_content.html',
          controller: 'CourseCtrl'
        }
      }
    })
    .state('tabsController.course_comment', {
      url: '/courses/:course/commenton/:comment',
      views: {
        'tab3': {
          templateUrl: 'templates/course_comment.html',
          controller: 'CourseCtrl'
        }
      }
    })
    .state('tabsController.course_judge', {
      url: '/courses/:course/judge',
      views: {
        'tab3': {
          templateUrl: 'templates/course_judge.html',
          controller: 'CourseCtrl'
        }
      }
    })
    .state('tabsController', {
      url: '/kursplaner',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })
    .state('tabsController.favorites', {
      url: '/favorites',
      views: {
        'tab4': {
          templateUrl: 'templates/favorites.html',
          controller: 'FavoritesCtrl'
        }
      }
    })

    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/kursplaner/home');

});
