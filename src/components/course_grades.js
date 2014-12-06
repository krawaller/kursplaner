/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    _ = require('lodash');

var CourseGrades = React.createClass({
  getInitialState: function(){
    return {grade:"e"};
  },
  choose: function(g){
    this.setState({grade:g});
  },
  render: function(){
    var now=this.state.grade;
    var sel = (
      <div style={{display:"inline-block"}} className="btn-group">
        {_.map(["e","c","a"],function(g){
          return <button onClick={_.partial(this.choose,g)} className={'btn btn-default'+(g===now?' active':'')}>{g.toUpperCase()}</button>
        },this)}
      </div>
    );
    return (
        <Section headline="Kunskapskrav">
            <h4>Krav för betyg {sel}</h4>
            {_.map(this.props.grades[now],function(paraf,n){
                return <p key={n} dangerouslySetInnerHTML={{__html:paraf}}/>;
            })}
    	</Section>
    );
  }
});

module.exports = CourseGrades;
