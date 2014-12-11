/** @jsx React.DOM */

//The purpose of this component is to make sure the <li> link element gets the `active` class
//as expected by bootstrap. See explanation [here](https://github.com/rackt/react-router/blob/master/docs/api/mixins/ActiveState.md)

var React = require('react');
var Link = require('react-router').Link;
var State = require('react-router').State;

var Navlink = React.createClass({
  mixins: [ State ],
  render: function() {
  	var Tag = React.DOM[this.props.tag || "li"];
    var className = (this.props.linkClasses || '')+(this.isActive(this.props.to, this.props.params, this.props.query) ? 'active' : '');
    return <Tag className={className}>{Link(this.props)}</Tag>;
  }
});

module.exports = Navlink;