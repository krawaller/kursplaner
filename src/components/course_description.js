/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    _ = require('lodash'),
    favs = require("../favourites.js"),
    Commercial = require("./aecommercial"),
    prerender = require("../prerender");

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
        isfav = this.state.isfav;
    return (
        <Section {...this.props} headline="Beskrivning">
            <div key={course.code}>
              <div dangerouslySetInnerHTML={{__html:prerender.courseDescription(course.code) }}/>
              {!this.props.sub && (course.hasreqs || course.notwitharr) ? <p className="mapcontainer">
                  <img src={"./img/"+course.code+".png"}/>
              </p>:null}
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
