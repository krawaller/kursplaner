/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
  Router = require('react-router'),
  Link = Router.Link;

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
        now = this.state.cat,
        keys = Object.keys(DB.coursedict).sort(), related=[], compcourse;
    if (compareto){
      keys = ["Relaterade kurser"].concat(keys);
      compcourse = courses[compareto];
      related = _.unique(_.without(DB.subjects[compcourse.subject].courses,compareto).concat(compcourse.reqarr||[]).concat(compcourse.reqBy||[]));
      //console.log("COMPARETO",compareto,"RELATED",related,compcourse);
    }
    var sel = (
      <div style={{display:"inline-block"}} className="btn-group">
        {_.map(keys,function(g){
          return <button onClick={_.partial(this.choose,g)} className={'btn btn-default'+(g===now?' active':'')}>{g.toUpperCase()}</button>
        },this)}
      </div>
    );
    function linkToC(d){
      return <Link to={compareto?"coursecomparetoother":"course"} params={compareto?{course:compareto,other:d}:{course:d}}>{DB.courses[d].name}</Link>;
    }
    //console.log("SELSCREEN",now,DB.coursedict[now]);
    return (
      <div>
        {sel}
        <div>
          {_.flatten(_.map(DB.coursedict[this.state.cat]||related,function(s){
            return [linkToC(s)," "];
          }))}
        </div>
      </div>
    )
  }
});

module.exports = CoursesSelect;
