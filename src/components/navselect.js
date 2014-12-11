/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash'),
	Router = require('react-router'),
	State = Router.State,
	Link = Router.Link;

var NavSelect = React.createClass({
	mixins:[State],
	propTypes: {
		opts: React.PropTypes.object.isRequired, // {param:HumanReadable, ...}
		name: React.PropTypes.string.isRequired,
		to: React.PropTypes.string.isRequired,
		params: React.PropTypes.object,
		skip: React.PropTypes.string
	},
	render: function(){
		var p = this.props, opnames = _.without(_.keys(p.opts),p.skip);
		return (
			<div style={{display:"inline-block"}} className="btn-group clearfix">
				{_.map(opnames,function(g){
					var params = _.extend({},p.params||{},_.object([p.name],[g]));
					return <Link to={p.to} params={params} className={"btn btn-default "+(p.params[p.name]===g ? 'active' : '')}>{p.opts[g]}</Link>
				},this)}
			</div>
		);
	}
});

module.exports = NavSelect;