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
        {_.map(["e","c","a","matris"],function(g){
          return <button onClick={_.partial(this.choose,g)} className={'btn btn-default'+(g===now?' active':'')}>{g.toUpperCase()}</button>
        },this)}
      </div>
    );
    var course = this.props.course,
        j = course.judge,
        rows = Math.max(j.a.length,j.c.length,j.e.length);
    return (
        <Section headline="Kunskapskrav" {...this.props}>
            <h4>Visar {sel}</h4>
            { now !== "matris" ? (
                _.map(course.judge[now],function(paraf,n){
                    return <p key={n} dangerouslySetInnerHTML={{__html:paraf}}/>;
                })
              ) : _.map(_.range(0,rows),function(n){
                    return (
                      <div key={n} className='row'>
                        <div key="e" className='col-xs-4 padass' dangerouslySetInnerHTML={{__html:j.e[n]}} />
                        <div key="c" className='col-xs-4 padass' dangerouslySetInnerHTML={{__html:j.c[n]}} />
                        <div key="a" className='col-xs-4 padass' dangerouslySetInnerHTML={{__html:j.a[n]}} />
                      </div>
                    )
                })
            }
    	</Section>
    );
  }
});

module.exports = CourseGrades;
