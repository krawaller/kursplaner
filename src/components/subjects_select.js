/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
  Router = require('react-router'),
  Link = Router.Link,
  Sel = require('../mixins/select');

var SubjectsSelect = React.createClass({
  mixins: [Sel("cat",["grundskoleämnen","gymnasiala vanliga ämnen","gymnasiala yrkesämnen","gymnasiala övriga ämnen"])],
  render: function(){
  	var translator = {"grundskoleämnen":"grundsubjects","gymnasiala yrkesämnen":"subjectsVOCATIONAL","gymnasiala vanliga ämnen":"subjectsCOMMON","gymnasiala övriga ämnen":"subjectsOTHER"},
        DB = this.props.DB,
        subjectnames = DB[translator[this.state.cat]],
        compareto = this.props.compareto;
    function linkToC(d){return <Link to={compareto?"subjectcomparetoother":"subjectdesc"} params={compareto?{subject:compareto,other:d}:{subject:d}}>{DB.subjects[d].name}</Link>;}
    return (
      <div>
        <p>{this.cat()}</p>
        {_.flatten(_.map(subjectnames,function(code){
          return [linkToC(code)," "];
        }))}
      </div>
    );
  }
});

module.exports = SubjectsSelect;
