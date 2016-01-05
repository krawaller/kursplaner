

var React = require("React"),
    _ = require('lodash'),
    DB = require('../fetch/json/master.json'),
    toString = React.renderToStaticMarkup,
    Link = React.createClass({
      render: function(){
        return <a href={this.props.href}>{this.props.text}</a>;
      }
    });

module.exports = {
    subjectAuthorization: function(code){
        var subject = DB.subjects[code];
        return toString(<div>
            { subject.school === "grund" ? (
                    <div>
                        <p>
                            <p>För att vara behörig att undervisa i årskurs 1-3 behöver du:</p>
                            <ul>
                                <li>en grundlärarexamen med inriktning mot arbete i förskoleklass och grundskolans årskurs 1-3, eller</li>
                                <li>en äldre examen avsedd för arbete i minst en av årskurserna 1-3 i grundskolan (exempelvis en lågstadielärare), eller</li>
                                <li>en examen som ger behörighet att bedriva undervisning enligt behörighetsförordningen, om du har kompletterat din utbildning så att du har fått kunskaper och förmågor som motsvarar kraven för en grundlärarexamen.</li>
                                <li>En fritidspedagogexamen med inriktning mot arbete enbart i fritidshem och ämnesstudier i tillräcklig omfattning inom eller utöver din examen.</li>
                            </ul>
                        </p>
                        <p>
                            <p>För att vara behörig att undervisa i årskurs 4-6 behöver du:</p>
                            <ul>
                                <li>en grundlärarexamen med inriktning mot arbete i årskurs 4-6, eller</li>
                                <li>en grundlärarexamen med inriktning mot arbete i fritidshem, eller</li>
                                <li>en ämneslärarexamen med inriktning mot arbete i årskurs 7-9, eller</li>
                                <li>en äldre examen avsedd för arbete i minst en av årskurserna 4-6, eller</li>
                                <li>en äldre examen avsedd för arbete i minst en av årskurserna 7-9.</li>
                                <li>En fritidspedagogexamen med inriktning mot arbete enbart i fritidshem och ämnesstudier i tillräcklig omfattning inom eller utöver din examen.</li>
                            </ul>
                        </p>
                        <p>
                            <p>För att vara behörig att undervisa i årskurs 7-9 behöver du:</p>
                            <ul>
                                <li>en ämneslärarexamen med inriktning mot arbete i årskurs 7-9, eller</li>
                                <li>en ämneslärarexamen med inriktning mot arbete i gymnasieskolan, eller</li>
                                <li>en äldre examen avsedd för arbete i minst en av årskurserna 7-9 i grundskolan, eller</li>
                                <li>en äldre examen avsedd för arbete i gymnasieskolan.</li>
                            </ul>
                        </p>
                    </div>
                ) : subject.school === "grundvux" ? (
                    <div>
                        <p>Behörig att undervisa i kommunal vuxenutbildning är den som är behörig att undervisa på motsvarande nivå och i motsvarande ämne i grundskolan eller gymnasieskolan.</p>
                        <p>Några exempel:</p>
                        <ul>
                            <li>Om du är behörig att undervisa i matematik i årskurs 1-3 så är du även behörig i ämnet på grundläggande nivå i kommunal vuxenutbildning.</li>
                            <li>Om du är behörig att undervisa i svenska i gymnasieskolan så är du även behörig i ämnet på gymnasial nivå i kommunal vuxenutbildning.</li>
                        </ul>
                    </div>
                ) : subject.type === "COMMON" ? (<div>
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
                    <p>
                        Vidare finns för dessa ämnen särskilda bestämmelser i SKOLFS 2011:159 som vad som krävs för att en lärares kompetens ska bedömas som relevant.
                        För {subject.name} så
                        {subject.auth2012?" uppdaterades dessa i SKOLFS 2012:17 och lyder nu " : " lyder de "}
                        som följer:
                    </p>
                    <div style={{paddingLeft:"2em"}} dangerouslySetInnerHTML={{__html:subject.auth||"Saknas!!"}}/>
                </div>)
            }
        </div>);
    },
    subjectGoals: function(code){
        var subject = DB.subjects[code];
        return toString(<div>
            <p>Undervisningen i {subject.name} på {subject.school==="grund"||subject.school==="grundvux"?"grundskolenivå":"gymnasienivå"} {subject.school==="grundvux"?"för vuxna":""} ska ge eleverna möjlighet att utveckla förmågan att:</p>
            <ol>
                {subject.goals.map(function(goal,n){
                    return <li key={"goal"+n} className={"goal-"+["notused","used","focus"][subject.goals[n]]}>{goal}</li>;
                })}
            </ol>
            <p>
                {subject.school === "grund" || subject.school === "grundvux"
                ? "På grundläggande nivå jobbar man med samtliga mål i ämnets alla \"kurser\"."
                : subject.someexcludes?"Vissa kurser täcker inte alla ämnesmål."
                : subject.courses.length > 1
                ? (subject.courses.length===2 ? "Båda ämnets kurser " : "Samtliga kurser i ämnet ")+" täcker alla mål."
                : "Ämnet har bara en enda kurs, som därmed givetvis täcker alla ämnesmålen. "}
                {subject.somefocuses ? (
                    subject.courses.length > 1 ? " Några mål har extra fokus i vissa kurser. " : " Kursen har dock extra fokus på vissa ämnesmål."
                ) : null}
            </p>
        </div>);
    },
    subjectDescription: function(code){
        function linkToS(d,DB,sameschool){
            var sub = DB.subjects[d], s = sub.school || "gymn";
            // return <Link key={d} to="subjectdesc" params={{subject:d}}>{sub.name} {s !== (sameschool||"gymn") ? " ("+s+")" : null}</Link>;
            return <Link href={"#/subjects/"+d+"/desc"} text={ sub.name + (s !== (sameschool||"gymn") ? " ("+s+")" : "") } />;
        }
        function list(subjects,DB,school){
            var l = subjects.length;
            return _.reduce(subjects,function(mem,sid,n){
                mem.push(linkToS(sid,DB,school));
                if (n === l-1){
                    mem.push(".");
                } else if (n === l-2){
                    mem.push(" och ");
                } else {
                    mem.push(", ");
                }
                return mem;
            },[]);
        }
        var sub = DB.subjects[code],
            spec = {ELP:"INT",INT:"ELP"},
            specreplacers = {TEY:"TES",TES:"TEY"};
        return toString(<div>
            { spec[sub.code] ? <p className="obsolete">
                Detta ämne <strong>ges inte längre efter juni 2015</strong> utan blev tillsammans med {' '}
                {linkToS(spec[sub.code],DB)} ersatt av {linkToS("TEY",DB)} och {linkToS("TES",DB)}.
            </p>: null}
            { specreplacers[sub.code] ? <p>
                Detta ämne tillkom tillsammans med {linkToS(specreplacers[sub.code],DB)} i juli 2015 {' '}
                för att ersätta {linkToS("ELP",DB)} och {linkToS("INT",DB)}.
            </p>: null}
            { sub.replacedby && <p className="obsolete">
                Detta ämne <strong>ges inte längre efter juni 2015</strong> utan ersattes av {linkToS(sub.replacedby,DB)} med den nya koden <strong>{sub.replacedby}</strong>.
            </p> || null}
            { sub.replaces && <p>
                Detta ämne skapades efter juni 2015 för att ersätta {linkToS(sub.replaces,DB)} som hade koden <strong>{sub.replaces}</strong>.
            </p> || null}
            { sub.splitinto && <p className="obsolete">
                Detta ämne <strong>ges inte längre efter juni 2015</strong>, utan är uppdelat i {list(sub.splitinto,DB)}
            </p> || null}
            { sub.shardof && <p>
                Efter juni 2015 så delades det gamla ämnet {linkToS(sub.shardof,DB)} upp i detta ämne samt {list(sub.shardofwith,DB)}
            </p> || null}
            { sub.novux && <p>
                Detta ämne får ej ges inom vuxenutbildningen utan endast på gymnasiet.
            </p> || null}
            <div dangerouslySetInnerHTML={{__html:sub.description}}/>
            { sub.friends.length ? <p>
                { sub.school
                    ? <span>Motsvarighet till detta ämne i andra skolformer är </span>
                    : <span>Via kursers förkunskapskrav och andra sammanhang så har detta ämne kopplingar till </span>
                }
                {list(sub.friends,DB,sub.school||"gymn")}
            </p> : null}
        </div>);
    },
    courseContent: function(code){
        var course = DB.courses[code],
            content = course.content;
        return "<ul>" + (_.isArray(content) ? "<li>"+content.join("</li><li>")+"</li>" : _.reduce(content,function(str,group,headline){
            return str+"<li><h4>"+headline+"</h4><ul><li>"+group.join("</li><li>")+"</li></ul></li>";
        },"") ) + "</ul>";
    },
    courseGoals: function(code){
        var course = DB.courses[code],
            subject = DB.subjects[course.subject];
        return toString(<div>
            <p>
                {course.school==="grund"
                ? "På grundskolan så jobbar man hela tiden med ämnets samtliga mål: "
                : course.excludesgoals
                ? "Ej ingående ämnesmål visas överstrykna. "
                : subject.courses.length===1
                ? "Eftersom denna kurs är ensam i sitt ämne så täcker den samtliga ämnesmål. "
                : subject.someexcludes
                ? "Denna kurs täcker samtliga ämnesmål. "
                : "Liksom alla övriga kurser i ämnet så täcker denna kurs samtliga ämnesmål. "}
                {course.focusesgoals ? " Mål som kursen fokuserar på visas i fetstil. " : ""}
            </p>
            <ol>
                {subject.goals.map(function(goal,n){
                    return <li key={"goal"+n} className={"goal-"+["notused","used","focus"][course.goals[n]]}>{goal}</li>;
                })}
            </ol>
            {course.level==="basic"?<p>I kursen behandlas <strong>grundläggande</strong> kunskaper i ämnet.</p>
            :course.level==="high"?<p>I kursen behandlas <strong>fördjupade</strong> kunskaper i ämnet.</p>:''}
        </div>);
    },
    courseDescription: function(code){
        var course = DB.courses[code],
            subject = DB.subjects[course.subject],
            tot = subject.courses.length,
            nums = [0,0,"två","tre","fyra","fem","sex","sju","åtta","nio","tio","elva","tolv","tretton","fjorton","femton"],
            desc = course.descarr,
            remnotwith = course.remotenotwitharr,
            by = course.reqBy;
        function linkToC(d,t){
          return <Link href={"#/courses/"+d+"/desc"} text={t || DB.courses[d].name}/>;
          //return <Link to="coursedesc" params={{course:d}}>{t || DB.courses[d].name}</Link>;
        }
        function linkToS(d){
          return <Link href={"#/subjects/"+d+"/desc"} text={DB.subjects[d].name}/>;
          //return <Link to="subjectdesc" params={{subject:d}}>{DB.subjects[d].name}</Link>;
        }
        function list(courses){
          var l = courses.length;
          return _.reduce(courses,function(mem,cid,n){
            mem.push(linkToC(cid));
            if (n === l-1){
              mem.push(".");
            } else if (n === l-2){
              mem.push(" och ");
            } else {
              mem.push(", ");
            }
            return mem;
          },[]);
        }
        console.log("STATIC",course.code)
        return toString(<div> {
          course.school === "grund" ? (
            <p>
              {course.name} utgör en av {nums[tot]} delar av grundskoleämnet {linkToS(subject.code)}.
              Normalt skiljer man inte mellan kurser och ämnen på grundskolan, men eftersom det finns specifikt centralt innehåll och kunskapskrav för de olika stadierna inom grundskolans ämnen så har vi valt att hantera dessa som kurser, för att matcha strukturen på gymnasienivå.
            </p>
          ) : (
            <div>
              { course.obsolete ? <p className="obsolete">
                Denna kurs tillhör ett ämne som inte längre ges och är därför ej aktuell.
              </p> : null}
              <p>
                {course.school === "grundvux" ? "Grundvuxkursen" : "Gymnasiekursen"} {course.name} har kod <strong>{course.code}</strong> och är på <strong>{course.points}</strong> poäng. Den är {tot===1?"enda kursen":"en av "+(nums[tot]||tot)+" kurser "} i ämnet {linkToS(subject.code)}.
                {desc && [" "].concat(desc.map(function(d){
                  return DB.courses[d]?linkToC(d):d;
                }))}
                {remnotwith ? remnotwith.length === 1 ? <span>{' '}
                  I kursplanen för {linkToC(remnotwith[0])} så står det att den inte får ingå i examen tillsammans med {course.name}.
                </span> : <span>{' '}
                  I kursplanerna för {list(remnotwith)} så står det att de inte får ingå i examen tillsammans med {course.name}.
                </span>: null}
                {by && [" Kursen ingår i förkunskapskraven för "].concat(_.reduce(by,function(m,part,n){
                  return m.concat([linkToC(part)].concat(n===by.length-1?[]:n===by.length-2?[" och "]:[", "]));
                },[])).concat([". "])}
              </p>
              {course.novux ? (subject.courses.length === 1 ? <p>
                Denna kurs får ej ges inom vuxenutbildningen.
              </p> : <p>
                Liksom övriga kurser i {linkToS(subject.code)} så får denna kurs ej ges inom vuxenutbildningen.
              </p>) : null}

            </div>
          )
        }
        </div>);
    }
};
