/** @jsx React.DOM */

var React = require('react'),
  _ = require('lodash'),
  Router = require('react-router'),
  State = Router.State,
  Link = Router.Link;

var NavSelectPath = React.createClass({
  mixins:[State],
  propTypes: {
    links: React.PropTypes.object.isRequired, // {human:path, ...}
  },
  render: function(){
    return (
      <div style={{display:"inline-block"}} className="btn-group clearfix">
        {_.map(this.props.links,function(path,title){
          return <Link key={path} to={path} className={"btn btn-sm btn-default "+(path===this.props.active ? 'active' : '')}>{title}</Link>
        },this)}
      </div>
    );
  }
});

module.exports = NavSelectPath;