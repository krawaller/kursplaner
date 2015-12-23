/** @jsx React.DOM */

var React = require('react'),
    Router = require('react-router'),
    RouteHandler = React.createFactory(Router.RouteHandler),
    Navbar = require('./parts/navbar');

var Wrapper = React.createClass({
    render: function() {
        return (
            <div className="wrapper">
                <Navbar links={{Hem:"home","Ämnesplaner":"subjects",Kursplaner:"courses"}}/>
                <div className="topnav">
                    <RouteHandler {...this.props} />
                </div>
            </div>
        );
    }
});

module.exports = Wrapper;
