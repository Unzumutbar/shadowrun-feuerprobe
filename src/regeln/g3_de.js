/* ---------- Cheat-Sheets: deutsche Daten ---------- */
// Blöcke: ['p',html] · ['ul',[..]] · ['ol',[..]] · ['tbl',[Köpfe],[[Zellen]],'nw'] · ['dice',[[Würfel,Farbe,html]]]
//         ['ladder',[[Stufe,Farbe,html]]] · ['note',klasse,html] · ['chips',[..]]
// Kasten: {h, sm, cls:'gmbx'|'warnbx'|'goldbx', b:[Blöcke]} · Sheet: {id, aud:'player'|'gm', title, lead, c3, boxes}
const C6='var(--alert0)',C45='var(--alert1)',C13='var(--alert3)',CCR='var(--accent)';
const SHEETS_DE={
 ui:{title:'Cheat-Sheets',subtitle:'Kampf, Magie, Matrix und Grundregeln für die Feuerprobe',eyebrow:'Shadowrun · Feuerprobe · Runners in the Shadows',
  all:'Alle',player:'Spieler',gm:'SL',home:'Startseite',guide:'SL-Leitfaden',print:'Drucken',audPlayer:'Für Spieler:innen',audGm:'Nur für die Spielleitung',
  foot:'Feuerprobe · Runners in the Shadows · Cheat-Sheet',
  fine:'Fan-Material für den privaten Spieltisch. <i>Runners in the Shadows</i> ist ein Forged-in-the-Dark-Spiel von Mark Cleveland Massengale; <i>Shadowrun</i> ist eine Marke von The Topps Company / Catalyst Game Labs. Die Sheets fassen die Regeln zusammen, wie dieser Oneshot sie benutzt; wo „Oneshot“ steht, ist es eine Empfehlung für diesen Run, keine offizielle Regel. Im Zweifel gilt das Regelwerk. Zum Drucken oben „Spieler“ oder „SL“ wählen: jedes Sheet ist eine A4-Seite.'},
 sheets:[
 /* ================= SPIELER ================= */
 {id:'grundregeln',aud:'player',title:'Grundregeln',c3:true,
  lead:'Fiction first: Erst sagst du, was dein Runner tut und was er damit erreichen will. Gewürfelt wird nur, wenn etwas Gefährliches oder Ungewisses auf dem Spiel steht.',
  boxes:[
   {h:'Action Roll',sm:'so viele W6 wie dein Action Rating',b:[
    ['p','Würfle, zähle nur den <b>höchsten</b> Würfel.'],
    ['dice',[['6 + 6',CCR,'<b>Critical:</b> Erfolg mit Zusatzvorteil.'],['6',C6,'<b>Voller Erfolg.</b> Du bekommst, was du wolltest.'],['4/5',C45,'<b>Erfolg mit Consequence.</b> Es klappt, aber es kostet etwas.'],['1–3',C13,'<b>Schlecht.</b> Kein oder falscher Erfolg, dazu eine Consequence.']]],
    ['p','<b>0 Punkte</b> in der Action: 2W6, der <b>niedrigere</b> zählt, kein Critical.']]},
   {h:'Position',sm:'wie schlimm kann es werden?',b:[
    ['tbl',['Position','Bedeutung'],[['Controlled','Du hast die Lage im Griff. Folgen sind mild, du kannst oft abbrechen.'],['Risky','Der Normalfall. Es kann ernsthaft schiefgehen.'],['Desperate','Du bist in großen Schwierigkeiten. Folgen sind schwer.']],'nw'],
    ['p','Die SL sagt Position und Effect <b>vor</b> dem Wurf an. Ihr dürft verhandeln oder einen anderen Ansatz wählen.']]},
   {h:'Effect',sm:'wie viel erreichst du?',b:[
    ['tbl',['Effect','Clock-Segmente'],[['Limited','1 · halbe Sache, Teilerfolg'],['Standard','2 · das, was man erwarten würde'],['Great','3 · mehr als erwartet']],'nw'],
    ['p','Mehr Effect durch passende Ausrüstung, Überraschung, gute Vorbereitung. Weniger durch Übermacht, Panzerung, Harm Stufe 1. Position gegen Effect tauschen ist erlaubt: riskanter für mehr Wirkung.']]},
   {h:'Edge',sm:'9 Kästchen · deine Reserve',b:[
    ['ul',['<b>Pushen (2 Edge je Vorteil):</b> +1d, +1 Effect oder trotz Harm Stufe 3 handeln.','<b>Assistieren (1 Edge):</b> ein Teammitglied erhält +1d. Nur eine Person pro Wurf. Du kannst dabei selbst Consequences abbekommen.','<b>Dragon’s Deal:</b> statt zu pushen +1d, wenn du einen Haken annimmst, den die SL oder jemand am Tisch anbietet. Der Haken tritt ein, egal wie der Wurf ausgeht.','<b>Resistance:</b> kostet Edge (siehe unten).']],
    ['note','warn','<b>Edge voll?</b> Du erhältst ein <b>Trauma</b> (Cold, Haunted, Obsessed, Paranoid, Reckless, Soft, Unstable, Vicious) und fällst für den Rest der Szene aus. Edge ist wieder leer.']]},
   {h:'Resistance Roll',sm:'Consequence abmildern',b:[
    ['p','Eine Consequence trifft dich? <b>Resistance wirkt immer</b>: Die SL sagt, ob sie abgeschwächt wird oder ganz entfällt. Der Wurf bestimmt nur den Preis.'],
    ['ul',['Die SL nennt das passende <b>Attribut</b> (Wert auf deinem Bogen).','Kosten: <b>6 minus höchster Würfel</b> in Edge (höchstens 5).','Critical: du bekommst 1 Edge zurück.','Erst entscheiden, dann würfeln. Nur ein Wurf pro Consequence, und nicht zusätzlich zu Armor.']],
    ['tbl',['Attribut','gegen …'],[['Intuition','Täuschung, Überraschung'],['Body','körperliche Belastung, Verletzung'],['Willpower','mentale Belastung, Willenskraft, Furcht']],'nw']]},
   {h:'Teamwork',sm:'gemeinsam seid ihr besser',b:[
    ['ul',['<b>Assist:</b> 1 Edge, +1d für eine andere Person.','<b>Setup:</b> deine Action bereitet die nächste vor. Erfolg gibt dem Team +1 Effect oder eine bessere Position.','<b>Group Action:</b> eine Person führt, alle würfeln dieselbe Action, das beste Ergebnis zählt. Für jede 1–3 in der Gruppe zahlt die Anführerin 1 Edge.','<b>Protect:</b> du wirfst dich vor eine Consequence, die jemand anderen treffen würde, und nimmst sie selbst (Resistance erlaubt).']]]},
   {h:'Flashback',sm:'Vorbereitung nachträglich',b:[
    ['p','Ihr müsst nichts vorausplanen. Mitten im Run erklärst du, was du vorher schon getan hattest.'],
    ['tbl',['Edge','Beispiel'],[['0','gewöhnlich, leichte Gelegenheit: Du hast den Weg zur Garage ausgekundschaftet.'],['1','komplex oder unwahrscheinlich: Eine Waffe liegt schon im Penthouse.'],['2+','aufwendig, mit Sonderchancen: Dein Name steht auf der Gästeliste.']],'nw'],
    ['p','Danach wie jede Action: manchmal ein Action Roll, manchmal ein Fortune Roll, manchmal gar nichts. Ein Flashback ist keine Zeitreise und macht nichts ungeschehen.']]},
   {h:'Load',sm:'vor dem Run wählen',b:[
    ['tbl',['Load','Wirkung'],[['Light 3','schneller, unauffällig, passt zur Gala. Rüstkleidung oder ein sperriges Teil.'],['Normal 4–5','sieht nach Ärger aus. Schwere Rüstung oder zwei sperrige Teile.'],['Heavy 6','langsamer, wirkt wie im Einsatz. Bis zu drei sperrige Teile.']],'nw'],
    ['p','Welche Gegenstände du trägst, entscheidest du erst, wenn du sie brauchst. Du hakst sie dann ab, bis dein Load erreicht ist. Mit der Load-Wahl füllen sich deine Armor-Kästchen wieder auf.']]},
   {h:'Plan & Engagement',sm:'kein stundenlanges Planen',b:[
    ['p','Wählt einen Plan und nennt das Detail. Dann würfelt die SL den <b>Engagement Roll</b> und schneidet direkt in die erste Gefahr.'],
    ['tbl',['Plan','Detail'],[['Assault','Angriffspunkt'],['Deception','Methode'],['Social','Verbindung'],['Stealth','Einstiegspunkt'],['Supernatural','magische Methode'],['Transport','Route & Mittel']],'nw'],
    ['p','Ein schlechtes Engagement heißt nicht, dass ihr dumm geplant habt. Nur, dass es gleich brenzlig beginnt.']]},
  ]},

 {id:'actions',aud:'player',title:'Welche Action?',c3:true,
  lead:'Actions sind Tätigkeiten, keine Wissensfertigkeiten. Nicht „ich würfle Interface“, sondern: Was tut deine Figur? Daraus ergibt sich die Action. Oft passen mehrere; deine Methode entscheidet über Position und Effect.',
  boxes:[
   {h:'Intuition',sm:'Resistance gegen Täuschung & Überraschung',b:[
    ['tbl',['Action','Im Meridian Spire'],[['Engineer','Gondelsteuerung umverdrahten, Keycard kopieren, Retinaduplikat bauen, eine Sicherung entschärfen'],['Interface','Kameras loopen, Gästeliste ändern, Aufzug umleiten, Türprotokoll fälschen, Drohne übernehmen'],['Stalk','Dr. Venn unauffällig folgen, Kades Spur aufnehmen, gezielter Schuss auf eine Drohnenoptik'],['Survey','Kades Runde vorhersagen, Sensoren im Korridor erkennen, Fluchtweg ausmachen, die Menge lesen']]]]},
   {h:'Body',sm:'Resistance gegen Verletzung & Anstrengung',b:[
    ['tbl',['Action','Im Meridian Spire'],[['Fight','Wache überwältigen, Wächterdrohne im Nahkampf, jemandem die Pistole vorhalten, eine Position halten'],['Finesse','Keycard aus der Tasche ziehen, Gondel im Wind steuern, Skycab landen, entwaffnen'],['Prowl','durch den Servicetrakt schleichen, an der Fassade klettern, Lichtschranken umgehen, aus dem Hinterhalt ausschalten'],['Wreck','Tür aufbrechen, Deckung zerlegen, Drohne zertrümmern, Wand sprengen']]]]},
   {h:'Willpower',sm:'Resistance gegen Angst, Druck, Magie',b:[
    ['tbl',['Action','Im Meridian Spire'],[['Command','Personal herumkommandieren, Wache einschüchtern, Panik unter Gästen bändigen'],['Consort','mit Sammler:innen netzwerken, Venn in ein Fachgespräch ziehen, einen Kontakt anrufen'],['Influence','Empfang täuschen, Venn zur Schleuse überreden, eine Wache beschwichtigen'],['Study','Provenienz recherchieren, Baupläne auswerten, Lügen erkennen, eine Zauberformel studieren']]]]},
   {h:'Assense',sm:'nur Erwachte',b:[
    ['p','Astral wahrnehmen: Auren, Emotionen, Geister, Barrieren, magische Gegenstände. Zählt zu den 7 Action-Punkten. Gefährliches Zaubern würfelst du meist mit Assense. Mehr auf dem Sheet <b>Magie</b>.']]},
   {h:'Die richtige Frage',b:[
    ['ol',['Was willst du erreichen?','Wie genau tust du es?','Was steht dabei auf dem Spiel?']],
    ['p','Die SL nennt Action, Position und Effect. Klingt dir die Position zu schlimm, ändere deinen Ansatz, bevor gewürfelt wird.']]},
   {h:'Kein Wurf nötig',b:[
    ['p','Ihr seid Profis. Routine ohne Gefahr klappt einfach: ein Glas nehmen, sich im Salon umsehen, ein Kommlink bedienen, den Lift rufen.']]},
   {h:'Wissen statt Würfeln',b:[
    ['p','Ob deine Figur etwas weiß, entscheidet ihr Hintergrund. Frag die SL einfach. Gewürfelt wird, wenn du dir Wissen unter Druck <i>beschaffst</i>, etwa mit Study oder Survey.']]},
   {h:'Gather Information',sm:'vor dem Run',b:[
    ['p','Eine oder zwei gezielte Fragen pro Person reichen. Gute Fragen: Wo ist die Keycard? Wie komme ich an Dr. Venn? Welche Ausrüstung fällt auf? Gibt es einen zweiten Zugang? Was liegt unter dem Penthouse?']]},
  ]},

 {id:'kampf',aud:'player',title:'Kampf',c3:true,
  lead:'Keine Initiative, keine Runden, keine Trefferpunkte für Gegner. Ihr beschreibt Ziel und Methode, würfelt eine Action, und die Gegner handeln über die Consequences. Ein Wurf kann einen ganzen Schlagabtausch abbilden.',
  boxes:[
   {h:'So läuft ein Kampf',b:[
    ['ol',['Sag, <b>was du erreichen willst</b>: die Drohne blenden, die Wache zu Boden bringen, den Gang halten.','Sag, <b>wie</b>: Waffe, Deckung, Timing, Teamwork.','Die SL nennt Position und Effect. Zähe Gegner haben eine <b>Clock</b>.','Würfeln. Der Wurf zählt für beide Seiten: <b>6</b> du setzt dich durch, <b>4/5</b> beide haben Effect, <b>1–3</b> der Gegner setzt sich durch.']],
    ['p','Sehr gefährliche Gegner handeln zuerst. Dann musst du erst widerstehen, bevor du selbst handeln kannst.']]},
   {h:'Kampf-Actions',b:[
    ['tbl',['Action','wofür'],[['Fight','Nahkampf, Handgemenge, Waffe auf Sprechdistanz, Position halten'],['Stalk','Präzisionsschuss aus der Distanz, Hinterhalt legen'],['Prowl','aus dem Versteck angreifen'],['Finesse','entwaffnen, Duell, Fahrzeug steuern'],['Wreck','rohe Gewalt, Deckung und Türen zerstören, Sabotage'],['Command','einschüchtern, Kapitulation erzwingen'],['Assense','Zauber unter Gefahr (nur Erwachte)']],'nw']]},
   {h:'Was den Effect ändert',b:[
    ['ul',['<b>Übermacht:</b> mehr oder größere Gegner = weniger Effect.','<b>Panzerung:</b> gegen gepanzerte Drohnen wirkt eine Holdout-Pistole kaum.','<b>Potency:</b> passende Waffe, Überraschung, Schwachstelle (EMP gegen Drohnen, Optik zerschießen) = mehr Effect.','<b>Vorbereitung:</b> Setup-Action oder Flashback.']]]},
   {h:'Harm',sm:'Stufe 4 = tödlich',b:[
    ['tbl',['Stufe','Folge','Beispiel'],[['1 leicht','weniger Effect','zerschrammt, verstaucht, erschöpft'],['2 mittel','−1d','tiefer Schnitt, Gehirnerschütterung'],['3 schwer','handlungsunfähig: nur mit Hilfe oder pushen','Schuss in die Brust, gebrochenes Bein, geblendet'],['4','tödlich','tot, wenn du nicht widerstehst']]],
    ['p','Stufe 1 und 2 haben je zwei Felder, Stufe 3 eines. Ist die Zeile voll, rutscht neuer Harm eine Stufe höher. Die Strafe gilt, wenn die Verletzung zur Handlung passt. Kurzfristiges wie benommen oder in Panik ist kein Harm, sondern verschlechtert Position oder Effect.']]},
   {h:'Armor',sm:'Kästchen auf dem Bogen',b:[
    ['ul',['<b>Armor:</b> ankreuzen, um eine passende Consequence zu senken oder zu verhindern, <b>statt</b> Resistance zu würfeln. Braucht Armor im Load (2) oder Light Armor (1).','<b>Heavy:</b> ein zweites Kästchen, nur mit schwerer Panzerung (+2 Load). Auf der Gala kaum plausibel.','Verbrauchte Kästchen kommen erst mit dem nächsten Run zurück.','<b>Special:</b> nur wofür deine Fähigkeit es erlaubt (Fizz: Entdeckung und Flucht).','<b>Troll-Panzer:</b> Bastions Extra-Kästchen.']]]},
   {h:'Johnsons Bedingungen',cls:'warnbx',b:[
    ['ul',['<b>Kein Wetwork:</b> vermeidbare Tote sind ausdrücklich unerwünscht.','<b>Dr. Venn</b> darf nicht verletzt werden.','Verletzte oder tote Gäste und Angestellte drücken die Bezahlung.','Kampf ist laut: Schüsse und Explosionen treiben die Alert Clock.']]]},
   {h:'Nichttödlich im Team',b:[
    ['chips',['Betäubungsblitz · Ravn','Stunlock Vial · Fizz','Blasrohr · Stille','Schockhandschuhe · Bastion','Handschellen · Bastion','Bangflash · Pepper Smoke · Tear Gas','EMP gegen Drohnen','Red Rock · Chamäleon']],
    ['p','Sag vorher, dass du nichttödlich vorgehst. Das ändert Position und Effect, nicht die Gefahr für dich.']]},
   {h:'Was ihr über die Sicherheit wisst',b:[
    ['ul',['<b>Gala:</b> diskrete Sicherheitskräfte. Sie wollen vor den VIPs keinen sichtbaren Zwischenfall.','<b>Dorian Kade:</b> Sicherheitschef, verchromte Cyberarme, Pistole, wirkt blitzschnell.','<b>Tresorgeschoss:</b> unbemannt. Sensoren, Schleusen und autonome Sicherheitsdrohnen.']]]},
   {h:'Klüger als kämpfen',b:[
    ['p','Oft besser: umgehen, ablenken, einsperren, täuschen oder einfach schneller sein. Wer Probleme ohne Gewalt löst, hält die Alert Clock niedrig und Johnson zufrieden.']]},
  ]},

 {id:'magie',aud:'player',title:'Magie',c3:true,
  lead:'Magie ist real, aber selten. Ein Erwachter ist für den Run nicht nötig, sieht aber Dinge, die sonst niemand sieht. Alles läuft über dieselben Action Rolls wie jede andere Handlung.',
  boxes:[
   {h:'Wer ist erwacht?',b:[
    ['tbl',['Figur','Magie'],[['Ravn · Mage','Awakened (hermetisch) + Sorcerer: Assense und Zauber'],['Stille · Adept','Weg des Körpers: Mana im eigenen Körper, Adept Senses'],['alle anderen','mundan. Cyberware und Magie vertragen sich schlecht.']],'nw']]},
   {h:'Assense',sm:'Action · nur Awakened',b:[
    ['p','Du öffnest deinen Geist für den Astralraum: Auren, magische Spuren kürzlicher Ereignisse, Geister, Barrieren, magische Gegenstände.'],
    ['ul',['Würfle Assense wie eine Action. Oft ist die Position schlechter als bei Survey, weil der Astralraum selbst gefährlich ist.','Bei einer <b>Desperate</b> Assense-Action markierst du 1 Karma auf der Willpower-Leiste.','Guter Effect: mehr Details, klarere Antworten.']]]},
   {h:'Zauber wirken',sm:'Sorcerer',b:[
    ['ol',['Sag, welchen Zauber du wirkst, auf wen und was er erreichen soll. Du brauchst die Verbindung, die er verlangt (Berührung, Sicht).','Ist das Zaubern gefährlich, würfelst du eine Action, meist <b>Assense</b>. Die SL nennt Position und Effect.','Danach zahlst du die <b>Kosten</b> (siehe unten).']],
    ['p','<b>Spell Focus</b> (Ring aus Meteoreisen): Zauber mit außergewöhnlicher Kontrolle. <b>Arcane Reagents:</b> senken die Edge-Kosten um 1 oder verstärken den Zauber um eine Stufe, zerfallen danach.']]},
   {h:'Kosten & Drain',sm:'Spell Potential = Assense',b:[
    ['tbl',['Zauberstärke','Kosten'],[['unter deinem Potential','1 Edge <i>oder</i> Drain Stufe 1 (dann kein Widerstand)'],['gleich deinem Potential','1 Edge <i>und</i> Drain Stufe 1'],['darüber','1 Edge <i>und</i> Drain Stufe 2']]],
    ['p','Drain ist Special Harm und eine übernatürliche Consequence: du darfst widerstehen. Ravn hat Assense 1, also Potential 1. Wie stark ein Zauber ist, schätzt die SL ein.']]},
   {h:'Konzentration',b:[
    ['p','Manche Zauber halten nur, solange du dich konzentrierst (Schleier). Wird die Konzentration gestört, würfelst du erneut Assense (Drain droht) oder lässt den Zauber fallen: wenn du einen weiteren Zauber wirkst, das Ziel Harm erleidet, Magie gegen dich wirkt oder das Ziel verzweifelt. Das Edge dafür bekommst du erst zurück, wenn der Zauber endet.']]},
   {h:'Ravns Zauber',b:[
    ['tbl',['Zauber','Wirkung'],[['Betäubungsblitz','mentaler Zauber: Ohnmacht statt Wunden. Nichttödlich, lautlos, nur für Erwachte sichtbar. Sichtlinie.'],['Schleier','Trugbild über Person oder Sache. Hält, solange du dich konzentrierst. Täuscht Menschen, <b>keine Kameras</b>.']],'nw']]},
   {h:'Adept',sm:'Stille',b:[
    ['ul',['<b>Adept Senses (1 Edge):</b> minutenlang übermenschlich wahrnehmen: Temperatur, Frequenz, Druck, Gefahr, Lügen.','Übernatürlichen Consequences darfst du mit <b>Body</b> widerstehen.','Deine Aura leuchtet im Astralraum hell wie die eines Magiers.']]]},
   {h:'Gefahren der Magie',cls:'warnbx',b:[
    ['p','Magie kann schiefgehen wie alles andere. Neben dem Drain sind möglich:'],
    ['ul',['Harm durch astrale Rückwirkung (Verbrennung, Schock).','Der Zauber wirkt schwächer, zu stark oder auf das Falsche.','Astrale Aktivität <b>wird bemerkt</b>.']],
    ['p','Resistance gegen Übernatürliches: <b>Ravn</b> als Hermetiker mit Intuition, <b>Stille</b> mit Body, sonst nach Art der Consequence.']]},
   {h:'Magie hinterlässt Spuren',b:[
    ['p','Jeder Zauber trägt deine astrale Signatur, am Ort des Wirkens und am Ziel. Sie verblasst nach wenigen Minuten, lässt sich bis dahin aber aufspüren. Wer leise bleiben will, zaubert gezielt statt ständig.']]},
   {h:'Mundane Gegenmittel',b:[
    ['p','Kein Erwachter dabei? Flashbacks, Study mit Wissen aus dem Netz oder Ausrüstung wie Kessels Search Protocol gleichen viel aus. Kein Hindernis im Turm verlangt zwingend Magie.']]},
  ]},

 {id:'heist',aud:'player',title:'Matrix, Technik & Alert',c3:true,
  lead:'Der Meridian Spire ist voller vernetzter Technik. Hacker haben viele Gelegenheiten zu glänzen, aber kein exklusives Recht. Und: Die Gebäudesicherheit merkt sich, was ihr tut.',
  boxes:[
   {h:'Die Alert Clock',sm:'6 Segmente · sichtbar',b:[
    ['ladder',[['0–1 Routine',C6,'Auffälligkeiten gelten als normale Event-Abweichung.'],['2–3 Verdacht',C45,'Kameras gleichen ab, Türen fragen erneut, Personal wird befragt.'],['4–5 Alarm','var(--alert2)','Drohnen suchen, Aufzüge halten, erkannte Runner werden verfolgt.'],['6 Lockdown',C13,'Fluchtwege zu, externe Response kommt. Eskalation, kein Game Over.']]],
    ['p','Alert ist nicht Heat. Heat zählt erst nach dem Run.']]},
   {h:'Was Alert treibt',b:[
    ['ul',['Kameras oder Gäste sehen etwas','ein Sensor schlägt an','eine falsche Identität wird geprüft','eine Drohne sendet eine Warnung','Türen werden gewaltsam geöffnet','Schüsse, Explosionen, Geschrei','ein Hack hinterlässt eine Spur']]]},
   {h:'Alert senken',sm:'tug-of-war',b:[
    ['p','Nicht „ich würfle gegen Alert“, sondern eine Tat in der Welt:'],
    ['ul',['Wache überzeugen, dass alles harmlos war (Influence)','Kamerabilder durch alte Aufnahmen ersetzen (Interface)','Sensor als Defekt tarnen (Engineer)','Drohne abfangen, bevor sie meldet (Fight, Stalk)','einen Partyzwischenfall inszenieren (Command, Consort)']],
    ['p','Bei Erfolg sinkt Alert nach Effect oder ein Anstieg wird verhindert.']]},
   {h:'Interface & Matrix',b:[
    ['ul',['Einfache Dinge mit vernetzter Technik kann jede Figur mit Interface versuchen. Echtes Hacken (verborgene Geräte finden, Schwachstellen ausnutzen) braucht ein Cyberdeck.','Hacks werden nicht automatisch schwerer. Riskanter erst, wenn eine Gegenmaßnahme läuft, ein Trace begonnen hat oder ein System isoliert wurde.','Was offline ist, lässt sich nur per Kabel am versteckten Datenport hacken, oder mit Händen: Engineer, Finesse, Wreck.']]]},
   {h:'Kessels Werkzeug',sm:'Hacker',b:[
    ['ul',['<b>Search Protocol:</b> alle Online-Geräte in der Nähe sind dir bewusst; +1d beim Sammeln von Informationen über Hochtechnologie.','<b>Scratch-Built Cyberdeck</b> (smart: nicht gegen dich hackbar).','<b>Warez:</b> Armor, Arsenal und Mask nur in VR. Breach öffnet sofort eine Lücke, alarmiert aber das System. Mehrere Warez in einem Run ziehen Aufmerksamkeit.','<b>Blueprints:</b> sag im Run, welche Pläne du geladen hast.']]]},
   {h:'Zephyrs Werkzeug',sm:'Rigger',b:[
    ['ul',['<b>Ace:</b> jedes Fahrzeug mit Finesse starten, steuern und landen; Potency bei schwierigen Manövern.','<b>Libelle:</b> Rotordrohne mit Kamera und Mikro, passt durch den Drohnenschacht.','<b>Utility Harness:</b> u. a. Vehicular Override, Thermite, Hyperglue.']]]},
   {h:'Wege in den Turm',b:[
    ['tbl',['Weg','Stärke · Problem'],[['Glasaufzug','elegant, nah an Venn · Ausrüstung fällt auf, Aufzug protokolliert'],['Frachtaufzug','Werkzeug plausibel, nah an der Keycard · Dienstpläne, falscher Bereich'],['Dach','viel Ausrüstung · Wind, sichtbar, Glasdach'],['Fassadengondel','umgeht den Eingang · protokolliert, von innen sichtbar']],'nw']]},
   {h:'Die Aufgabe',cls:'goldbx',b:[
    ['ul',['Stehlt den <b>schwarzen Aktenkoffer</b> aus dem Tresor.','Er wird <b>ungeöffnet</b> übergeben.','<b>Nichts anderes</b> aus dem Tresor mitnehmen.','Der Tresor braucht die <b>Vault-Keycard</b> und den <b>Augenscan von Dr. Venn</b>.','Bezahlung: <b>6 Nuyen</b> für die Crew.']]]},
  ]},

 /* ================= SPIELLEITUNG ================= */
 {id:'sl-wuerfe',aud:'gm',title:'Würfe leiten',c3:true,
  lead:'Position und Effect ansagen, Consequences wählen, Clocks führen. Grundsatz: Consequences erzeugen neue Situationen, kein Game Over.',
  boxes:[
   {h:'Position im Turm',b:[
    ['tbl',['Position','typisch hier'],[['Controlled','angemeldete Besichtigung, Tarnung sitzt, ruhige Werkstatt, Alert 0–1'],['Risky','Servicetrakt ohne Berechtigung, Gondel im Wind, Wachen in der Nähe'],['Desperate','offen im Sensorkorridor, Wächterdrohnen feuern, Kade im Nahkampf, Lockdown']],'nw'],
    ['p','Alert selbst gibt keinen Würfelmalus; die veränderte Fiktion verschiebt Position und Effect.']]},
   {h:'Consequences',sm:'vier Arten',b:[
    ['ul',['<b>Reduced Effect:</b> eine Effect-Stufe weniger.','<b>Complication:</b> neue Gefahr, Tür verriegelt, Keycard verlegt, Venn misstrauisch. Auf einer Clock: klein 1, normal 2, ernst 3 Segmente.','<b>Lost Opportunity:</b> das Fenster schließt sich, andere Methode nötig.','<b>Harm:</b> siehe unten.']],
    ['p','Eine Complication darf einen Erfolg nicht aufheben. Pro Consequence entweder Resistance oder Armor. Die SL entscheidet, ob Resistance abschwächt oder ganz verhindert, und setzt damit den Ton.']]},
   {h:'Harm nach Position',sm:'Faustregel',b:[
    ['tbl',['Position','Harm'],[['Controlled','Stufe 1'],['Risky','Stufe 2'],['Desperate','Stufe 3 (tödliche Waffen: bis 4)']],'nw'],
    ['p','Das Regelwerk nennt nur Desperate = schwerer Harm; der Rest ist Blades-Praxis. Temporäres (benommen, in Panik) ist eine Complication, kein Harm.']]},
   {h:'Effect-Faktoren',b:[
    ['ul',['<b>Quality:</b> bessere Ausrüstung als der Gegner (Fine Items) = +1.','<b>Scale:</b> Gruppe gegen Einzelne, Drohnenschwarm = ±1.','<b>Potency:</b> Schwachstelle, Überraschung, Magie gegen Mundane, EMP gegen Drohnen = +1.']],
    ['p','Ein dominanter Faktor schlägt alle anderen (einer gegen zwanzig). Zero Effect ist möglich, dann hilft nur ein Setup; über Great hinaus gibt es Extreme Effect.']]},
   {h:'Clocks',b:[
    ['tbl',['Größe','wofür'],[['4–5','komplex: Keycard-Kassette, Wachen im Servicetrakt'],['6–7','komplizierter: Wächterdrohnen, Alert Clock'],['8–10','abschreckend: Manabarriere durchbrechen, Tür ohne Faktoren']],'nw'],
    ['p','Limited 1 · Standard 2 · Great 3 Segmente. Clocks gelten dem Hindernis, nicht der Methode („Wächterdrohnen“, nicht „Drohnen hacken“). Einfaches ohne Clock: ein Wurf entscheidet.']]},
   {h:'Engagement Roll',sm:'Fortune Roll',b:[
    ['p','1W6, je ±1d: kühn / zu verschachtelt · Detail trifft eine Schwäche / das Ziel ist dagegen gewappnet · Kontakte helfen / Rivalen stören. Sprawl Whisperer: +1d.'],
    ['dice',[['6 + 6',CCR,'erstes Hindernis schon überwunden, dominanter Vorteil'],['6',C6,'dominanter Vorteil oder Initiative (Controlled)'],['4/5',C45,'Risky'],['1–3',C13,'Desperate']]],
    ['p','Gilt nur für die ersten Actions. Nicht die Annäherung beschreiben, sondern direkt ins erste Hindernis schneiden.']]},
   {h:'Fortune Roll',b:[
    ['p','Für Ungewisses ohne Runner-Action: Merkt Kade den Ausfall? Würfle einen passenden Wert (Tier, Qualität, Magnitude) oder 1–4W6 nach Lage, ±1d für große Vor- und Nachteile. Critical außergewöhnlich · 6 gut · 4/5 gemischt · 1–3 schlecht.']]},
   {h:'Dragon’s Deals',sm:'+1d für einen Haken',b:[
    ['p','Darf die SL oder jemand am Tisch anbieten. Tritt ein, egal wie der Wurf ausgeht. Nicht zusätzlich zum Pushen.'],
    ['ul',['Die Einladung ist echt, aber jemand erkennt deinen Alias.','Perfekter Scan, aber Venn wird sich an dein Gesicht erinnern.','Die Drohne geht offline, ihr letzter Datenburst ist raus.','Die Gondel bringt euch hin und verriegelt sich danach außen.','Du erreichst den Koffer, die Tresortür schließt sich hinter euch.']]]},
   {h:'Flashback-Preise',b:[
    ['p','0 Edge gewöhnlich, 1 komplex oder unwahrscheinlich, 2+ aufwendig mit Sonderchancen. Danach Action Roll, Fortune Roll oder gar kein Wurf, je nach Gefahr.']]},
  ]},

 {id:'sl-kampf',aud:'gm',title:'Kampf & Gegner',c3:true,
  lead:'Gegner würfeln nicht. Ihr Verhalten und ihre Angriffe entstehen aus den Action Rolls der Runner. Die Sicherheit will isolieren, festhalten und Zeit gewinnen; getötet wird erst bei massiver Eskalation.',
  boxes:[
   {h:'Gala-Sicherheit',sm:'diskret · gut ausgerüstet',b:[
    ['ul',['<b>Ziel:</b> kein sichtbarer Zwischenfall vor den VIPs.','<b>Taktik:</b> höflich ansprechen, trennen, zur Seite bitten, eskortieren. Taser erst hinter Türen.','<b>Clock:</b> ein Paar Wachen ausschalten 4.','<b>Harm:</b> nichttödlich, Stufe 1–2.','<b>Consequences:</b> Funkspruch (Alert +1), Verstärkung, Identität erfasst.']]]},
   {h:'Dorian Kade',sm:'Sicherheitschef',cls:'gmbx',b:[
    ['ul',['Cyberarme, augmentierte Reflexe, Pistole. Ein Meister: Die SL sagt, was er schon getan hat (Waffe gezogen, Ausgang versperrt), und die Runner müssen erst widerstehen, bevor sie handeln.','Offen gegen ihn: <b>Desperate</b>, Effect meist Limited (Qualität, Reflexe).','<b>Clock 6</b>, ihn niederzuringen. Besser: täuschen, ablenken, ihm nicht begegnen.','Schießt nicht in eine Menge. Will den Vorfall klein halten; zieht Leute lieber in einen Nebenraum.','Harm: Stufe 2, mit gezogener Waffe Stufe 3.']]]},
   {h:'Aufklärungsdrohnen',sm:'klein · schnell',b:[
    ['ul',['Kleiner Rahmen (−1 Scale), Flight, Sensor Array. Beobachten, Gesichter erfassen, markieren, verfolgen.','Leicht zu zerstören: ein Standard-Treffer reicht.','<b>Gefahr ist der Datenburst:</b> Alert +1, oder die Identität eines Runners ist erfasst.','Wer sie abfängt, bevor sie meldet, verhindert den Anstieg.']]]},
   {h:'Wächterdrohnen',sm:'gepanzert · bewaffnet',b:[
    ['ul',['Mittlerer Rahmen mit Plating und Turret. <b>Clock 4</b> pro Drohne (6 bei Alert 4+).','Holdout, Messer, Fäuste: Limited. Brutal Weapon, Wreck, EMP: Standard oder Potency.','<b>Schwachstellen:</b> Sensoren, Waffenmodul, Wartungsanschluss im Drohnenknoten.','<b>Nichttödlich zuerst:</b> blockieren, Taser, Sicherungsschaum.','<b>Tödlich</b> nur bei schwerer Bewaffnung der Runner oder massiver Eskalation.']]]},
   {h:'Eskalation der Drohnen',b:[
    ['ladder',[['Routine',C6,'Patrouille nach Muster'],['Besichtigung',C6,'begleiten, zählen, Identitäten vergleichen'],['Unregelmäßigkeit',C45,'dazwischenstellen, Re-Auth fordern, Wege blockieren, trennen'],['Körperlich','var(--alert2)','festhalten, Taser, Schaum'],['Waffen',C13,'nur bei schwerer Bewaffnung oder Massiv-Eskalation']]]]},
   {h:'Externe Response',sm:'ab Alert 6',b:[
    ['p','Viel Zeit übrig: <b>Response Clock 4</b>. Wenn voll, trifft ein schwer bewaffnetes Team ein, dann Flucht statt Kampf. Wenig Zeit: Die nächste große Consequence ist eintreffende Verstärkung.']]},
   {h:'Harm im Turm',b:[
    ['tbl',['Stufe','Beispiele'],[['1','Schnittwunde am Glas, verstauchter Knöchel, Pfeffer: „Sickened“'],['2','tiefer Schnitt, Gehirnerschütterung nach dem Sturz auf der Treppe'],['3','Schuss aus einer Wächterdrohne, Sturz durch das Glasdach'],['4','nur Desperate mit tödlichen Mitteln']],'nw'],
    ['p','Bangflash, Taser-Zittern, im Schaum festgeklebt: temporäre Complication (benommen, festgehalten), kein Harm.']]},
   {h:'Der Sprengsatz im Koffer',cls:'warnbx',b:[
    ['ul',['Nur wer öffnet, riskiert ihn. Wer den Koffer zulässt, erfährt nie davon.','Entdecken: Survey, Study, Engineer oder Interface, je nach Methode.','Entschärfen: in Ruhe Risky, unter Drohnenbeschuss Desperate.','Detonation: Inhalt zerstört, Harm Stufe 3 für die haltende Person (keine Todesfalle), Alert steigt deutlich.']]]},
   {h:'Gewalt & Payoff',cls:'goldbx',b:[
    ['ul',['Verletzte oder tote Gäste oder Personal: mindestens wie High Alert (3 Nuyen).','Venn schwer verletzt oder getötet: Vertragsbruch.','<b>Veyrath kämpft nie.</b> Schießt jemand auf ihn, zieht er sich zurück.']]]},
  ]},

 {id:'sl-magie',aud:'gm',title:'Magie im Turm',c3:true,
  lead:'Das Magische im Meridian Spire und was Erwachte dort sehen können. Magie ist ein weiterer Weg, keine Pflicht: Jedes Hindernis lässt sich auch mundan lösen.',
  boxes:[
   {h:'Die Vault-Hülle',sm:'Eigenkreation',cls:'gmbx',b:[
    ['ul',['Kultiviertes lebendes Gewebe in den Wänden: dunkle Fasern wie Wurzeln oder Muskel.','Trägt eine <b>duale Manabarriere</b>: physisch und astral. Astrales Ausspähen oder Durchdringen ist erheblich erschwert.','Reagiert auf Bohren und Erschütterung, kleine Wunden schließen sich.','Bei Alarm verdichten sich die Fasern.','Beschädigung ist sichtbar: Fasern zucken, dunkle Flüssigkeit tritt aus.']]]},
   {h:'Barriere überwinden',b:[
    ['ul',['<b>Durchbrechen:</b> Clock 8, Desperate, jeder Wurf Alert +1. Laut und langsam.','<b>Tür studieren:</b> Assense oder Study am regulären Durchgang zeigt, wie die Barriere kontrolliert geöffnet wird. Das ist ein Setup: +1 Effect oder bessere Position für den eigenen Weg hinein.','<b>Wand angreifen:</b> Gewebe reagiert, heilt, verdichtet sich. Beschädigung der Hülle zählt für Veyrath wie Schaden an der Sammlung.']]]},
   {h:'Der astrale Watcher',sm:'optional',b:[
    ['ul',['Patrouilliert außen an der Barriere. Kein Kampfgegner.','Bemerkt ungewöhnliche astrale Aktivität in seiner Nähe: <b>Alert +1</b>.','Zählt dazu: Zauber, dauerhaftes Assense, Stilles helle Aura.','Ablenken (Assense, Influence) oder still bleiben. Banishing Focus: Potency, um ihn zu vertreiben.']]]},
   {h:'Was Assense zeigt',b:[
    ['tbl',['Effect','Erkenntnis'],[['Limited','Hier ist starke Magie; eine Wand „lebt“; etwas beobachtet astral.'],['Standard','Duale Barriere, Watcher und seine Runde, Koffer-Aura unter den Stücken.'],['Great','Wie sich die Barriere am Durchgang öffnet; welche Antiquitäten magisch sind; die Barriere ist alt und teuer, kein Konzern baut so etwas für Kunst.']],'nw']]},
   {h:'Magisches im Hort',b:[
    ['ul',['<b>Der Koffer:</b> schwache, alte, harmlose Aura. Auffällig für Erwachte, löst nichts aus.','<b>Magische Antiquitäten:</b> von teuren, mundanen Stücken zu unterscheiden. Eine davon ist verlockend leicht mitzunehmen. Keine Falle.']]]},
   {h:'Zauber in der Praxis',b:[
    ['ul',['<b>Betäubungsblitz</b> auf eine Wache: Assense, Risky, lautlos, nichttödlich. Eine Wache ist schwach: Kosten 1 Edge oder Drain 1. Nahe Ebene 110 bemerkt der Watcher ihn.','<b>Schleier:</b> Menschen sehen das Trugbild, <b>Kameras die Wahrheit</b>. Braucht Konzentration; wird sie gestört, erneut Assense oder der Schleier fällt.','Die Signatur des Zaubers bleibt Minuten lang an Ort und Ziel haften und lässt sich verfolgen.']]]},
   {h:'Magische Consequences',b:[
    ['ul',['<b>Drain</b> kommt aus den Zauberkosten (Spell Potential = Assense-Rating, Ravn 1): darunter 1 Edge oder Drain 1, gleich 1 Edge + Drain 1, darüber 1 Edge + Drain 2.','Aus dem Wurf: Harm durch Rückwirkung („leicht angesengt“, Stufe 1), Zauber außer Kontrolle.','Astrale Aufmerksamkeit: Watcher meldet, Alert +1.','Resistance: Ravn (hermetisch) Intuition, Stille Body. Desperate Assense: 1 Karma auf Willpower.']]]},
   {h:'Spuren zu Veyrath',cls:'goldbx',b:[
    ['ul',['<b>Ravn</b> erkennt die gezüchtete Dual-Barriere als Jahrzehnte-Arbeit: Hier sitzt jemand sehr Altes.','Vesna (Ravns Geist) sagte, der Turm „habe einen Herzschlag“.','<b>Stilles</b> Strange Trinket zeigt vor der Tresortür vielleicht einen gewaltigen Schatten über der Fassade.','Verdiente Wahrheit nicht künstlich zurückhalten.']]]},
   {h:'Veyrath',sm:'Enthüllung',b:[
    ['ul',['Erscheint erst bei oder nach der Flucht und spricht per Drachensprache direkt in die Gedanken.','<b>Anblick eines Drachen:</b> Wer ihn sieht, erstarrt oder flieht, außer bei Resistance mit Willpower. Hält er Abstand, reicht ein kurzer Schreck.','Drachen sind dual: ihr astrales Bewusstsein ist weithin sichtbar, außer sie verbergen es. Veyrath verbirgt sich im Turm.','Bewertet, droht nicht, blockiert nicht. <b>Nie eine Kampfbegegnung.</b>']]]},
  ]},

 {id:'sl-alert',aud:'gm',title:'Alert, Matrix & Payoff',c3:true,
  lead:'Die Alert Clock ersetzt Heat während des Runs. Sie steigt, wenn eine Handlung plausibel Aufmerksamkeit erzeugt, und sinkt, wenn die Fiktion es zulässt.',
  boxes:[
   {h:'Alert-Stufen',sm:'6 Segmente',b:[
    ['ladder',[['0–1 Routine',C6,'Event-Abweichung. Standardpatrouillen. Niemand sucht.'],['2–3 Verdacht',C45,'Kameras gleichen ab, Türen fordern Re-Auth, Drohnen beobachten, Personal wird befragt.'],['4–5 Alarm','var(--alert2)','Drohnen suchen gezielt, Servicewege gesperrt, Aufzüge halten oder leiten um, erfasste Runner werden verfolgt.'],['6 Lockdown',C13,'Alarm bestätigt, Fluchtwege zu, externe Response verständigt.']]]]},
   {h:'Wie viel Alert?',b:[
    ['tbl',['Auslöser','Alert'],[['kleine Complication: falscher Bereich, Watcher bemerkt Magie','+1'],['Complication: Identität geprüft und gescheitert, Drohnenmeldung','+2'],['ernste Complication: Tür aufgebrochen, Schüsse, Explosion','+3'],['Handlung wirkt direkt gegen die Clock','nach Effect 1/2/3']],'nw'],
    ['p','Nicht jeder Fehlschlag erhöht Alert. Harm, verlorene Ausrüstung oder eine blockierte Tür sind oft passender.']]},
   {h:'Alert senken',b:[
    ['p','Nur mit einer konkreten Tat: überzeugende Erklärung, alte Kamerabilder, Sensor als Defekt, Drohne abgefangen, Türprotokoll als Wartung, Partyzwischenfall als Ausrede. Erfolg: Alert sinkt nach Effect oder ein drohender Anstieg entfällt.']]},
   {h:'Vernetzte Systeme',b:[
    ['tbl',['System','Hebel'],[['Gästeliste, Dienstpläne','Namen einschleusen, Schicht fälschen'],['Kameras','Loop, alte Aufnahmen, Blickwinkel'],['Aufzüge','anhalten, umleiten, Etage fälschen'],['Türprotokolle','Zugang als Wartung tarnen'],['Fassadengondel','Fahrbefehl, Andockpunkt 110'],['Drohnen','Zielerkennung täuschen, Befehle, Wartungsanschluss'],['Skycab-Transponder','Landefreigabe auf dem Dach']],'nw']]},
   {h:'Offline',b:[
    ['ul',['<b>Der Koffer</b> sendet nichts und ist nicht über die Matrix zu orten. Offline heißt: nur per Kabel direkt am Gerät hackbar.','<b>Keycard-Kassette</b> im Eventbüro: Entnahme wird protokolliert, aber das Schloss ist physisch.','Die <b>Tresortür</b> protokolliert jeden Versuch; ein sauberer Doppelzugang löst keinen Alarm aus.']]]},
   {h:'Matrix-Consequences',b:[
    ['ul',['ICe alarmiert oder stellt den Hacker; nächster Hack Desperate.','„Traced“-Clock: wenn voll, ist der Standort bekannt. Offline gehen löscht sie, bricht aber alle Übernahmen ab.','Gerät beschädigt, abgeschaltet oder gejackt; Ziel-Icon verborgen.','Exposure: verwertbare Spur, Alert +1 (nach dem Run Heat).','Breach öffnet sofort, alarmiert aber das System.']],
    ['p','Wiederholte Versuche werden nur schwerer, wenn die Fiktion einen Grund liefert.']]},
   {h:'Payoff',cls:'goldbx',b:[
    ['tbl',['Alert am Ende','Nuyen'],[['Low 0–1','6'],['Medium 2–5','5'],['High / Lockdown 6','3']],'nw'],
    ['ul',['Verletzte oder tote Gäste oder Personal: mindestens wie High Alert.','Venn schwer verletzt oder getötet: klarer Vertragsbruch.','Schaden an der Sammlung oder Zusatzbeute kann weiter kürzen und beendet Folgeaufträge.']]]},
   {h:'Veyraths Urteil',b:[
    ['tbl',['Ergebnis','wenn …'],[['Ideal','Koffer zu, keine Beute, Sammlung heil, Venn unverletzt, wenig Gewalt, Teamwork'],['Brauchbar','Auftrag erfüllt, aber Medium/High Alert oder vermeidbare Eskalation'],['Ungeeignet','Koffer geöffnet (auch fachgerecht), Inhalt zerstört, Venn verletzt, Beute, wahllose Tötungen']],'nw']]},
   {h:'Heat danach',sm:'optional',b:[
    ['p','Nur bei Weiterspiel: 0 smooth & quiet, 2 contained, 4 loud & chaotic, 6 wild. +1 hochprofiliges Ziel, +2 bei Tötungen (egal durch wen). Nicht von der Alert Clock übernehmen.']]},
  ]},
 ],
};
