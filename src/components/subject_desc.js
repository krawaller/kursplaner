/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    _ = require("lodash"),
    favs = require("../favourites.js"),
    Commercial = require("./aecommercial.js"),
    prerender = require("../prerender");

var SubjectDesc = React.createClass({
	getInitialState: function(){
		return {isfav: favs.getSubjectState(this.props.subject.code)}
	},
	toggleFav: function(){
		console.log("TOGGLING!",this.props.subject.code);
		favs.toggleSubjectState(this.props.subject.code);
		this.setState({isfav:favs.getSubjectState(this.props.subject.code)});
	},
  render: function(){
    var sub = this.props.subject,
    	isfav = this.state.isfav;
    return (
        <Section headline="Beskrivning" {...this.props}>
        	<div dangerouslySetInnerHTML={{__html:prerender.subjectDescription(sub.code) }}/>
            {!this.props.sub ? <button onClick={this.toggleFav} className={"favvoknapp btn btn-default btn-sm"+(false?" active":"")}>
                {isfav?"Ta bort från favoriter":"Lägg till bland favoriter"}
            </button> : null}
            { !this.props.sub && _.contains(["GRNMAT2","GRGRMAT01","MAT"],sub.code) ? <Commercial/> : null}
        </Section>
    );
  }
});

module.exports = SubjectDesc;
