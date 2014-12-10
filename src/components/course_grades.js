/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    _ = require('lodash'),
    Sel = require('../mixins/select');

var CourseGrades = React.createClass({
  mixins:[Sel('grade',["E","C","A"])],
  render: function(){
    var now=this.props.grade || this.state.grade;
    var course = this.props.course,
        j = course.judge,
        rows = Math.max(j.A.length,j.C.length,j.E.length);
    return (
        <Section headline="Kunskapskrav" {...this.props}>
            {!this.props.grade && <h4>Visar {this.grade()}</h4>}
            { now !== "matris" ? (
                _.map(course.judge[now],function(paraf,n){
                    return <p key={n} dangerouslySetInnerHTML={{__html:paraf}}/>;
                })
              ) : _.map(_.range(0,rows),function(n){
                    return (
                      <div key={n} className='row'>
                        <div key="E" className='col-xs-4 padass' dangerouslySetInnerHTML={{__html:j.E[n]}} />
                        <div key="C" className='col-xs-4 padass' dangerouslySetInnerHTML={{__html:j.C[n]}} />
                        <div key="A" className='col-xs-4 padass' dangerouslySetInnerHTML={{__html:j.A[n]}} />
                      </div>
                    )
                })
            }
    	</Section>
    );
  }
});

module.exports = CourseGrades;
