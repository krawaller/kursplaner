/** @jsx React.DOM */

var React = require('react');

var Section = React.createClass({
  getInitialState: function(){
    return {collapsed:false};
  },
  toggle: function(){
    this.setState({collapsed:!this.state.collapsed});
  },
  render: function(){
    var clps = this.state.collapsed;
    return (
        <div>
            {!this.props.sub && this.props.headline && <h3>{this.props.headline}</h3>}
            {this.props.children}
        </div>
    );
  }
});

module.exports = Section;

/*
    var clps = this.state.collapsed;
    return (
        <div>
            <h3><button className={'btn btn-default btn-xs toggler'+(clps?' active':'')} onClick={this.toggle}>{clps?"+":"-"}</button> {this.props.headline}</h3>
            {!clps && this.props.children}
        </div>
*/