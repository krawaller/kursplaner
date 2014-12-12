/** @jsx React.DOM */

var React = require('react'),
  Section = React.createFactory(require('./section'));

var MasterplanGoals = React.createClass({
  render: function(){
  	return (
      <Section headline="Mål och riktlinjer" {...this.props}>
        <div dangerouslySetInnerHTML={{__html:this.props.DB.plans[this.props.params.level].goals}} />
      </Section>
    )
  }
});

module.exports = MasterplanGoals;