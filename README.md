# Shadowrun: Feuerprobe

Spielmaterial für den Oneshot **„Feuerprobe“** (Shadowrun, Seattle 2080) mit dem Regelsystem **Runners in the Shadows** (Forged in the Dark).

Eine kleine Crew soll während einer Gala im 112-stöckigen **Meridian Spire** einen Aktenkoffer aus dem privaten Tresorgeschoss stehlen. Was sie nicht weiß: Turm, Tresor und Koffer gehören dem Drachen Veyrath, und der Auftrag ist seine Feuerprobe für die Crew.

## Inhalt

| Ordner | Inhalt |
|---|---|
| `oneshot/` | Das Abenteuer als Markdown: Briefing, Gala, Tresorgeschoss, Alert Clock, Enthüllung, Payoff. |
| `docs/meridian-spire-plaene.html` | Interaktive Pläne: Schnitt, Tiefgarage P2, Ebene 111 (Gala), Ebene 112 (Lounge & Suite), Dach, Ebene 110 (Tresorgeschoss). SL-/Spieleransicht, Wege-Overlay, nummerierte Orte mit SL-Notizen, Druckbögen. |
| `docs/feuerprobe-runner.html` | Acht vorgefertigte Runner mit Werten, Fähigkeiten, Ausrüstung, Kontakten, Spieltipps für den Turm und Welt-Einblicken. Klickbare Edge-, Harm- und Load-Tracker. |
| `docs/index.html` | Startseite mit Links auf beide Seiten. |
| `docs/artifact/` | Dieselben Seiten als Fragment ohne `<html>`-Gerüst, wie claude.ai-Artifacts sie erwarten. |
| `src/` | Quellteile beider Seiten (Stylesheet, Gerüst, Renderer, Daten pro Ebene bzw. pro Runner). |
| `build.js` | Fügt die Quellteile zu den Seiten in `docs/` zusammen. |

## Benutzen

Die fertigen Seiten in `docs/` lassen sich direkt im Browser öffnen, brauchen keinen Server und funktionieren offline (nur die Schriften kommen von Google Fonts). Zum Drucken die Druckfunktion des Browsers verwenden: Die Pläne liegen je Ebene auf einer A4-Querseite, die Runner je Figur auf ein bis zwei Seiten.

Nach Änderungen an den Quellteilen:

```bash
node build.js
```

## Pläne anpassen

Jede Ebene ist eine Datei in `src/plaene/` (`p4_111.js`, `p5_112.js`, `p6_dach.js`, `p7_110.js`, `p8_garage.js`, `p9_schnitt.js`). Räume, Türen, Möbel, Sensoren, Personen, Wege und Marker sind Daten in Metern (1 Einheit = 1 m, Plattenmaß 46 × 34 m). Einträge mit `gm:true` erscheinen nur in der SL-Ansicht. Der Renderer in `p3_render.js` zeichnet daraus das SVG.

## Runner anpassen

Die Figuren stehen in `src/runner/r3_data_a.js` und `r4_data_b.js`. Jede Figur hat 7 Action-Punkte (maximal 2 pro Action), eine Startfähigkeit (Erwachte zusätzlich ihre Pflichtfähigkeit), Gegenstände mit Load und eine SL-Notiz.

Regelstand ist Runners in the Shadows 0.998: Attribute Intuition, Body, Willpower; Actions Engineer, Interface, Stalk, Survey / Fight, Finesse, Prowl, Wreck / Command, Consort, Influence, Study; Edge 9; Load 3/5/6. Die drei festen Playbook-Startpunkte sind nach den Blades-Vorbildern verteilt; weichen sie vom Playbook-Bogen ab, verschiebt man einen freien Punkt.

## Hinweis

Fan-Material für den privaten Spieltisch. *Runners in the Shadows* ist ein Spiel von Mark Cleveland Massengale, *Shadowrun* eine Marke von The Topps Company / Catalyst Game Labs. Meridian Spire, Vesperline Collections, Veyrath, Dr. Amara Venn, Dorian Kade und alle Runner sind Eigenkreationen für diesen Oneshot.
