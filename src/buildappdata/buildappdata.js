var master = require("../../fetch/json/master.json"),
    _ = require("lodash"),
    fs = require("fs"),
    prerender = require("../prerender.jsx");


var ret = {
  coursesByCode: {},
  subjectsByCode: {}
};

_.each(master.courses,function(course,code){
  ret.coursesByCode[code] = _.extend(_.pick(course,["name","code"]),{
    description: prerender.courseDescription(code),
    content: prerender.courseContent(code),
    school: course.school || "gymn"
  });
});

_.each(master.subjects,function(subject,code){
  ret.subjectsByCode[code] = _.extend(_.pick(subject,["name","code"]),{
    description: prerender.subjectDescription(code),
    auth: prerender.subjectAuthorization(code),
    goals: prerender.subjectGoals(code),
    school: subject.school || "gymn"
  });
});

ret.sortedcourses = Object.keys(master.courses).sort(function(c1,c2){
  var n1 = master.courses[c1].name.toLowerCase(),
      n2 = master.courses[c2].name.toLowerCase();
  return n1 > n2 ? 1 : -1;
});

ret.sortedsubjects = Object.keys(master.subjects).sort(function(c1,c2){
  var n1 = master.subjects[c1].name.toLowerCase(),
      n2 = master.subjects[c2].name.toLowerCase();
  return n1 > n2 ? 1 : -1;
});

fs.writeFile("../app/www/js/data.json",JSON.stringify(ret));
