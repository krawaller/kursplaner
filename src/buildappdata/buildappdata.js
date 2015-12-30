var master = require("../../fetch/json/master.json"),
    _ = require("lodash"),
    fs = require("fs"),
    prerender = require("../prerender.jsx");


var ret = {
  coursesByCode: {},
  subjectsByCode: {}
};

function sortKeysByName(db){
  return Object.keys(db).sort(function(c1,c2){
    var n1 = db[c1].name.toLowerCase(),
        n2 = db[c2].name.toLowerCase();
    return n1 > n2 ? 1 : -1;
  });
}

_.each(master.courses,function(course,code){
  ret.coursesByCode[code] = _.extend(_.pick(course,["name","code"]),{
    description: prerender.courseDescription(code),
    content: prerender.courseContent(code),
    school: course.school || "gymn",
    comments: course.comments
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

ret.sortedcourses = sortKeysByName(ret.coursesByCode);
ret.sortedsubjects = sortKeysByName(ret.subjectsByCode);
ret.sortedcoursesbyschool = ["gymn","grund","grundvux"].reduce(function(mem,school){
  mem[school] = sortKeysByName(_.omit(ret.coursesByCode,function(c){
    return c.school !== school;
  }));
  return mem;
},{});
ret.sortedsubjectsbyschool = ["gymn","grund","grundvux"].reduce(function(mem,school){
  mem[school] = sortKeysByName(_.omit(ret.subjectsByCode,function(s){
    return s.school !== school;
  }));
  return mem;
},{});

fs.writeFile("../app/www/js/data.json",JSON.stringify(ret));
