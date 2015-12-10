/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
  Router = require('react-router'),
  Link = Router.Link,
  favs = require("../favourites.js");

var CoursesSelect = React.createClass({
  getInitialState: function(){
    return{cat: this.props.compareto ? "Relaterade kurser" : Object.keys(this.props.DB.coursedict)[0]};
  },
  choose: function(c){
    this.setState({cat:c});
  },
  render: function(){
  	var DB = this.props.DB,
        courses = DB.courses,
        compareto = this.props.compareto,
        thiscourse = courses[compareto],
        now = this.state.cat,
        keys = ["Favoriter","Grundskola","Grundvux"].concat(Object.keys(DB.coursedict).sort()), related=[], compcourse;
    if (compareto){
      keys = ["Relaterade kurser"].concat(keys);
      compcourse = courses[compareto];
      related = compcourse.friends || []; // _.unique(_.without(DB.subjects[compcourse.subject].courses,compareto).concat(compcourse.reqarr||[]).concat(compcourse.reqBy||[]));
      //console.log("COMPARETO",compareto,"RELATED",related,compcourse);
    }
    var sel = (
      <div style={{display:"inline-block"}} className="btn-group">
        {_.map(keys,function(g){
          return <button onClick={_.partial(this.choose,g)} className={'btn btn-default'+(g===now?' active':'')}>{g}</button>
        },this)}
      </div>
    );
    var coursenames = this.state.cat==="Favoriter" ? favs.getCourseFavourites() : DB.coursedict[this.state.cat]||(this.state.cat==="Grundskola"?DB.grundcourses:this.state.cat==="Grundvux"?DB.grundvuxcourses:related)
    function linkToC(d){
      var suffix = "";
      if (now==="Relaterade kurser" && DB.courses[d].school!==DB.courses[compareto].school){
        suffix = (DB.courses[d].school ? " ("+DB.courses[d].school+")" : " (gy)");
      } else if (thiscourse && d === thiscourse.samenamecoursecode){
        suffix = " ("+thiscourse.samenamesubjectname+")";
      }
      return <Link key={d} to={compareto?"coursecomparetoother":"coursedesc"} params={compareto?{course:compareto,other:d}:{course:d}}>{DB.courses[d].name}{suffix}</Link>;
    }
    //console.log("SELSCREEN",now,DB.coursedict[now]);
    return (
      <div>
        <p>{sel}</p>
        <div className="selectlist">
          {_.flatten(_.map(
              coursenames,function(s){
            return [linkToC(s)," "];
          }))}
        </div>
      </div>
    )
  }
});

module.exports = CoursesSelect;
