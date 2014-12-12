/** @jsx React.DOM */

var React = require('react'),
  Section = React.createFactory(require('./section'));

var MasterplanMission = React.createClass({
  render: function(){
  	return (
      <Section headline="Värdegrund och uppdrag" {...this.props}>
        <div dangerouslySetInnerHTML={{__html:this.props.DB.plans[this.props.params.level].mission}} />
      </Section>
    )
  }
});

module.exports = MasterplanMission;