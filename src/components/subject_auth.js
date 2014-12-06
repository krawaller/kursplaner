/** @jsx React.DOM */

var React = require('react'),
    Section = React.createFactory(require('./section')),
    Router = require('react-router'),
    Link = Router.Link,
    _ = require('lodash');

var SubjectAuth = React.createClass({
  render: function(){
    var subject = this.props.subject
    return (
        <Section headline="Behörighet">
            {
                subject.type === "COMMON" ? (<div>
                    <p>{subject.name} är ett så kallat <strong>vanligt ämne</strong>. Därmed krävs för behörighet att du har:</p>
                    <ul>
                        <li>Ämneslärarexamen med inriktning mot arbete i gymnasieskolan, eller</li>
                        <li>Ämneslärarexamen med inriktning mot arbete i grundskolans årskurs 7- 9, eller</li>
                        <li>Äldre examen som är avsedd för arbete i gymnasieskolan, eller</li>
                        <li>Äldre examen som är avsedd för arbete som lärare, om den omfattar ämnesstudier om minst 120 högskolepoäng eller motsvarande omfattning i något av ämnena svenska, samhällskunskap eller musik eller minst 90 högskolepoäng eller motsvarande omfattning i ett annat ämne, dock inte ett yrkesämne, eller</li>
                        <li>Examen som ger dig behörighet att undervisa som lärare och fullgjorda ämnesstudier om minst 120 högskolepoäng eller motsvarande omfattning i något av ämnena svenska, samhällskunskap eller musik, eller</li>
                        <li>Examen som ger dig behörighet att undervisa som lärare och fullgjorda ämnesstudier om minst 90 högskolepoäng eller motsvarande omfattning i ett annat ämne än svenska, samhällskunskap eller musik, dock inte ett yrkesämne.</li>
                    </ul>
                </div>) : subject.type === "VOCATIONAL" ? (<div>
                    <p>{subject.name} är ett <strong>yrkesämne</strong>. Därmed krävs för behörighet att du har:</p>
                    <ul>
                        <li>Yrkeslärarexamen, eller</li>
                        <li>Äldre examen som är avsedd för arbete i gymnasieskolan i ett yrkesämne, eller</li>
                        <li>Examen som ger dig behörighet att undervisa som lärare samt relevanta yrkeskunskaper som du har fått genom utbildning och/eller arbete.</li>
                    </ul>
                </div>) : (<div>
                    <p>{subject.name} tillhör de ämnen som benämns som <strong>vissa ämnen</strong>. För behörighet krävs:</p>
                    <ul>
                        <li>Ämneslärarexamen med inriktning mot arbete i gymnasieskolan, eller</li>
                        <li>Examen avsedd för arbete i gymnasieskolan från en äldre lärarutbildning än den som infördes 2011, eller</li>
                        <li>Examen som ger dig behörighet att undervisa som lärare och fullgjorda ämnesstudier om minst 90 hp eller motsvarande omfattning i minst ett vanligt ämne (alternativt 120 hp om det gäller ämnena svenska, samhällskunskap eller musik), eller</li>
                        <li>Examen som ger dig behörighet att undervisa som lärare och fullgjorda ämnesstudier om minst 90 hp i ett så kallat visst ämne.</li>
                    </ul>
                    <p>Vidare finns för dessa ämnen särskilda bestämmelser i SKOLFS 2011:159 som vad som krävs för att en lärares kompetens ska bedömas som relevant. För {subject.name} så lyder de som följer:</p>
                    <div style={{paddingLeft:"2em"}} dangerouslySetInnerHTML={{__html:subject.auth||"Saknas!!"}}/>
                </div>)
            }
        </Section>
    );
  }
});

module.exports = SubjectAuth;
