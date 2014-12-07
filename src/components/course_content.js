/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
	_ = require('lodash');

var CourseContent = React.createClass({
  render: function(){
    var content = this.props.course.content;
    return (
        <Section headline="Centralt innehåll">
            <ul>
                {_.isArray(content) ? content.map(function(c,n){
                    return <li key={n}>{c}</li>;
                }) : _.map(content,function(group,headline){
                    return (
                        <div key={headline}>
                            <h4>{headline}</h4>
                            <ul>
                                {group.map(function(c,n){return <li key={n}>{c}</li>;})}
                            </ul>
                        </div>
                    )
                })}
            </ul>
    	</Section>
    );
  }
});

module.exports = CourseContent;
