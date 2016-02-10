angular.module('app.services', [])


.factory('SchoolService',function(){
  var schooltype = localStorage.getItem('schooltype') || "gymn";
  return {
    setSchool: function(type){
      schooltype = type;
      localStorage.setItem('schooltype',type);
    },
    getSchool: function(){
      return schooltype;
    }
  }
})


.factory('DataService', function(){

  var request = new XMLHttpRequest();
  request.open('GET', 'js/data.json', false);
  request.send(null);

  var data = JSON.parse(request.responseText);

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
    }
  };
})



.factory('FavouriteService', ["DataService",function(DataService){

  var favourites;

  try {
    favourites = JSON.parse(localStorage.getItem('favourites'));
  } catch (error) {}
  if (!favourites) {
    favourites = {
      courses: [],
      subjects: []
    };
  }

  return {
    getFavourites: function () {
      return {
        courses: favourites.courses.map(function (code) {
          return DataService.getCourse(code);
        }),
        subjects: favourites.subjects.map(function (code) {
          return DataService.getSubject(code);
        })
      };
    },
    isFavourite: function (code, type) {
      return favourites[type + 's'].indexOf(code) !== -1;
    },
    addFavourite: function (code, type) {
      var index = favourites[type + 's'].indexOf(code);
      if (index === -1) favourites[type + 's'].push(code);
      localStorage.setItem('favourites', JSON.stringify(favourites));
    },
    removeFavourite: function (code, type) {
      var index = favourites[type + 's'].indexOf(code);
      if (index !== -1) favourites[type + 's'].splice(index, 1);
      localStorage.setItem('favourites', JSON.stringify(favourites));
    }
  };

}]);

