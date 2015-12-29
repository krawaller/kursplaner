angular.module('app.services', [])

.service('DataService', [function(){
  console.log('dataservice')
  var request = new XMLHttpRequest();
  request.open('GET', 'js/master.json', false);
  request.send(null);

  var data = JSON.parse(request.responseText);
  console.log('data', data);

  this.getSubjects = function () {
    return data.gysubjects.map(function (subjectKey) {
      return data.subjects[subjectKey];
    }).sort(function (a, b) {
      return a.name > b.name ? 1 : (a.name == b.name ? 0 : -1);
    });
  };


  this.getCourses = function () {
    return data.gycourses.map(function (subjectKey) {
      return data.courses[subjectKey];
    }).sort(function (a, b) {
      return a.name > b.name ? 1 : (a.name == b.name ? 0 : -1);
    });
  };

  this.getCourse = function (code) {
    return data.courses[code];
  };

  this.getSubject = function (code) {
    return data.subjects[code];
  };
}]);

