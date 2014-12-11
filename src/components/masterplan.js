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
      action:"read",
      part:"mission"
    },this.props.params||{});
    p.other = (p.action!=="compare" ? "_" : (p.other && p.other !== p.level && p.other !== "_" ? p.other : _.without(_.keys(levels),p.level)[0]));
    var Level = <NavSel to="masterplancomp" params={p} name="level" opts={levels}/>;
    var Part = <NavSel to="masterplancomp" params={p} name="part" opts={{"mission":"värdegrund och uppdrag","goals":"mål och riktlinjer"}}/>;
    var Action = <NavSel to="masterplancomp" params={p} name="action" opts={{"read":"Läs","compare":"Jämför"}}/>;
    var Other = <NavSel to="masterplancomp" params={p} name="other" opts={_.omit(levels,p.level)}/>;
    var h = <span>{Action} {Part} för {Level} {p.action!=="read" ? ["och",Other] : ""}</span>;
    var plans = this.props.DB.plans;
  	return (
      <Section headline={h} {...this.props}>
        {
          p.action === "compare" ? (
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
          ) : (
            <div dangerouslySetInnerHTML={{__html:plans[p.level][p.part]}} />
          )
        }
      </Section>
    )
  }
});

module.exports = Masterplan;