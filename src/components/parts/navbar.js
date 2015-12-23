/** @jsx React.DOM */

var React = require('react'),
    Navlink = require('./navlink'),
    _ = require('lodash');

var Navbar = React.createClass({
  render: function() {
    return (
      <div className='navbar'>
        <ul className='nav nav-pills navbar-left' role='tablist'>
          {_.map(this.props.links,function(arr,title){
            var arr = [].concat(arr), target = arr[0], params=arr[1]||{};
            return <li key={title}><Navlink to={target} params={params}>{title}</Navlink></li>;
          })}
        </ul>
      </div>
    );
  }
});

module.exports = Navbar;