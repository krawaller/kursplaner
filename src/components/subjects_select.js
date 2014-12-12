/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
  Router = require('react-router'),
  Link = Router.Link;

var translator = {"grundskoleämnen":"grundsubjects","gymn. yrkesämnen":"subjectsVOCATIONAL","gymn. vanliga ämnen":"subjectsCOMMON","gymn. övriga ämnen":"subjectsOTHER"};

var SubjectsSelect = React.createClass({
  getInitialState: function(){
    var hasrelated = this.props.compareto && this.props.DB.subjects[this.props.compareto].friends
    return{cat: hasrelated ? "relaterade ämnen" : "grundskoleämnen", hasrelated:hasrelated};
  },
  choose: function(c){
    this.setState({cat:c});
  },
  render: function(){
    var DB = this.props.DB,
        now = this.state.cat,
        compareto = this.props.compareto,
        subjectnames = (now === "relaterade ämnen" ? DB.subjects[compareto].friends : DB[translator[now]]),
        keys = (this.state.hasrelated?["relaterade ämnen"]:[]).concat(Object.keys(translator));
    var sel = (
      <div style={{display:"inline-block"}} className="btn-group">
        {_.map(keys,function(g){
          return <button onClick={_.partial(this.choose,g)} className={'btn btn-default'+(g===now?' active':'')}>{g}</button>
        },this)}
      </div>
    );
    function linkToC(d){
      var suffix = "";
      if (now==="relaterade ämnen" && DB.subjects[d].school!==DB.subjects[compareto].school){
        suffix = (DB.subjects[d].school === "grund" ? " (grund)" : " (gy)");
      }
      return <Link to={compareto?"subjectcomparetoother":"subjectdesc"} params={compareto?{subject:compareto,other:d}:{subject:d}}>{DB.subjects[d].name}{suffix}</Link>;
    }
    return (
      <div>
        <p>{sel}</p>
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
