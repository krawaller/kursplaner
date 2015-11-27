


## Grundskola

`/fetch/html/downloadgrund.js` utgår ifrån en url till skolverket med länk till samtliga grundämnen, och sparar en html-fil per grundämne i `/fetch/html/subjects/grund/`

`/fetch/json/parsegrund.js` loopar igenom alla html-filer i `/fetch/html/subjects/grund/`. För varje ämne sparar den en json-fil i `/fetch/json/grundsubjects`, och för varje kurs en json-fil i `/fetch/json/grundcourses/`.

## Grundvux

Filen `/fetch/markdown/grundvuxkurs.md` är manuellt (!!) skapad och påfylld utifrån data från skolverket.

Den är sedan konverterad via Marked till `/fetch/markdown/grundvuxkurs.html`.

Sedan används `/fetch/json/parsevuxgrund.js` för att läsa igenom `/fetch/markdown/grundvuxkurs.html` och skapa en json-fil per ämne i `/fetch/json/grundvuxsubjects/` och en per kurs i `/fetch/json/grundvuxcourses/`.


## Gymnasie

`/fetch/html/downloadletters.js` sparar en html-fil per vuxtyp (COMMON,OTHER,VOCATIONAL) och bokstav i `fetch/html/letters/<vuxtyp>/`.

`/fetch/html/downloadsubjects.js` läser för varje typ igenom alla bokstavsfiler skapade av `downloadletters.js` och försöker med 2 alternativa url:er spara ner motsvarande html-fil i `/fetch/html/subjects/<typ>/`. För dem den inte hittar så använder den manuellt sparade filer i `/fetch/html/manual/<typ>/`.

`/fetch/json/parsesubjects.js` loopar igenom alla ämnenas html-filer i `/fetch/html/subjects/<typ>`, och sparar ämnes-json i `/fetch/json/subjects` och kurs-json i `/fetch/json/courses` (EJ uppdelad i typ).

## Baka ihop

Sedan, i **samma fil**, fortsätter den att baka ihop alla gymnasiekurser med json-filerna i `/fetch/json/grundcourses`, `/fetch/json/grundsubjects`, `/fetch/json/grundvuxcourses` och `/fetch/json/grundvuxsubjects`.

Den lägger också in läroplaner från `/fetch/markdown/<nivå>.html`.

Alltihop sparas nu till `/fetch/json/master.json`.


