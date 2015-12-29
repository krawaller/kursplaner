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

.controller('SettingsCtrl', function($scope) {
  $scope.choice = 'gymnasie';
})

.controller('SubjectCtrl', function($scope, $stateParams, DataService) {
  var subject = DataService.getSubject($stateParams.subject);
  $scope.subject = subject
  $scope.description = subject.description
})

.controller('CourseCtrl', function($scope, $stateParams, DataService) {
  $scope.course = DataService.getCourse($stateParams.course);
})
