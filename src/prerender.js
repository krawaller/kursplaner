/** @jsx React.DOM */

var React = require("React"),
    _ = require('lodash'),
    DB = require('../fetch/json/master.json');

module.exports = {
    courseContent: function(code){
        var course = DB.courses[code],
            content = course.content;
        return "<ul>" + (_.isArray(content) ? "<li>"+content.join("</li><li>")+"</li>" : _.reduce(content,function(str,group,headline){
            return str+"<li><h4>"+headline+"</h4><ul><li>"+group.join("</li><li>")+"</li></ul></li>";
        },"") ) + "</ul>";
    },
    courseGoals: function(code){
        var course = DB.courses[code],
            subject = DB.subjects[course.subject];
        return React.renderToStaticMarkup(<div>
            <p>
                {course.school==="grund"
                ? "På grundskolan så jobbar man hela tiden med ämnets samtliga mål: "
                : course.excludesgoals
                ? "Ej ingående ämnesmål visas överstrykna. "
                : subject.courses.length===1
                ? "Eftersom denna kurs är ensam i sitt ämne så täcker den samtliga ämnesmål. "
                : subject.someexcludes
                ? "Denna kurs täcker samtliga ämnesmål. "
                : "Liksom alla övriga kurser i ämnet så täcker denna kurs samtliga ämnesmål. "}
                {course.focusesgoals ? " Mål som kursen fokuserar på visas i fetstil. " : ""}
            </p>
            <ol>
                {subject.goals.map(function(goal,n){
                    return <li key={"goal"+n} className={"goal-"+["notused","used","focus"][course.goals[n]]}>{goal}</li>;
                })}
            </ol>
            {course.level==="basic"?<p>I kursen behandlas <strong>grundläggande</strong> kunskaper i ämnet.</p>
            :course.level==="high"?<p>I kursen behandlas <strong>fördjupade</strong> kunskaper i ämnet.</p>:''}
        </div>);
    },
    courseDescription: function(code){
        var course = DB.courses[code],
            subject = DB.subjects[course.subject],
            tot = subject.courses.length,
            nums = [0,0,"två","tre","fyra","fem","sex","sju","åtta","nio","tio","elva","tolv","tretton","fjorton","femton"],
            desc = course.descarr,
            remnotwith = course.remotenotwitharr,
            by = course.reqBy;
        function linkToC(d,t){return <Link to="coursedesc" params={{course:d}}>{t || DB.courses[d].name}</Link>;}
        function linkToS(d){return <Link to="subjectdesc" params={{subject:d}}>{DB.subjects[d].name}</Link>;}
        function list(courses){
          var l = courses.length;
          return _.reduce(courses,function(mem,cid,n){
            mem.push(linkToC(cid));
            if (n === l-1){
              mem.push(".");
            } else if (n === l-2){
              mem.push(" och ");
            } else {
              mem.push(", ");
            }
            return mem;
          },[]);
        }
        console.log("STATIC",course.code)
        return React.renderToStaticMarkup(<div> {
          course.school === "grund" ? (
            <p>
              {course.name} utgör en av {nums[tot]} delar av grundskoleämnet {linkToS(subject.code)}.
              Normalt skiljer man inte mellan kurser och ämnen på grundskolan, men eftersom det finns specifikt centralt innehåll och kunskapskrav för de olika stadierna inom grundskolans ämnen så har vi valt att hantera dessa som kurser, för att matcha strukturen på gymnasienivå.
            </p>
          ) : (
            <div>
              { course.obsolete ? <p className="obsolete">
                Denna kurs tillhör ett ämne som inte längre ges och är därför ej aktuell.
              </p> : null}
              <p>
                {course.school === "grundvux" ? "Grundvuxkursen" : "Gymnasiekursen"} {course.name} har kod <strong>{course.code}</strong> och är på <strong>{course.points}</strong> poäng. Den är {tot===1?"enda kursen":"en av "+(nums[tot]||tot)+" kurser "} i ämnet {linkToS(subject.code)}.
                {desc && [" "].concat(desc.map(function(d){
                  return DB.courses[d]?linkToC(d):d;
                }))}
                {remnotwith ? remnotwith.length === 1 ? <span>{' '}
                  I kursplanen för {linkToC(remnotwith[0])} så står det att den inte får ingå i examen tillsammans med {course.name}.
                </span> : <span>{' '}
                  I kursplanerna för {list(remnotwith)} så står det att de inte får ingå i examen tillsammans med {course.name}.
                </span>: null}
                {by && [" Kursen ingår i förkunskapskraven för "].concat(_.reduce(by,function(m,part,n){
                  return m.concat([linkToC(part)].concat(n===by.length-1?[]:n===by.length-2?[" och "]:[", "]));
                },[])).concat([". "])}
              </p>
              {course.novux ? (subject.courses.length === 1 ? <p>
                Denna kurs får ej ges inom vuxenutbildningen.
              </p> : <p>
                Liksom övriga kurser i {linkToS(subject.code)} så får denna kurs ej ges inom vuxenutbildningen.
              </p>) : null}

            </div>
          )
        }
        </div>);
    }
};