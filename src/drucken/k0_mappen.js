/* ---------- Druckmappen: was in SL-Mappe und Spielerpaket steckt ----------
   Einzige Quelle für die Druckseite (k3_app.js) und für tools/make-pdf.js (Gesamt-PDFs).
   file: Dateiname in docs/pdf/<lang>/ · src: Webseite, aus der die PDF entsteht · land: A4 quer
   Teile ohne Datei für eine Sprache (z. B. Run-Text auf Englisch) werden dort ausgelassen. */
const MAPPEN={
 gm:{file:{de:'sl-mappe.pdf',en:'gm-binder.pdf'},t:{de:'SL-Mappe',en:'GM binder'},
  d:{de:'Alles, was die Spielleitung braucht, in Spielreihenfolge. Enthält die Auflösung: nicht an Spieler:innen weitergeben.',en:'Everything the GM needs, in order of play. Contains the reveal: do not hand to players.'},
  parts:[
   {id:'guide',file:{de:'leitfaden.pdf',en:'gm-guide.pdf'},t:{de:'SL-Leitfaden',en:'GM guide'},src:'feuerprobe-leitfaden.html',copies:{de:'1×',en:'1×'},
    n:{de:'Ablauf des Runs, NPCs mit Porträts, Alert-Stufen und Payoff-Tabelle.',en:'Run outline, NPCs with portraits, alert levels and payoff table.'}},
   {id:'plans-gm',file:{de:'plaene-sl.pdf',en:'plans-gm.pdf'},t:{de:'Pläne, SL-Version',en:'Plans, GM version'},src:'meridian-spire-plaene.html?print=gm',land:true,copies:{de:'1×',en:'1×'},
    n:{de:'Je Ebene ein Kartenblatt und ein Notizblatt, A4 quer.',en:'Per level one map sheet and one notes sheet, A4 landscape.'}},
   {id:'rules-gm',file:{de:'cheatsheets-sl.pdf',en:'cheatsheets-gm.pdf'},t:{de:'Cheat-Sheets SL',en:'GM cheat sheets'},src:'feuerprobe-regeln.html?aud=gm',copies:{de:'1×',en:'1×'},
    n:{de:'Würfe leiten, Kampf & Gegner, Magie im Turm, Alert/Matrix/Payoff.',en:'Running rolls, combat & opposition, magic in the tower, alert/Matrix/payoff.'}},
   {id:'dossiers',file:{de:'runner-dossiers.pdf',en:'runner-dossiers.pdf'},t:{de:'Runner-Dossiers mit SL-Notizen',en:'Runner dossiers with GM notes'},src:'feuerprobe-runner.html',land:true,copies:{de:'1×',en:'1×'},
    n:{de:'Alle acht Runner mit Werten, Spieltipps und SL-Notizen.',en:'All eight runners with stats, play tips and GM notes.'}},
   {id:'run',file:{de:'feuerprobe-run.pdf'},t:{de:'Der Run (Oneshot-Text)',en:'The run (one-shot text)'},src:'feuerprobe-oneshot.html',copies:{de:'optional',en:'optional'},
    n:{de:'Der vollständige Abenteuertext zum Nachlesen.',en:'The complete adventure text (German only).'}}]},
 player:{file:{de:'spielerpaket.pdf',en:'player-pack.pdf'},t:{de:'Spielerpaket',en:'Player pack'},
  d:{de:'Für den Tisch: ohne SL-Notizen und ohne Auflösung.',en:'For the table: no GM notes, no reveal.'},
  parts:[
   {id:'rules-player',file:{de:'cheatsheets-spieler.pdf',en:'cheatsheets-players.pdf'},t:{de:'Cheat-Sheets Spieler:innen',en:'Player cheat sheets'},src:'feuerprobe-regeln.html?aud=player',copies:{de:'1× je Person',en:'1× per person'},
    n:{de:'Grundregeln, Welche Action?, Kampf, Magie, Matrix/Technik/Alert.',en:'Core rules, which action?, combat, magic, Matrix/tech/alert.'}},
   {id:'plans-player',file:{de:'plaene-spieler.pdf',en:'plans-players.pdf'},t:{de:'Pläne, Spielerversion',en:'Plans, player version'},src:'meridian-spire-plaene.html?print=player',land:true,copies:{de:'1–2× für den Tisch',en:'1–2× for the table'},
    n:{de:'Nur, was die Crew wissen kann. A4 quer.',en:'Only what the crew can know. A4 landscape.'}},
   {id:'runners-all',file:{de:'feuerprobe-runner-alle.pdf',en:'feuerprobe-runners-all.pdf'},t:{de:'Alle acht Runnerbögen',en:'All eight runner sheets'},src:'feuerprobe-runner-bogen.html',copies:{de:'1 Bogen je Person',en:'1 sheet per person'},
    n:{de:'Ein Runner pro A4. Wer nur einzelne braucht: Einzelbögen unten.',en:'One runner per A4 page. Need only some? Single sheets below.'}}]},
};
const SINGLE_SHEETS=[['mercer','Mercer','Mercer'],['chamaeleon','Chamäleon','Chameleon'],['kessel','Kessel','Kessel'],['zephyr','Zephyr','Zephyr'],['bastion','Bastion','Bastion'],['fizz','Fizz','Fizz'],['stille','Stille','Hush'],['ravn','Ravn','Ravn']];
