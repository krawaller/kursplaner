/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    _ = require('lodash'),
    //Sel = require('../mixins/select'),
    NavSel = require('./navselect'),
    diff = require('diff');

var CourseGrades = React.createClass({
  //mixins:[Sel('grade',["E","C","A","matris"])],
  decidePrint: function(course,grade){
    var j = course.judge || {};
    var arr = j[grade]||j.G && ["Denna första del av ämnet på grundskolan har endast kunskapskrav för <strong>godtagbara kunskaper</strong>:"].concat(j.G)||["I denna första del av ämnet så saknas kunskapskrav."];
    return "<p>"+arr.join("</p><p>")+"</p>";
  },
  comparePrint: function(course,other,grade){
    var me = this.decidePrint(course,grade),
        him = this.decidePrint(other,grade);
    return _.reduce(diff.diffWords(me,him),function(str,part){
        if (part.value!=='>'){
            if (part.removed){
                str+="<span class='diffunique'>"+part.value+"</span>";
            } else if (!part.added){
                str+="<span>"+part.value+"</span>";
            }
        }
        return str;
    },"");
  },
  render: function(){
    var p = _.extend({},{grade:"E",},this.props.params||{});
    var now=this.props.grade || p.grade; // can be sent as props in compare shit
    var course = this.props.course,
        j = course.judge||{};
    var Grade = (<NavSel to="coursegradessel" params={p} name="grade" opts={{"E":"E","C":"C","A":"A","matris":"matris"}}/>);
    var other = this.props.other;
    return (
        <Section {...this.props}>
            {!this.props.grade && <h3>Kunskapskrav {j.E && <span>för {Grade}</span>}</h3>}
            { now !== "matris" ? (
                <div dangerouslySetInnerHTML={{__html:other&&false?this.comparePrint(course,other,now):this.decidePrint(course,now)}}/>
              ) : _.map(_.range(0,Math.max(j.A.length,j.C.length,j.E.length)),function(n){
                    return (
                      <div key={n} className='row'>
                        <div key="E" className='col-xs-4 padass' dangerouslySetInnerHTML={{__html:j.E[n]}} />
                        <div key="C" className='col-xs-4 padass' dangerouslySetInnerHTML={{__html:j.C[n]}} />
                        <div key="A" className='col-xs-4 padass' dangerouslySetInnerHTML={{__html:j.A[n]}} />
                      </div>
                    );
                })
            }
    	</Section>
    );
  }
});

module.exports = CourseGrades;
