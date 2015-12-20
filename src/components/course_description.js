/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    Router = require('react-router'),
    Link = Router.Link,
    _ = require('lodash'),
    favs = require("../favourites.js"),
    Commercial = require("./aecommercial");

var CourseDescription = React.createClass({
  getInitialState: function(){
    return {isfav: favs.getCourseState(this.props.course.code)}
  },
  toggleFav: function(){
    console.log("TOGGLING!",this.props.course.code);
    favs.toggleCourseState(this.props.course.code);
    this.setState({isfav:favs.getCourseState(this.props.course.code)});
  },
  render: function(){
    var course = this.props.course,
        subject = this.props.subject,
        tot = subject.courses.length,
        nums = [0,0,"två","tre","fyra","fem","sex","sju","åtta","nio","tio","elva","tolv","tretton","fjorton","femton"],
        desc = course.descarr,
        remnotwith = course.remotenotwitharr,
        by = course.reqBy,
        DB = this.props.DB,
        isfav = this.state.isfav;
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
    return (
        <Section {...this.props} headline="Beskrivning">
            <div>
            {
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
                  {course.hasreqs || course.notwitharr ? <p className="mapcontainer">
                      <img src={"./img/"+course.code+".png"}/>
                  </p>:null}
                </div>
              )
            }
            { !this.props.sub ? <button onClick={this.toggleFav} className={"favvoknapp btn btn-default btn-sm"+(false?" active":"")}>
              {isfav?"Ta bort från favoriter":"Lägg till bland favoriter"}
            </button> : null }
            { !this.props.sub && _.contains(["GRNMAT2","GRGRMAT01","MAT"],subject.code) ? <Commercial/> : null}
            </div>
        </Section>
    );
  }
});

module.exports = CourseDescription;
