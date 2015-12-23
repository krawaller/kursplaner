/** @jsx React.DOM */

var React = require("react"),
	_ = require("lodash");

var ColumnList = React.createClass({
	render: function(){
		var names = this.props.list,
			linker = this.props.fn,
			percol = names.length / 3,
		    col1 = names.slice(0,Math.ceil(percol)),
		    col2 = names.slice(Math.ceil(percol),2*Math.ceil(percol)),
		    col3 = names.slice(2*Math.ceil(percol),names.length);
		return (<div>
	        <div className="subcol">
	          {_.flatten(_.map(col1,function(code){
	            return [linker(code)," "];
	          }))}
	        </div>
	        <div className="subcol">
	          {_.flatten(_.map(col2,function(code){
	            return [linker(code)," "];
	          }))}
	        </div>
	        <div className="subcol">
	          {_.flatten(_.map(col3,function(code){
	            return [linker(code)," "];
	          }))}
	        </div>
      </div>);
	}
});

module.exports = ColumnList;