/** @jsx React.DOM */

var React = require('react'),
  Section = React.createFactory(require('./section')),
	_ = require('lodash'),
  Link = require('react-router').Link;

var Masterplans = React.createClass({
  render: function(){
  	return (
      <Section headline="Läroplaner">
        <p>Bla bla mitt upplägg</p>
        <ul>
          <li><Link to="masterplanmission" params={{level:"grund"}}>Grundskolan</Link></li>
          <li><Link to="masterplanmission" params={{level:"gymn"}}>Gymnasieskolan</Link></li>
          <li><Link to="masterplanmission" params={{level:"vux"}}>Vuxenutbildningen</Link></li>
        </ul>
      </Section>
    )
  }
});

module.exports = Masterplans;