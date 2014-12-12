/** @jsx React.DOM */

var React = require('react'),
  Section = React.createFactory(require('./section')),
	_ = require('lodash'),
  NavSel = require('./navselect');

var Masterplan = React.createClass({
  render: function(){
    var levels = {"grund":"grundskolan","vux":"komvux","gymn":"gymnasiet"};
    var p = _.extend({},{
      level:"grund",
      part:"mission"
    },this.props.params||{});
    p.other = p.other || {grund:"gymn","gymn":"vux","vux":"gymn"}[p.level];

    var Part = <NavSel to="masterplancomp" params={p} name="part" opts={{"mission":"värdegrund och uppdrag","goals":"mål och riktlinjer"}}/>;
    var Other = <NavSel to="masterplancomp" params={p} name="other" opts={_.omit(levels,p.level)}/>;

    var plans = this.props.DB.plans;
  	return (
      <Section headline={<span>Jämför {Part} med {Other}</span>} {...this.props}>
        <div className="row">
          <div className="col-xs-6">
            <h4>{levels[p.level]}</h4>
            <div dangerouslySetInnerHTML={{__html:plans[p.level][p.part]}} />
          </div>
          <div className="col-xs-6">
            <h4>{levels[p.other]}</h4>
            <div dangerouslySetInnerHTML={{__html:plans[p.other][p.part]}} />
          </div>
        </div>
      </Section>
    )
  }
});

module.exports = Masterplan;