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
            	<p>
            		Än finns ingen sökfunktion eller annat sånt, det kommer. Men du kan se listor över alla 
            		{' '}<Link to="subjects">ämnen</Link> och <Link to="courses">kurser</Link> och därifrån klicka dig vidare. Tufft, visst? :)
            	</p>
                <h4>Saker att fixa</h4>
                <ul>
                    <li>Lägg till kommentarerna till grundskolans kurser</li>
                    <li>Lägg till grundvuxkurserna</li>
                    <li>Se mindre lamt ut :)</li>
                </ul>
            </div>
        );
    }
});

module.exports = Home;