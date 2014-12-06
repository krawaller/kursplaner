/** @jsx React.DOM */

var React = require('react'),
	ReactRouter = require('react-router'),
	routes = require('./routes'),
	DB = require('../fetch/json/master.json');

Object.assign = Object.assign || require('object-assign');

ReactRouter.run(routes, function(Handler, state) {
    React.render(<Handler DB={DB} params={state.params} />, document.body);
});