/** @jsx React.DOM */

var React = require('react'),
    Navlink = require('./navlink');

var Topbar = React.createClass({
  render: function() {
    return (
      <div className='navbar navbar-default'>
        <p className='navbar-header navbar-brand'>Kurskollen</p>
        <ul className='nav nav-pills navbar-left' role='tablist'>
          <li><Navlink to="home">Start</Navlink></li>
          <li><Navlink to="subjects">Ämnen</Navlink></li>
          <li><Navlink to="courses">Kurser</Navlink></li>
        </ul>
      </div>
    );
  }
});

module.exports = Topbar;