angular.module('app.controllers', [])

.controller('HomeCtrl', function($scope) {

})

.controller('SubjectsCtrl', function($scope, $http, $ionicPopover, $timeout, DataService) {
  $scope.search = { name: '' };

  $ionicPopover.fromTemplateUrl('templates/subjects_filterpopover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.filters = [
    { text: "Inget filter", value: "" },
    { text: "Vanliga", value: "vanliga" },
    { text: "Vissa", value: "vissa" },
    { text: "Yrkes", value: "yrkes" },
    //{ text: "Speciella", value: "d" },
    { text: "Nedlagda", value: "nedlagda" },
  ];

  $scope.filter = {
    value: ''
  };

  $scope.onFilterChange = function () {
    $timeout(function () {
      $scope.popover.hide();
      updateSubjectList();
    }, 200);
  };

  $scope.selectedschool = DataService.getSchool();

  function updateDynamicDescription(){
    var showing = $scope.selectedschool;
    if (showing==="gymn"){
      showing += $scope.filter.value
    }
    var instr = {
      grund: "alla ämnen på grundskolan",
      grundvux: "alla ämmen på grundläggande nivå inom vuxenutbildningen",
      gymn: "samtliga gymnasieämnen",
      gymnvanliga: "samtliga gymnasieämnen klassade som 'vanliga'",
      gymnvissa: "de gymnasieämnen som har särskilda behörighetsregler",
      gymnyrkes: "samtliga gymnasieämnen klassade som yrkesämnen"
    }[showing];
    var searching = $scope.search && $scope.search.name;
    instr = (searching ? "söker bland " : "visar ") + instr;
    instr += " (totalt "+$scope.subjects.length+" st)";
    $scope.instruction = instr;
  }

  $scope.$watch('search.name',updateDynamicDescription);

  function updateSubjectList(){

    // select relevant list from data
    if ($scope.selectedschool !== "gymn" || !$scope.filter.value){
      $scope.subjects = DataService.sortedsubjectsbyschool[$scope.selectedschool];
    } else {
      $scope.subjects = DataService.sortedgymnsubjectsbytype[$scope.filter.value];
    }
    updateDynamicDescription();
  }

  $scope.setSchool = function(type){
    $scope.selectedschool = type;
    DataService.setSchool(type);
    updateSubjectList();
  };

  $scope.clearFilters = function () {
    $scope.filter = { value: '' };
    updateSubjectList();
  };

  updateSubjectList();
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

.controller('SubjectCtrl', function($scope, $stateParams, DataService) {
  var subject = DataService.getSubject($stateParams.subject);
  $scope.subject = subject;

  $scope.courselinks = subject.courselinks;
  $scope.description = subject.description;
  $scope.purpose = subject.purpose;
  $scope.auth = subject.auth;
  $scope.goals = subject.goals;
  $scope.type = subject.type;

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

  $scope.content = course.content;
  $scope.toggleFavorite = function () {
    DataService[($scope.isFavorite ? 'remove' : 'add') + 'Favorite'](course.code, 'course');
    $scope.isFavorite = !$scope.isFavorite;
  };
  var grade = "E";
  $scope.justG = course.judge && course.judge.G;
  $scope.nogrades = Object.keys(course.judge||{}).length === 0;
  $scope.allgrades = course.judge && course.judge.E;
  $scope.getGrade = function(){ return grade; };
  $scope.isGrade = function(g){ return g===grade; };
  $scope.setGrade = function(g){ grade=g; };
})
