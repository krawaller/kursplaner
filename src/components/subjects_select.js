/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
  Router = require('react-router'),
  Link = Router.Link,
  favs = require("../favourites.js");

var translator = {
  "grund":"grundsubjects",
  "grundvux":"grundvuxsubjects",
  "gymn": "FOOBAR"
};

var translator2 = {
  "yrkes":"subjectsVOCATIONAL",
  "vanliga":"subjectsCOMMON",
  "övriga":"subjectsOTHER",
  "nedlagda":"subjectsobsolete"
}

var SubjectsSelect = React.createClass({
  getInitialState: function(){
    var hasrelated = this.props.compareto && this.props.DB.subjects[this.props.compareto].friends && this.props.DB.subjects[this.props.compareto].friends.length
    return{
      cat: hasrelated ? "relaterade" : "favoriter",
      hasrelated: hasrelated,
      cat2: "vanliga"
    };
  },
  choose: function(c){ this.setState({cat:c}); },
  choose2: function(c){ this.setState({cat2:c}); },
  render: function(){
    var DB = this.props.DB,
        now = this.state.cat,
        now2 = this.state.cat2,
        compareto = this.props.compareto,
        subjectnames = (
          now === "relaterade"
          ? DB.subjects[compareto].friends
          : now === "favoriter"
          ? favs.getSubjectFavourites()
          : now === "gymn"
          ? DB[translator2[now2]]
          : DB[translator[now]]
        ),
        keys = (this.state.hasrelated?["relaterade"]:[]).concat("favoriter").concat(Object.keys(translator));
    var sel = (
      <span style={{display:"inline-block"}} className="btn-group">
        {_.map(keys,function(g){
          return <button key={g} onClick={_.partial(this.choose,g)} className={'btn btn-default'+(g===now?' active':'')}>{g}</button>
        },this)}
      </span>
    );
    var sel2 = (
      <span style={{display:"inline-block"}} className="btn-group">
        {_.map(Object.keys(translator2),function(g){
          return <button key={g} onClick={_.partial(this.choose2,g)} className={'btn btn-default'+(g===now2?' active':'')}>{g}</button>
        },this)}
      </span>
    );
    function linkToC(d){
      var suffix = "";
      if (now==="relaterade" && DB.subjects[d].school!==DB.subjects[compareto].school){
        suffix = (DB.subjects[d].school ? " ("+DB.subjects[d].school+")" : " (gy)");
      }
      return <Link key={d} to={compareto?"subjectcomparetoother":"subjectdesc"} params={compareto?{subject:compareto,other:d}:{subject:d}}>{DB.subjects[d].name}{suffix}</Link>;
    }
    return (
      <div>
        <p>{sel}{now === "gymn" ? <span> bland {sel2} </span> : null}</p>
        <div className="selectlist">
          {_.flatten(_.map(subjectnames,function(code){
            return [linkToC(code)," "];
          }))}
        </div>
      </div>
    );
  }
});

module.exports = SubjectsSelect;
