# Shadowrun: Feuerprobe

Spielmaterial für den Oneshot **„Feuerprobe“** (Shadowrun, Seattle 2080) mit dem Regelsystem **Runners in the Shadows** (Forged in the Dark).

Eine kleine Crew soll während einer Gala im 112-stöckigen **Meridian Spire** einen Aktenkoffer aus dem privaten Tresorgeschoss stehlen. Was sie nicht weiß: Turm, Tresor und Koffer gehören dem Drachen Veyrath, und der Auftrag ist seine Feuerprobe für die Crew.

## Inhalt

| Ordner | Inhalt |
|---|---|
| `oneshot/` | Das Abenteuer als Markdown: Briefing, Gala, Tresorgeschoss, Alert Clock, Enthüllung, Payoff. |
| `docs/meridian-spire-plaene.html` | Interaktive Pläne: Schnitt, Tiefgarage P2, Ebene 111 (Gala), Ebene 112 (Lounge & Suite), Dach, Ebene 110 (Tresorgeschoss). SL-/Spieleransicht, Wege-Overlay, nummerierte Orte mit SL-Notizen, Deutsch/Englisch. Die Druckansicht liefert SL-Pläne (Kartenblatt plus Notizblatt je Ebene) oder Spielerpläne (nur Kartenblatt), A4 quer. |
| `docs/feuerprobe-runner.html` | Acht vorgefertigte Runner mit Werten, Fähigkeiten, Ausrüstung, Kontakten, Spieltipps für den Turm und Welt-Einblicken. Klickbare Edge-, Harm- und Load-Tracker. Mit SL-Notizen. |
| `docs/feuerprobe-runner-bogen.html` | Dieselben Runner als Spielerbögen zum Austeilen: ein Runner pro A4, ohne SL-Notizen, mit Schreiblinien für Straßenname, Name und Pronomen sowie Kästchen für Edge, Harm, Karma, Load und Nuyen. |
| `docs/pdf/de/`, `docs/pdf/en/` | Fertige PDFs: Spielerbögen (`feuerprobe-runner-alle.pdf` und `bogen-<runner>.pdf`; englisch `feuerprobe-runners-all.pdf`, `sheet-<runner>.pdf`) sowie die Pläne als SL-Version (`plaene-sl.pdf` / `plans-gm.pdf`) und Spielerversion (`plaene-spieler.pdf` / `plans-players.pdf`). |
| `docs/index.html` | Startseite (DE/EN umschaltbar) mit Links auf alle Seiten und PDFs; die Sprachwahl wird an die verlinkten Seiten weitergegeben. |
| `docs/artifact/` | Dieselben Seiten als Fragment ohne `<html>`-Gerüst, wie claude.ai-Artifacts sie erwarten. |
| `src/` | Quellteile beider Seiten (Stylesheet, Gerüst, Renderer, Daten pro Ebene bzw. pro Runner). |
| `build.js` | Fügt die Quellteile zu den Seiten in `docs/` zusammen. |

## Benutzen

Die fertigen Seiten in `docs/` lassen sich direkt im Browser öffnen, brauchen keinen Server und funktionieren offline (nur die Schriften kommen von Google Fonts). Zum Drucken die Druckfunktion des Browsers verwenden: Die Pläne liegen je Ebene auf einer A4-Querseite, die Runner je Figur auf ein bis zwei Seiten.

Nach Änderungen an den Quellteilen:

```bash
node build.js
```

Wer die Seiten über einen lokalen Server ansehen möchte (zum Beispiel für die Browser-Vorschau in Claude Code):

```bash
node tools/serve.js
```

Die Runner sind bewusst ohne Vornamen und Geschlecht geschrieben: Der große Titel ist nur der Straßenname, Name und Pronomen tragen die Spielenden oben im Bogen selbst ein. Auf den Spielerbögen ist auch der Straßenname eine Schreiblinie; der Vorschlag steht klein daneben.

**Deutsch und Englisch.** Pläne, Dossiers und Spielerbögen haben oben einen Umschalter DE/EN. Bei den Plänen liegen die kurzen Beschriftungen als Wörterbuch in `src/plaene/p11_en_dict.js` (deutscher Text → englischer Text; fehlt ein Eintrag, bleibt der deutsche Text stehen), die langen Texte nach Ebene und Nummer in `p12`–`p14`. Dossiers und Spielerbögen Die deutschen Texte sind die Basis (`r3_data_a.js`, `r4_data_b.js`), die englischen liegen als Übersetzungsschicht daneben (`r3b_en_a.js`, `r4b_en_b.js`) und werden beim Umschalten über die Basis gelegt. Wer eine Datei direkt öffnet, kann die Sprache auch per `?lang=en` vorgeben; so erzeugt auch `tools/make-pdf.js` die englischen PDFs.

PDFs der Spielerbögen erzeugt (mit installiertem Edge oder Chrome):

```bash
node tools/make-pdf.js
```

Ohne PDF-Skript: `docs/feuerprobe-runner-bogen.html` im Browser öffnen, oben einen Bogen wählen und mit Strg+P drucken (A4, Hochformat, ohne Kopf- und Fußzeilen).

## Pläne anpassen

Jede Ebene ist eine Datei in `src/plaene/` (`p4_111.js`, `p5_112.js`, `p6_dach.js`, `p7_110.js`, `p8_garage.js`, `p9_schnitt.js`). Räume, Türen, Möbel, Sensoren, Personen, Wege und Marker sind Daten in Metern (1 Einheit = 1 m, Plattenmaß 46 × 34 m). Einträge mit `gm:true` erscheinen nur in der SL-Ansicht. Der Renderer in `p3_render.js` zeichnet daraus das SVG.

## Runner anpassen

Die Figuren stehen in `src/runner/r3_data_a.js` und `r4_data_b.js`. Jede Figur hat 7 Action-Punkte (maximal 2 pro Action), eine Startfähigkeit (Erwachte zusätzlich ihre Pflichtfähigkeit), Gegenstände mit Load und eine SL-Notiz.

Regelstand ist Runners in the Shadows 0.998: Attribute Intuition, Body, Willpower; Actions Engineer, Interface, Stalk, Survey / Fight, Finesse, Prowl, Wreck / Command, Consort, Influence, Study; Edge 9; Load 3/5/6. Die drei festen Playbook-Startpunkte sind nach den Blades-Vorbildern verteilt; weichen sie vom Playbook-Bogen ab, verschiebt man einen freien Punkt.

## Hinweis

Fan-Material für den privaten Spieltisch. *Runners in the Shadows* ist ein Spiel von Mark Cleveland Massengale, *Shadowrun* eine Marke von The Topps Company / Catalyst Game Labs. Meridian Spire, Vesperline Collections, Veyrath, Dr. Amara Venn, Dorian Kade und alle Runner sind Eigenkreationen für diesen Oneshot.
