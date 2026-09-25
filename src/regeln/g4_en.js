/* ---------- Cheat sheets: English data (same structure as SHEETS_DE) ---------- */
const SHEETS_EN={
 ui:{title:'Cheat Sheets',subtitle:'Combat, magic, Matrix and core rules for the Trial by Fire',eyebrow:'Shadowrun · Feuerprobe · Runners in the Shadows',
  all:'All',player:'Players',gm:'GM',home:'Home',guide:'GM Guide',print:'Print',audPlayer:'For players',audGm:'GM only',
  foot:'Feuerprobe · Runners in the Shadows · Cheat sheet',
  fine:'Fan material for the private gaming table. <i>Runners in the Shadows</i> is a Forged in the Dark game by Mark Cleveland Massengale; <i>Shadowrun</i> is a trademark of The Topps Company / Catalyst Game Labs. These sheets summarise the rules as this one-shot uses them; where it says “one-shot”, it is a recommendation for this run, not an official rule. When in doubt, the rulebook wins. To print, pick “Players” or “GM” above: every sheet is one A4 page.'},
 sheets:[
 /* ================= PLAYERS ================= */
 {id:'grundregeln',aud:'player',title:'Core rules',c3:true,
  lead:'Fiction first: say what your runner does and what they want to achieve. You only roll when something dangerous or uncertain is at stake.',
  boxes:[
   {h:'Action roll',sm:'as many d6 as your action rating',b:[
    ['p','Roll and count only the <b>highest</b> die.'],
    ['dice',[['6 + 6',CCR,'<b>Critical:</b> success with an extra benefit.'],['6',C6,'<b>Full success.</b> You get what you wanted.'],['4/5',C45,'<b>Success with a consequence.</b> It works, but it costs.'],['1–3',C13,'<b>Bad outcome.</b> No or the wrong success, plus a consequence.']]],
    ['p','<b>0 dots</b> in the action: roll 2d6 and take the <b>lower</b>, no critical.']]},
   {h:'Position',sm:'how bad can it get?',b:[
    ['tbl',['Position','Meaning'],[['Controlled','You have the upper hand. Mild consequences; you can often back off.'],['Risky','The default. Things can go seriously wrong.'],['Desperate','You are in deep trouble. Consequences are severe.']],'nw'],
    ['p','The GM states position and effect <b>before</b> the roll. You may negotiate or pick another approach.']]},
   {h:'Effect',sm:'how much do you achieve?',b:[
    ['tbl',['Effect','Clock segments'],[['Limited','1 · partial, half a job'],['Standard','2 · what you would expect'],['Great','3 · more than expected']],'nw'],
    ['p','More effect from the right gear, surprise, good preparation. Less from superior numbers, armour, level 1 harm. You may trade position for effect: riskier for more impact.']]},
   {h:'Edge',sm:'9 boxes · your reserve',b:[
    ['ul',['<b>Push (2 edge per benefit):</b> +1d, +1 effect, or act despite level 3 harm.','<b>Assist (1 edge):</b> a teammate gets +1d. Only one assist per roll. You may suffer consequences yourself.','<b>Dragon’s deal:</b> instead of pushing, +1d if you accept a catch offered by the GM or anyone at the table. The catch happens whatever the roll.','<b>Resistance:</b> costs edge (see below).']],
    ['note','warn','<b>Edge full?</b> You take a <b>trauma</b> (Cold, Haunted, Obsessed, Paranoid, Reckless, Soft, Unstable, Vicious) and are out for the rest of the scene. Edge clears.'],
    ['p','There is no recovery tonight: edge and harm stay until the run is over.']]},
   {h:'Resistance roll',sm:'soften a consequence',b:[
    ['p','A consequence hits you? <b>Resistance always works</b>: the GM says whether it is reduced or avoided entirely. The roll only sets the price.'],
    ['ul',['The GM names the matching <b>attribute</b> (value on your sheet).','Cost: <b>6 minus your highest die</b> in edge (5 at most).','Critical: you regain 1 edge.','Decide first, then roll. One roll per consequence, and not on top of armour.']],
    ['tbl',['Attribute','against …'],[['Intuition','deception, surprise'],['Body','physical strain, injury'],['Willpower','mental strain, resolve, fear']],'nw']]},
   {h:'Teamwork',sm:'better together',b:[
    ['ul',['<b>Assist:</b> 1 edge, +1d for someone else.','<b>Setup:</b> your action prepares the next one. Success gives the team +1 effect or a better position.','<b>Group action:</b> one person leads, everyone rolls the same action, the best result counts. The leader pays 1 edge for each 1–3 in the group.','<b>Protect:</b> step in front of a consequence meant for someone else and take it yourself (resistance allowed).']]]},
   {h:'Flashback',sm:'preparation after the fact',b:[
    ['p','You don’t have to plan ahead. Mid-run, explain what you had already done.'],
    ['tbl',['Edge','Example'],[['0','ordinary, easy opportunity: you scouted the way to the garage.'],['1','complex or unlikely: a weapon is already stashed in the penthouse.'],['2+','elaborate, special opportunities: your name is on the guest list.']],'nw'],
    ['p','Then it works like any action: sometimes an action roll, sometimes a fortune roll, sometimes no roll at all. A flashback isn’t time travel and can’t undo anything.']]},
   {h:'Load',sm:'choose before the run',b:[
    ['tbl',['Load','Effect'],[['Light 3','faster, inconspicuous, fits the gala. Armoured clothing or one bulky item.'],['Normal 4–5','looks like trouble. Heavy armour or two bulky items.'],['Heavy 6','slower, looks like an operative. Up to three bulky items.']],'nw'],
    ['p','You only decide which items you carry when you need them. Tick them off until your load is reached.']]},
   {h:'Plan & engagement',sm:'no hour-long planning',b:[
    ['p','Pick a plan and name the detail. The GM rolls the <b>engagement roll</b> and cuts straight to the first danger.'],
    ['tbl',['Plan','Detail'],[['Assault','point of attack'],['Deception','method'],['Social','connection'],['Stealth','entry point'],['Supernatural','magical method'],['Transport','route & means']],'nw'],
    ['p','A bad engagement doesn’t mean you planned badly. Only that it starts hot.']]},
  ]},

 {id:'actions',aud:'player',title:'Which action?',c3:true,
  lead:'Actions are things you do, not knowledge skills. Not “I roll Interface” but: what does your character do? That gives the action. Often several fit; your method sets position and effect.',
  boxes:[
   {h:'Intuition',sm:'resists deception & surprise',b:[
    ['tbl',['Action','In the Meridian Spire'],[['Engineer','rewire the gondola controls, copy the keycard, build a retina duplicate, disarm a safeguard'],['Interface','loop cameras, edit the guest list, reroute a lift, forge a door log, take over a drone'],['Stalk','tail Dr. Venn unnoticed, pick up Kade’s trail, aimed shot at a drone’s optics'],['Survey','predict Kade’s round, spot the corridor sensors, find an escape route, read the crowd']]]]},
   {h:'Body',sm:'resists injury & strain',b:[
    ['tbl',['Action','In the Meridian Spire'],[['Fight','overpower a guard, melee a guardian drone, shove a pistol in someone’s face, hold a position'],['Finesse','lift the keycard from a pocket, steer the gondola in the wind, land a skycab, disarm'],['Prowl','sneak through the service wing, climb the façade, slip past light barriers, take someone out from ambush'],['Wreck','force a door, tear up cover, smash a drone, blast a wall']]]]},
   {h:'Willpower',sm:'resists fear, pressure, magic',b:[
    ['tbl',['Action','In the Meridian Spire'],[['Command','boss staff around, intimidate a guard, calm panicking guests'],['Consort','network with collectors, draw Venn into an expert talk, call a contact'],['Influence','fool the reception, talk Venn into the airlock, soothe a guard'],['Study','research provenance, analyse blueprints, detect lies, study a spell formula']]]]},
   {h:'Assense',sm:'Awakened only',b:[
    ['p','Perceive astrally: auras, emotions, spirits, barriers, magical objects. Counts towards the 7 action dots. Dangerous spellcasting is usually rolled with Assense. More on the <b>Magic</b> sheet.']]},
   {h:'The right question',b:[
    ['ol',['What do you want to achieve?','How exactly do you do it?','What is at stake?']],
    ['p','The GM names action, position and effect. If the position sounds too bad, change your approach before you roll.']]},
   {h:'No roll needed',b:[
    ['p','You are professionals. Routine without danger just works: take a drink, look around the salon, use a commlink, call the lift.']]},
   {h:'Knowledge, not dice',b:[
    ['p','Whether your character knows something depends on their background. Just ask the GM. You roll when you <i>obtain</i> knowledge under pressure, for example with Study or Survey.']]},
   {h:'Gather information',sm:'before the run',b:[
    ['p','One or two pointed questions per person are enough. Good questions: Where is the keycard? How do I get to Dr. Venn? What gear stands out? Is there a second way in? What lies beneath the penthouse?']]},
  ]},

 {id:'kampf',aud:'player',title:'Combat',c3:true,
  lead:'No initiative, no rounds, no hit points for enemies. You describe goal and method, roll one action, and enemies act through the consequences. One roll can cover a whole exchange.',
  boxes:[
   {h:'How a fight works',b:[
    ['ol',['Say <b>what you want to achieve</b>: blind the drone, take the guard down, hold the corridor.','Say <b>how</b>: weapon, cover, timing, teamwork.','The GM names position and effect. Tough enemies get a <b>clock</b>.','Roll. The roll counts for both sides: <b>6</b> you win, <b>4/5</b> both have their effect, <b>1–3</b> the enemy wins.']],
    ['p','Very dangerous enemies act first. Then you must resist before you can act yourself.']]},
   {h:'Combat actions',b:[
    ['tbl',['Action','for'],[['Fight','melee, brawling, a gun at speaking distance, holding a position'],['Stalk','precision shooting from a distance, arranging an ambush'],['Prowl','attack from hiding'],['Finesse','disarm, duel, drive a vehicle'],['Wreck','savage force, destroy cover and doors, sabotage'],['Command','intimidate, force surrender'],['Assense','spells under danger (Awakened only)']],'nw']]},
   {h:'What changes effect',b:[
    ['ul',['<b>Numbers:</b> more or bigger enemies = less effect.','<b>Armour:</b> a holdout pistol barely scratches an armoured drone.','<b>Potency:</b> the right weapon, surprise, a weak spot (EMP against drones, shooting out optics) = more effect.','<b>Preparation:</b> setup action or flashback.']]]},
   {h:'Harm',sm:'level 4 = fatal',b:[
    ['tbl',['Level','Effect','Example'],[['1 lesser','less effect','scraped, sprained, tired'],['2 moderate','−1d','deep cut, concussion'],['3 severe','incapacitated: only with help or pushing','shot in the chest, broken leg, blinded'],['4','fatal','dead unless you resist']]],
    ['p','Levels 1 and 2 have two slots each, level 3 one. If a row is full, new harm moves up a level. The penalty applies when the injury fits the action. Short-lived states like dazed or panicked are not harm; they worsen position or effect.']]},
   {h:'Armour',sm:'boxes on your sheet',b:[
    ['ul',['<b>Armor:</b> mark to reduce or avoid a fitting consequence <b>instead of</b> rolling resistance. Needs Armor in your load (2) or Light Armor (1).','<b>Heavy:</b> a second box, heavy armour only (+2 load). Hardly plausible at the gala.','Each box works once per evening.','<b>Special:</b> only for what your ability allows (Fizz: detection and escape).','<b>Troll armor:</b> Bastion’s extra box.']]]},
   {h:'Johnson’s conditions',cls:'warnbx',b:[
    ['ul',['<b>No wetwork:</b> avoidable deaths are explicitly unwanted.','<b>Dr. Venn</b> must not be harmed.','Injured or dead guests and staff cut the pay.','Fighting is loud: gunfire and explosions push the alert clock.']]]},
   {h:'Non-lethal in the crew',b:[
    ['chips',['Stunbolt · Ravn','Stunlock Vial · Fizz','Blowgun · Hush','Shock gloves · Bastion','Manacles · Bastion','Bangflash · Pepper Smoke · Tear Gas','EMP against drones','Red Rock · Chameleon']],
    ['p','Say up front that you go non-lethal. That changes position and effect, not the danger to you.']]},
   {h:'What you know about security',b:[
    ['ul',['<b>Gala:</b> discreet security. They want no visible incident in front of the VIPs.','<b>Dorian Kade:</b> head of security, chrome cyberarms, pistol, lightning fast.','<b>Vault level:</b> unstaffed. Sensors, airlocks and autonomous security drones.']]]},
   {h:'Smarter than fighting',b:[
    ['p','Often better: bypass, distract, lock in, deceive or simply be faster. Solving problems without violence keeps the alert clock low and Johnson happy.']]},
  ]},

 {id:'magie',aud:'player',title:'Magic',c3:true,
  lead:'Magic is real but rare. An Awakened runner is not required, but sees things nobody else does. Everything runs through the same action rolls as any other deed.',
  boxes:[
   {h:'Who is Awakened?',b:[
    ['tbl',['Runner','Magic'],[['Ravn · Mage','Awakened (hermetic) + Sorcerer: Assense and spells'],['Hush · Adept','Way of the Body: mana in their own body, Adept Senses'],['everyone else','mundane. Cyberware and magic don’t mix well.']],'nw']]},
   {h:'Assense',sm:'action · Awakened only',b:[
    ['p','You open your mind to the astral: auras, arcane traces of recent events, spirits, barriers, magical objects.'],
    ['ul',['Roll Assense like any action. The position is often worse than with Survey, because the astral itself is dangerous.','Good effect: more detail, clearer answers.']]]},
   {h:'Casting spells',sm:'Sorcerer',b:[
    ['ol',['Say which spell you cast, on whom, and what it should achieve. You need the link it requires (touch, sight).','If casting is dangerous, roll an action, usually <b>Assense</b>. The GM names position and effect.','Then pay the <b>cost</b> (see below).']],
    ['p','<b>Spell Focus</b> (meteoric iron ring): spells with exceptional control. <b>Arcane Reagents:</b> reduce the edge cost by 1 or boost the spell by one level, crumble after use.']]},
   {h:'Cost & drain',sm:'spell potential = Assense',b:[
    ['tbl',['Spell strength','Cost'],[['below your potential','1 edge <i>or</i> level 1 drain (then no resisting)'],['equal to your potential','1 edge <i>and</i> level 1 drain'],['above it','1 edge <i>and</i> level 2 drain']]],
    ['p','Drain is special harm and a supernatural consequence: you may resist it. Ravn has Assense 1, so potential 1. The GM judges how strong a spell is.']]},
   {h:'Concentration',b:[
    ['p','Some spells only last while you concentrate (Veil). When your concentration is challenged, re-roll Assense (risking drain) or drop the spell: when you cast another spell, the target takes harm, magic acts against you, or the target is driven to desperation.']]},
   {h:'Ravn’s spells',b:[
    ['tbl',['Spell','Effect'],[['Stunbolt','mental spell: unconsciousness instead of wounds. Non-lethal, silent, visible only to the Awakened. Line of sight.'],['Veil','an illusion over a person or thing. Lasts while you concentrate. Fools people, <b>not cameras</b>.']],'nw']]},
   {h:'Adept',sm:'Hush',b:[
    ['ul',['<b>Adept Senses (1 edge):</b> superhuman perception for minutes: temperature, frequency, pressure, danger, lies.','You may resist supernatural consequences with <b>Body</b>.','Your aura shines in the astral as brightly as a mage’s.']]]},
   {h:'Dangers of magic',cls:'warnbx',b:[
    ['p','Magic can go wrong like anything else. Besides drain:'],
    ['ul',['Harm from astral backlash (burns, shock).','The spell works weaker, too strong, or on the wrong thing.','Astral activity <b>gets noticed</b>.']],
    ['p','Resisting the supernatural: <b>Ravn</b> as a hermetic with Intuition, <b>Hush</b> with Body, otherwise by the kind of consequence.']]},
   {h:'Magic leaves traces',b:[
    ['p','Every spell bears your astral signature, where it was cast and on its target. It fades within minutes but can be tracked until then. If you want to stay quiet, cast deliberately rather than constantly.']]},
   {h:'Mundane answers',b:[
    ['p','No Awakened in the crew? Flashbacks, Study with knowledge from the net, or gear like Kessel’s Search Protocol make up a lot. No obstacle in the tower strictly requires magic.']]},
  ]},

 {id:'heist',aud:'player',title:'Matrix, tech & alert',c3:true,
  lead:'The Meridian Spire is full of networked tech. Hackers get many chances to shine, but no exclusive right. And building security remembers what you do.',
  boxes:[
   {h:'The alert clock',sm:'6 segments · visible',b:[
    ['ladder',[['0–1 Routine',C6,'Anomalies count as normal event deviations.'],['2–3 Suspicion',C45,'Cameras cross-check, doors ask again, staff get questioned.'],['4–5 Alarm','var(--alert2)','Drones search, lifts stop, identified runners are tracked.'],['6 Lockdown',C13,'Exits sealed, external response called. Escalation, not game over.']]],]},
   {h:'What drives alert',b:[
    ['ul',['cameras or guests see something','a sensor trips','a fake identity gets checked','a drone sends a warning','doors are forced','gunfire, explosions, screams','a hack leaves a trace']]]},
   {h:'Lowering alert',sm:'tug-of-war',b:[
    ['p','Not “I roll against alert” but a deed in the world:'],
    ['ul',['convince a guard it was harmless (Influence)','replace camera feeds with old footage (Interface)','disguise a sensor as a fault (Engineer)','intercept a drone before it reports (Fight, Stalk)','stage a party incident (Command, Consort)']],
    ['p','On success, alert drops by effect or a rise is prevented.']]},
   {h:'Interface & Matrix',b:[
    ['ul',['Anyone can try simple things with networked tech using Interface. Real hacking (finding hidden devices, exploiting vulnerabilities) needs a cyberdeck.','Hacks don’t get harder automatically. Riskier only once a countermeasure runs, a trace has started or a system was isolated.','Offline things can only be hacked by cable at the hidden data port, or by hand: Engineer, Finesse, Wreck.']]]},
   {h:'Kessel’s tools',sm:'Hacker',b:[
    ['ul',['<b>Search Protocol:</b> you are aware of all online devices nearby; +1d to gather information about high tech.','<b>Scratch-built cyberdeck</b> (smart: can’t be hacked against you).','<b>Warez:</b> Armor, Arsenal and Mask need VR. Breach opens a gap at once but alerts the system. Several warez in one run draw attention.','<b>Blueprints:</b> say during the run which plans you loaded.']]]},
   {h:'Zephyr’s tools',sm:'Rigger',b:[
    ['ul',['<b>Ace:</b> start, fly and land any vehicle with Finesse; potency on difficult manoeuvres.','<b>Dragonfly:</b> rotor drone with camera and mic, fits the drone shaft.','<b>Utility harness:</b> incl. Vehicular Override, thermite, hyperglue.']]]},
   {h:'Ways into the tower',b:[
    ['tbl',['Route','Strength · problem'],[['Glass lift','elegant, close to Venn · gear stands out, lift logs arrivals'],['Freight lift','tools plausible, close to the keycard · rosters, wrong area'],['Roof','lots of gear · wind, visible, glass roof'],['Façade gondola','bypasses the entrance · logged, visible from inside']],'nw']]},
   {h:'The job',cls:'goldbx',b:[
    ['ul',['Steal the <b>black briefcase</b> from the vault.','It is handed over <b>unopened</b>.','Take <b>nothing else</b> from the vault.','The vault needs the <b>vault keycard</b> and <b>Dr. Venn’s eye scan</b>.','Pay: <b>6 nuyen</b> for the crew.']]]},
  ]},

 /* ================= GM ================= */
 {id:'sl-wuerfe',aud:'gm',title:'Running rolls',c3:true,
  lead:'State position and effect, choose consequences, run clocks. Principle: consequences create new situations, not game over.',
  boxes:[
   {h:'Position in the tower',b:[
    ['tbl',['Position','typical here'],[['Controlled','registered viewing, cover holds, quiet workshop, alert 0–1'],['Risky','service wing without clearance, gondola in the wind, guards nearby'],['Desperate','in the open in the sensor corridor, guardian drones firing, Kade in melee, lockdown']],'nw'],
    ['p','Alert itself gives no dice penalty; the changed fiction shifts position and effect.']]},
   {h:'Consequences',sm:'four types',b:[
    ['ul',['<b>Reduced effect:</b> one effect level less.','<b>Complication:</b> new danger, a door locks, the keycard is moved, Venn gets suspicious. On a clock: minor 1, normal 2, serious 3 segments.','<b>Lost opportunity:</b> the window closes, another method is needed.','<b>Harm:</b> see below.']],
    ['p','A complication must not negate a success. Per consequence either resistance or armour. The GM decides whether resistance reduces or avoids, and so sets the tone.']]},
   {h:'Harm by position',sm:'rule of thumb',b:[
    ['tbl',['Position','Harm'],[['Controlled','level 1'],['Risky','level 2'],['Desperate','level 3 (lethal weapons: up to 4)']],'nw'],
    ['p','The rulebook only states desperate = severe harm; the rest is Blades practice. Temporary states (dazed, panicked) are complications, not harm.']]},
   {h:'Effect factors',b:[
    ['ul',['<b>Quality:</b> better gear than the opposition (fine items) = +1.','<b>Scale:</b> group against individuals, drone swarm = ±1.','<b>Potency:</b> weak spot, surprise, magic against the mundane, EMP against drones = +1.']],
    ['p','A dominant factor overrides the rest (one against twenty). Zero effect is possible, then only a setup helps.']]},
   {h:'Clocks',b:[
    ['tbl',['Size','for'],[['4–5','complex: the keycard lockbox, guards in the service wing'],['6–7','more complicated: guardian drones, the alert clock'],['8–10','daunting: break the mana barrier, the vault door without factors']],'nw'],
    ['p','Limited 1 · standard 2 · great 3 segments. Clocks track the obstacle, not the method (“guardian drones”, not “hack the drones”). Simple things need no clock: one roll decides.']]},
   {h:'Engagement roll',sm:'fortune roll',b:[
    ['p','1d6, ±1d each: bold / overly complex · the detail hits a weakness / the target is strong against it · contacts help / rivals interfere. Sprawl Whisperer: +1d.'],
    ['dice',[['6 + 6',CCR,'first obstacle already overcome, dominant advantage'],['6',C6,'dominant advantage or initiative (controlled)'],['4/5',C45,'Risky'],['1–3',C13,'Desperate']]],
    ['p','Only holds for the first actions. Don’t describe the approach; cut straight to the first obstacle.']]},
   {h:'Fortune roll',b:[
    ['p','For uncertainty without a runner action: does Kade notice the outage? Roll a fitting trait (tier, quality, magnitude) or 1–4d6 by situation, ±1d for major advantages and disadvantages. Critical exceptional · 6 good · 4/5 mixed · 1–3 bad.']]},
   {h:'Dragon’s deals',sm:'+1d for a catch',b:[
    ['p','The GM or anyone at the table may offer one. It happens whatever the roll. Not on top of pushing.'],
    ['ul',['The invitation is real, but someone recognises your alias.','Perfect scan, but Venn will remember your face.','The drone goes offline; its last data burst is already out.','The gondola gets you there, then locks itself outside.','You reach the briefcase; the vault door closes behind you.']]]},
   {h:'Flashback prices',b:[
    ['p','0 edge ordinary, 1 complex or unlikely, 2+ elaborate with special opportunities. Then an action roll, a fortune roll or no roll, depending on the danger.']]},
  ]},

 {id:'sl-kampf',aud:'gm',title:'Combat & opposition',c3:true,
  lead:'Enemies don’t roll. Their behaviour and attacks come out of the runners’ action rolls. Security wants to isolate, hold and buy time; lethal force only on massive escalation.',
  boxes:[
   {h:'Gala security',sm:'discreet · well equipped',b:[
    ['ul',['<b>Goal:</b> no visible incident in front of the VIPs.','<b>Tactics:</b> address politely, separate, ask aside, escort. Tasers only behind closed doors.','<b>Clock:</b> taking out a pair of guards 4.','<b>Harm:</b> non-lethal, level 1–2.','<b>Consequences:</b> radio call (alert +1), backup, identity recorded.']]]},
   {h:'Dorian Kade',sm:'head of security',cls:'gmbx',b:[
    ['ul',['Cyberarms, wired reflexes, pistol. A master: the GM says what he has already done (gun drawn, exit blocked), and the runners must resist before they can act.','Openly against him: <b>desperate</b>, effect usually limited (quality, reflexes).','<b>Clock 6</b> to bring him down. Better: deceive, distract, avoid him.','Won’t shoot into a crowd. Keeps incidents small; prefers to pull people into a side room.','Harm: level 2, with his gun drawn level 3.']]]},
   {h:'Recon drones',sm:'small · fast',b:[
    ['ul',['Small frame (−1 scale), flight, sensor array. Observe, capture faces, tag, follow.','Easy to destroy: one standard hit does it.','<b>The danger is the data burst:</b> alert +1, or a runner’s identity is recorded.','Intercept it before it reports and the rise is prevented.']]]},
   {h:'Guardian drones',sm:'armoured · armed',b:[
    ['ul',['Medium frame with plating and turret. <b>Clock 4</b> per drone (6 at alert 4+).','Holdout, knives, fists: limited. Brutal weapon, Wreck, EMP: standard or potency.','<b>Weak spots:</b> sensors, weapon module, maintenance port in the drone node.','<b>Non-lethal first:</b> block, taser, containment foam.','<b>Lethal</b> only if the runners are heavily armed or on massive escalation.']]]},
   {h:'Drone escalation',b:[
    ['ladder',[['Routine',C6,'patrol by pattern'],['Viewing',C6,'escort, count, compare identities'],['Irregularity',C45,'step in between, demand re-auth, block paths, separate'],['Physical','var(--alert2)','restrain, taser, foam'],['Weapons',C13,'only against heavy weapons or massive escalation']]]]},
   {h:'External response',sm:'from alert 6',b:[
    ['p','Lots of time left: <b>response clock 4</b>. When full, a heavily armed team arrives; escape instead of fighting. Little time: the next big consequence is arriving backup.']]},
   {h:'Harm in the tower',b:[
    ['tbl',['Level','Examples'],[['1','cut by glass, twisted ankle, pepper: “sickened”'],['2','deep cut, concussion after a fall on the stairs'],['3','shot by a guardian drone, fall through the glass roof'],['4','only desperate with lethal means']],'nw'],
    ['p','Bangflash, taser jitters, stuck in foam: a temporary complication (dazed, held), not harm.']]},
   {h:'The bomb in the briefcase',cls:'warnbx',b:[
    ['ul',['Only those who open it risk it. Keep it closed and nobody ever learns of it.','Detect: Survey, Study, Engineer or Interface, depending on method.','Disarm: risky in calm, desperate under drone fire.','Detonation: contents destroyed, level 3 harm for the holder (not a death trap), alert rises sharply.']]]},
   {h:'Violence & payoff',cls:'goldbx',b:[
    ['ul',['Injured or dead guests or staff: at least as high alert (3 nuyen).','Venn seriously hurt or killed: breach of contract.','<b>Veyrath never fights.</b> If someone shoots at him, he withdraws.']]]},
  ]},

 {id:'sl-magie',aud:'gm',title:'Magic in the tower',c3:true,
  lead:'What is magical in the Meridian Spire and what the Awakened can see there. Magic is one more way, never a must: every obstacle can be solved mundanely too.',
  boxes:[
   {h:'The vault shell',sm:'original creation',cls:'gmbx',b:[
    ['ul',['Cultivated living tissue inside the walls: dark fibres like roots or muscle.','Carries a <b>dual mana barrier</b>: physical and astral. Astral scouting or passage is severely hampered.','Reacts to drilling and shocks; small wounds close.','On alarm the fibres thicken.','Damage is visible: fibres twitch, dark fluid seeps out.']]]},
   {h:'Getting past the barrier',b:[
    ['ul',['<b>Break through:</b> clock 8, desperate, each roll alert +1. Loud and slow.','<b>Study the door:</b> Assense or Study at the regular passage shows how the barrier opens in a controlled way. That is a setup: +1 effect or better position for your own way in.','<b>Attack the wall:</b> the tissue reacts, heals, thickens. Damage to the shell counts for Veyrath like damage to the collection.']]]},
   {h:'The astral watcher',sm:'optional',b:[
    ['ul',['Patrols outside the barrier. Not a combat enemy.','Notices unusual astral activity nearby: <b>alert +1</b>.','That includes spells, sustained assensing, Hush’s bright aura.','Distract it (Assense, Influence) or stay quiet. Banishing focus: potency to drive it off.']]]},
   {h:'What Assense reveals',b:[
    ['tbl',['Effect','Insight'],[['Limited','strong magic here; a wall is “alive”; something watches astrally.'],['Standard','dual barrier, the watcher and its round, the briefcase’s aura among the pieces.'],['Great','how the barrier opens at the passage; which antiques are magical; the barrier is old and costly, no corp builds this for art.']],'nw']]},
   {h:'Magic in the hoard',b:[
    ['ul',['<b>The briefcase:</b> faint, old, harmless aura. Stands out to the Awakened, triggers nothing.','<b>Magical antiques:</b> distinguishable from merely expensive pieces. One is temptingly easy to take. No trap.']]]},
   {h:'Spells in practice',b:[
    ['ul',['<b>Stunbolt</b> on a guard: Assense, risky, silent, non-lethal. A guard is weak: cost 1 edge or drain 1. Near level 110 the watcher notices.','<b>Veil:</b> people see the illusion, <b>cameras see the truth</b>. Needs concentration; when challenged, re-roll Assense or the veil drops.','The spell’s signature clings to caster’s spot and target for minutes and can be tracked.']]]},
   {h:'Magical consequences',b:[
    ['ul',['<b>Drain</b> comes from the spell cost (spell potential = Assense rating, Ravn 1): below it 1 edge or drain 1, equal 1 edge + drain 1, above 1 edge + drain 2.','From the roll: backlash harm (“lightly toasted”, level 1), spell out of control.','Astral attention: the watcher reports, alert +1.','Resistance: Ravn (hermetic) Intuition, Hush Body.']]]},
   {h:'Clues to Veyrath',cls:'goldbx',b:[
    ['ul',['<b>Ravn</b> recognises the grown dual barrier as decades of work: someone very old lives here.','Vesna (Ravn’s spirit) said the tower “has a heartbeat”.','<b>Hush’s</b> strange trinket may show a vast shadow over the façade at the vault door.','Don’t hold back a truth the runners have earned.']]]},
   {h:'Veyrath',sm:'reveal',b:[
    ['ul',['Appears only during or after the escape and speaks straight into the runners’ minds with dragonspeech.','<b>Seeing a dragon:</b> onlookers freeze up or flee unless they resist with Willpower. If he keeps his distance, a brief shock is enough.','Dragons are dual-natured: their astral presence is visible from afar unless hidden. Veyrath hides his inside the tower.','Judges, doesn’t threaten, doesn’t block. <b>Never a combat encounter.</b>']]]},
  ]},

 {id:'sl-alert',aud:'gm',title:'Alert, Matrix & payoff',c3:true,
  lead:'The alert clock shows what building security knows and does right now. It rises when an action plausibly draws attention, and drops when the fiction allows it.',
  boxes:[
   {h:'Alert stages',sm:'6 segments',b:[
    ['ladder',[['0–1 Routine',C6,'event deviation. Standard patrols. Nobody searches.'],['2–3 Suspicion',C45,'cameras cross-check, doors demand re-auth, drones watch, staff are questioned.'],['4–5 Alarm','var(--alert2)','drones search, service routes closed, lifts stop or reroute, identified runners are tracked.'],['6 Lockdown',C13,'alarm confirmed, exits sealed, external response called.']]]]},
   {h:'How much alert?',b:[
    ['tbl',['Trigger','Alert'],[['minor complication: wrong area, watcher notices magic','+1'],['complication: identity checked and failed, drone report','+2'],['serious complication: door forced, gunfire, explosion','+3'],['action works directly on the clock','by effect 1/2/3']],'nw'],
    ['p','Not every failure raises alert. Harm, lost gear or a blocked door often fit better.']]},
   {h:'Lowering alert',b:[
    ['p','Only through a concrete deed: a convincing explanation, old camera footage, a sensor passed off as a fault, a drone intercepted, a door log posing as maintenance, a party incident as an excuse. Success: alert drops by effect or a looming rise is cancelled.']]},
   {h:'Networked systems',b:[
    ['tbl',['System','Lever'],[['Guest list, rosters','slip in names, forge a shift'],['Cameras','loop, old footage, angles'],['Lifts','stop, reroute, fake the floor'],['Door logs','pass access off as maintenance'],['Façade gondola','drive command, docking point 110'],['Drones','fool target recognition, orders, maintenance port'],['Skycab transponder','landing clearance on the roof']],'nw']]},
   {h:'Offline',b:[
    ['ul',['<b>The briefcase</b> transmits nothing and can’t be located via the Matrix. Offline means: only hackable by cable, directly at the device.','<b>Keycard lockbox</b> in the event office: removal is logged, but the lock is physical.','The <b>vault door</b> logs every attempt; a clean two-factor entry raises no alarm.']]]},
   {h:'Matrix consequences',b:[
    ['ul',['ICe alerted or corners the hacker; next hack desperate.','“Traced” clock: when full, the location is known. Going offline clears it but drops all control taken.','Device damaged, shut down or jacked; target icon hidden.','Usable trace: alert +1.','Breach opens at once but alerts the system.']],
    ['p','Repeated attempts only get harder when the fiction gives a reason.']]},
   {h:'Payoff',cls:'goldbx',b:[
    ['tbl',['Alert at the end','Nuyen'],[['Low 0–1','6'],['Medium 2–5','5'],['High / lockdown 6','3']],'nw'],
    ['ul',['Injured or dead guests or staff: at least as high alert.','Venn seriously hurt or killed: clear breach of contract.','Damage to the collection or extra loot can cut further.']]]},
   {h:'Veyrath’s verdict',b:[
    ['tbl',['Result','if …'],[['Ideal','briefcase closed, no loot, collection intact, Venn unharmed, little violence, teamwork'],['Usable','job done, but medium/high alert or avoidable escalation'],['Unfit','briefcase opened (even expertly), contents destroyed, Venn hurt, loot, indiscriminate killing']],'nw']]},
  ]},
 ],
};
