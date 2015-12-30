angular.module('app.controllers', [])

.controller('HomeCtrl', function($scope) {

})

.controller('SubjectsCtrl', function($scope, $http, $ionicPopover, $timeout, DataService) {
  $scope.search = { name: '' };

  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.filters = [
    { text: "Inget filter", value: "0" },
    { text: "Vanliga", value: "a" },
    { text: "Övriga", value: "b" },
    { text: "Yrkes", value: "c" },
    { text: "Speciella", value: "d" },
    { text: "Nedlagda", value: "e" },
  ];

  $scope.filter = {
    value: '0'
  };

  $scope.onFilterChange = function () {
    $timeout(function () {
      $scope.popover.hide();
    }, 200);
  };

  $scope.subjects = DataService.sortedsubjects;
})

.controller('CoursesCtrl', function($scope, $http, DataService) {
  $scope.search = { name: '' };

  $scope.courses = DataService.sortedcourses;
})

.controller('FavoritesCtrl', function($scope, DataService) {
  function refresh () {
    $scope.favorites = DataService.getFavorites();
  };

  $scope.$on('$ionicView.beforeEnter', refresh);

  $scope.removeFavorite = function (code, type) {
    DataService.removeFavorite(code, type);
    refresh();
  };
})

.controller('SettingsCtrl', function($scope) {
  $scope.choice = 'gymnasie';
})

.controller('SubjectCtrl', function($scope, $stateParams, DataService) {
  var subject = DataService.getSubject($stateParams.subject);
  $scope.subject = subject;

  $scope.description = subject.description;
  $scope.purpose = subject.purpose;
  $scope.auth = subject.auth;
  $scope.goals = subject.goals;

  $scope.commentlist = Object.keys(subject.comments||{});
  $scope.comment = (subject.comments||{})[$stateParams.comment];
  $scope.commenttype = $stateParams.comment;

  $scope.isFavorite = DataService.isFavorite(subject.code, 'subject');

  $scope.toggleFavorite = function () {
    DataService[($scope.isFavorite ? 'remove' : 'add') + 'Favorite'](subject.code, 'subject');
    $scope.isFavorite = !$scope.isFavorite;
  };
})

.controller('CourseCtrl', function($scope, $stateParams, DataService) {
  var course = DataService.getCourse($stateParams.course);
  $scope.course = course;
  $scope.commentlist = Object.keys(course.comments||{});
  $scope.comment = (course.comments||{})[$stateParams.comment];
  $scope.commenttype = $stateParams.comment;
  $scope.isFavorite = DataService.isFavorite(course.code, 'course');

  $scope.description = course.description;
  $scope.content = course.content;

  $scope.toggleFavorite = function () {
    DataService[($scope.isFavorite ? 'remove' : 'add') + 'Favorite'](course.code, 'course');
    $scope.isFavorite = !$scope.isFavorite;
  };
})
