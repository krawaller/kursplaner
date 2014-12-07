/** @jsx React.DOM */

var React = require('react'),
    Navlink = require('./navlink'),
    _ = require('lodash');

var Navbar = React.createClass({
  render: function() {
    return (
      <div className='navbar navbar-default'>
        <ul className='nav nav-pills navbar-left' role='tablist'>
          {_.map(this.props.links,function(target,title){
            return <li><Navlink to={target}>{title}</Navlink></li>;
          })}
        </ul>
      </div>
    );
  }
});

module.exports = Navbar;