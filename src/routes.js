/** @jsx React.DOM */

var ReactRouter = require('react-router'),
	App = require('./components/app.js'),
	Home = require('./components/home.js');

module.exports = (
    <ReactRouter.Route handler={App}>
        <ReactRouter.Route name="Home" path="/" handler={Home} />
    </ReactRouter.Route>
);