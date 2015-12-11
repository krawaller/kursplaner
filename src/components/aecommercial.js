/** @jsx React.DOM */

var React = require('react'),
  favs = require("../favourites.js");


var Commercial = React.createClass({
  getInitialState: function(){
    return {
      shouldhide: favs.hasDismissedAE()
    };
  },
  dismiss: function(){
    if (confirm("Säkert att vi ska ta bort tipset? Lovar du att du kommer ihåg att kolla in appen då? Den är verkligen tuff! :)")){
      favs.dismissAE();
      this.setState({"shouldhide":true});
    }
  },
  render: function(){
    return this.state.shouldhide ? <span></span> : (
      <p className="bottompromo">
Psst! Är du mattelärare? Missa inte <a target="_blank" href="http://www.algebraexplorer.com">Algebra Explorer</a>,
kärleksbarnet mellan en matematikbok och en symbolhanterande miniräknare! Algebra Explorer är en app som visar delsteg
i algebraiska förenklingar komplett med förklaringar, på både svenska och engelska! <button className="btn btn-default btn-xs" onClick={this.dismiss}>Jaja, sluta tjata!</button>
      </p>
    );
  }
});

module.exports = Commercial;
