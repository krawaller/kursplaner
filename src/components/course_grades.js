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
    var course = this.props.course;
    return (
        <Section headline="Kunskapskrav">
            <h4>Visar {sel}</h4>
            { now !== "matris" ? (
                _.map(course.judge[now],function(paraf,n){
                    return <p key={n} dangerouslySetInnerHTML={{__html:paraf}}/>;
                })
              ) : (
                <div className='row'>
                  {_.map(course.judge,function(content,grade){
                    return (
                      <div key={grade} className='col-sm-4'>
                        {_.map(content,function(paraf,n){
                            return <p key={n} dangerouslySetInnerHTML={{__html:paraf}}/>;
                        })}
                      </div>
                    )
                  })}
                </div>
              )
            }
    	</Section>
    );
  }
});

module.exports = CourseGrades;
