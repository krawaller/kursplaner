angular.module('app.services', [])

.service('DataService', [function(){
  console.log('dataservice')
  var request = new XMLHttpRequest();
  request.open('GET', 'js/data.json', false);
  request.send(null);

  var data = JSON.parse(request.responseText);
  console.log('data', data);

  var favorites;
  try {
    favorites = JSON.parse(localStorage.getItem('favorites'));
  } catch (error) {}
  if (!favorites) {
    favorites = {
      courses: [],
      subjects: []
    };
  }

  this.sortedsubjects = data.sortedsubjects;

  this.sortedsubjectsbyschool = data.sortedsubjectsbyschool;

  this.sortedgymnsubjectsbytype = data.sortedgymnsubjectsbytype;

  this.sortedcourses = data.sortedcourses;

  this.sortedcoursesbyschool = data.sortedcoursesbyschool;

  this.listAllSubjects = function () {
    return sortedsubjects;
    return data.gysubjects.map(function (subjectKey) {
      return data.subjects[subjectKey];
    }).sort(function (a, b) {
      return a.name > b.name ? 1 : (a.name == b.name ? 0 : -1);
    });
  };


  this.listAllCourses = function () {
    return sortedcourses;
    return data.gycourses.map(function (subjectKey) {
      return data.courses[subjectKey];
    }).sort(function (a, b) {
      return a.name > b.name ? 1 : (a.name == b.name ? 0 : -1);
    });
  };

  this.getCourse = function (code) {
    return data.coursesByCode[code];
  };

  this.getSubject = function (code) {
    return data.subjectsByCode[code];
  };

  this.getFavorites = function () {
    return {
      courses: favorites.courses.map(function (code) {
        return data.coursesByCode[code];
      }),
      subjects: favorites.subjects.map(function (code) {
        return data.subjectsByCode[code];
      })
    };
  };

  this.isFavorite = function (code, type) {
    return favorites[type + 's'].indexOf(code) !== -1;
  };

  this.addFavorite = function (code, type) {
    var index = favorites[type + 's'].indexOf(code);
    if (index === -1) favorites[type + 's'].push(code);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  this.removeFavorite = function (code, type) {
    var index = favorites[type + 's'].indexOf(code);
    if (index !== -1) favorites[type + 's'].splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };


  var schooltype = localStorage.getItem('schooltype') || "gymn";

  this.setSchool = function(type){
    schooltype = type;
    localStorage.setItem('schooltype',type);
  };

  this.getSchool = function(){
    return schooltype;
  };

}]);
