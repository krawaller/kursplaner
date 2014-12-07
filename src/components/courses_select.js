/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
  Router = require('react-router'),
  Link = Router.Link;

var CoursesSelect = React.createClass({
  getInitialState: function(){
    return{cat: Object.keys(this.props.DB.coursedict)[0]};
  },
  choose: function(c){
    this.setState({cat:c});
  },
  render: function(){
  	var DB = this.props.DB,
        courses = DB.courses,
        compareto = this.props.compareto,
        now = this.state.cat;
    var sel = (
      <div style={{display:"inline-block"}} className="btn-group">
        {_.map(Object.keys(DB.coursedict).sort(),function(g){
          return <button onClick={_.partial(this.choose,g)} className={'btn btn-default'+(g===now?' active':'')}>{g.toUpperCase()}</button>
        },this)}
      </div>
    );
    function linkToC(d){
      return <Link to={compareto?"comparetoother":"course"} params={compareto?{course:compareto,other:d}:{course:d}}>{DB.courses[d].name}</Link>;
    }
    //console.log("SELSCREEN",now,DB.coursedict[now]);
    return (
      <div>
        {sel}
        <div>
          {_.flatten(_.map(DB.coursedict[this.state.cat],function(s){
            return [linkToC(s)," "];
          }))}
        </div>
      </div>
    )
  }
});

module.exports = CoursesSelect;
