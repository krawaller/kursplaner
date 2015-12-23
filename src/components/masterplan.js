/** @jsx React.DOM */

var React = require('react'),
  Section = React.createFactory(require('./section')),
  NavBar = require('./parts/navbar'),
  RouteHandler = require('react-router').RouteHandler;

var Masterplan = React.createClass({
  render: function(){
    var code = this.props.params.level;
    var names = {"grund":"grundskolan","vux":"vuxenutbildningen","gymn":"gymnasiet"};
    var links = {
      "Värdegrund och uppdrag": ["masterplanmission",{level:code}],
      "Mål och riktlinjer": ["masterplangoals",{level:code}],
      "Jämför": ["masterplancompdefault",{level:code}]
    };
  	return !names[code] ? <p>Hittar ingen nivå med benämning {code}!</p> : (
      <div>
        <h2>Läroplan för {names[code]}</h2>
        <NavBar links={links}/>
        <RouteHandler {...this.props} />
      </div>
    );
  }
});

module.exports = Masterplan;