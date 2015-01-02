/** @jsx React.DOM */

var React = require('react'),
	Router = require('react-router'),
  	Link = Router.Link;

var Home = React.createClass({
    render: function() {
        return (
        	<div>
            	<h2>Home sweet home</h2>
            	<p>Välkomna till kurskollen, siten som tillhandahåller Skolverkets ämnesplaner på ett mindre asjobbigt sätt!</p>
            	<p>Den är långtifrån klar och det finns många vassa kanter, men redan nu kan du förhoppningsvis ha glädje av att enkelt kunna navigera styrdokumenten!</p>
            	<p>Hittar du något som är knas eller får tankar om förbättringar, släng iväg ett mail till <a href="mailto:david@krawaller.se">David</a>!</p>
                <h4>Saker att fixa</h4>
                <ul>
                    <li>Lägg till kommentarerna till grundskolans kurser</li>
                    <li>Lägg till kommentarerna till kurserna på grundvux</li>
                    <li>Klä siten i snyggare skrud :)</li>
                </ul>
            </div>
        );
    }
});

module.exports = Home;