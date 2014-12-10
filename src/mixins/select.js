/** @jsx React.DOM */

var React = require('react'),
	_ = require('lodash');

module.exports = function(name,opts,instance){
	var construct = function(skip){
		var me=this;
		return (
			<div style={{display:"inline-block"}} className="btn-group clearfix">
			    {_.map(_.without(opts,skip),function(g){
			    	return <button onClick={function(){
			    		me.setState(_.object([name],[g]));
			    	}} className={'btn btn-default'+(g===me.state[name]?' active':'')}>{g}</button>
			    })}
			</div>
		);
	}
	if (instance){
		instance[name] = construct;
		instance.setState(_.object([name],[opts[0]]));
	} else {
		return _.object(["getInitialState",name],[
			function(){return _.object([name],[opts[0]])},
			construct
		]);
	}
};