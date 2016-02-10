angular.module('app.services', [])


.factory('DataService', [function(){

  var request = new XMLHttpRequest();
  request.open('GET', 'js/data.json', false);
  request.send(null);

  var data = JSON.parse(request.responseText);


  var schooltype = localStorage.getItem('schooltype') || "gymn";

  return {
    sortedsubjects: data.sortedsubjects,
    sortedsubjectsbyschool: data.sortedsubjectsbyschool,
    sortedgymnsubjectsbytype: data.sortedgymnsubjectsbytype,
    sortedcourses: data.sortedcourses,
    sortedcoursesbyschool: data.sortedcoursesbyschool,
    listAllSubjects: function () {
      return data.sortedsubjects;
      /*return data.gysubjects.map(function (subjectKey) {
        return data.subjects[subjectKey];
      }).sort(function (a, b) {
        return a.name > b.name ? 1 : (a.name == b.name ? 0 : -1);
      });*/
    },
    listAllCourses: function () {
      return data.sortedcourses;
      /*return data.gycourses.map(function (subjectKey) {
        return data.courses[subjectKey];
      }).sort(function (a, b) {
        return a.name > b.name ? 1 : (a.name == b.name ? 0 : -1);
      });*/
    },
    getCourse: function (code) {
      return data.coursesByCode[code];
    },
    getSubject: function (code) {
      return data.subjectsByCode[code];
    },
    setSchool: function(type){
      schooltype = type;
      localStorage.setItem('schooltype',type);
    },
    getSchool: function(){
      return schooltype;
    }
  };
}])



.factory('FavouriteService', ["DataService",function(DataService){

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

  return {
    getFavorites: function () {
      return {
        courses: favorites.courses.map(function (code) {
          return DataService.getCourse(code);
        }),
        subjects: favorites.subjects.map(function (code) {
          return DataService.getSubject(code);
        })
      };
    },
    isFavorite: function (code, type) {
      return favorites[type + 's'].indexOf(code) !== -1;
    },
    addFavorite: function (code, type) {
      var index = favorites[type + 's'].indexOf(code);
      if (index === -1) favorites[type + 's'].push(code);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    },
    removeFavorite: function (code, type) {
      var index = favorites[type + 's'].indexOf(code);
      if (index !== -1) favorites[type + 's'].splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  };

}]);

