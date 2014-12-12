/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    _ = require('lodash'),
    Sel = require('../mixins/select');

var CourseGrades = React.createClass({
  mixins:[Sel('grade',["E","C","A","matris"])],
  render: function(){
    var now=this.props.grade || this.state.grade;
    var course = this.props.course,
        j = course.judge||{};
    return (
        <Section {...this.props}>
            {!this.props.grade && <h3>Kunskapskrav {j.E && <span>för {this.grade()}</span>}</h3>}
            { now !== "matris" ? (
                _.map(j[now]||j.G && ["Denna första del av ämnet på grundskolan har endast kunskapskrav för <strong>godtagbara kunskaper</strong>:"].concat(j.G)||["I denna första del av ämnet på grundskolan så saknas kunskapskrav."],function(paraf,n){
                    return <p key={n} dangerouslySetInnerHTML={{__html:paraf}}/>;
                })
              ) : _.map(_.range(0,Math.max(j.A.length,j.C.length,j.E.length)),function(n){
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
