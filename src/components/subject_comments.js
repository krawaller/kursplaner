/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    _ = require('lodash'),
    NavSelPath = require('./parts/navselpath');

    var names = {ABOUT_THE_SUBJECT:"ämnet",PURPOSE:"syftet",DESCRIPTION:"innehållet",COMPARISON_GY2000:"Gy2000",COMPARISON_GR:"grund"};

var SubjectComments = React.createClass({
  render: function(){
    var subject = this.props.subject,
        ctypes = Object.keys(this.props.subject.comments),
        base = "/subjects/"+subject.code+"/comments",
        now = this.props.params.ctype || ctypes[0];

    var paths = _.reduce(ctypes,function(mem,ctype,n){
      mem[names[ctype]] = n ? base+"/"+ctype : base;
      return mem;
    },{});

    var sel = ctypes.length>1?<NavSelPath links={paths} active={paths[names[now]]}/>:names[now];
    return (
      <Section headline={["Kommentar till"," ",sel]}>
        <div dangerouslySetInnerHTML={{__html:subject.comments[now]}}/>
      </Section>
    );
  }
});

module.exports = SubjectComments;
