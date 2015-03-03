/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
	_ = require('lodash'),
    diff = require('diff');

var CourseContent = React.createClass({
  decidePrint: function(course){
    var content = course.content;
    return _.isArray(content) ? "<li>"+content.join("</li><li>")+"</li>" : _.reduce(content,function(str,group,headline){
        return str+"<li><h4>"+headline+"</h4><ul><li>"+group.join("</li><li>")+"</li></ul></li>";
    },"");
  },
  comparePrint: function(course,other){
    var me = this.decidePrint(course), him = this.decidePrint(other);
    return _.reduce(diff.diffWords(me,him),function(str,part){
        part.value = part.value.replace(/^>/,"");
        part.value = part.value.replace(/<\/li$/,"</li>");
        if (!part.value.match(/^ *> *$|^ *\\> *$/)){
            if (part.removed){
                console.log("UNIQUE",part.value,"\n");
                str+="<span class='diffunique'>"+part.value+"</span>";
            } else if (!part.added){
                console.log("COMMON",part.value,"\n");
                str+=""+part.value+"";
            }
        }
        return str;
    },"");
  },
  render: function(){
    var course = this.props.course, other = this.props.other;
    return (
        <Section {...this.props} headline="Centralt innehåll">
            <ul dangerouslySetInnerHTML={{__html:other&&false?this.comparePrint(course,other):this.decidePrint(course)}} />
    	</Section>
    );
  }
});

module.exports = CourseContent;
