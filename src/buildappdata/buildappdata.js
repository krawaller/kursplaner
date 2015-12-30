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
  }).map(function(key){
    return {code:key,name:db[key].name};
  });
}

_.each(master.courses,function(course,code){
  ret.coursesByCode[code] = _.extend(_.pick(course,["name","code"]),{
    description: prerender.courseDescription(code),
    content: prerender.courseContent(code),
    school: course.school || "gymn",
    comments: course.comments,
    judge: _.mapValues(course.judge,function(rows,grade){
      return "<p>"+rows.join("</p><p>")+"</p>";
    })
  });
});

_.each(master.subjects,function(subject,code){
  ret.subjectsByCode[code] = _.extend(_.pick(subject,["name","code"]),{
    description: prerender.subjectDescription(code),
    auth: prerender.subjectAuthorization(code), // TODO - only store for real if special!
    goals: prerender.subjectGoals(code),
    purpose: subject.purpose,
    school: subject.school || "gymn",
    type: subject.type,
    obsolete: subject.obsolete,
    comments: subject.comments ? _.reduce(subject.comments,function(ret,com,type){
      var conv = {ABOUT_THE_SUBJECT:"ämnet",PURPOSE:"syftet",DESCRIPTION:"innehållet",COMPARISON_GY2000:"Gy2000",COMPARISON_GR:"grundskolan"};
      ret[ conv[type] ] = com;
      return ret;
    },{}) : undefined,
    courselinks: subject.courses.map(function(code){
      return {code:code,name:ret.coursesByCode[code].name};
    })
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

ret.sortedgymnsubjectsbytype = {
  yrkes: sortKeysByName(_.pick(ret.subjectsByCode,function(s){
    return s.type === "VOCATIONAL";
  })),
  vanliga: sortKeysByName(_.pick(ret.subjectsByCode,function(s){
    return s.type === "COMMON";
  })),
  vissa: sortKeysByName(_.pick(ret.subjectsByCode,function(s){
    return s.type === "OTHER";
  })),
  nedlagda: sortKeysByName(_.pick(ret.subjectsByCode,function(s){
    return s.obsolete;
  }))
};

fs.writeFile("../app/www/js/data.json",JSON.stringify(ret));
