/* English long texts for the parking garage and the section. */
PLAN_EN.spots['garage']={
1:{t:'Ramp, barrier & gatekeeper',p:'The ramp comes down from P1. Plate scanner, barrier, a bored gatekeeper with the trid running.',g:'The scanner matches plates against the delivery schedule and resident list (hacker: enter a vehicle). The gatekeeper waves through anything that “looks like catering”. The booth sees the ramp and the east end of the drive aisle, not the deliveries. Walking in over the ramp: nobody asks.'},
2:{t:'Drive aisle & garage security office',p:'Main driveway with two cameras. A rolling security robot patrols. The security office has a window onto the drive aisle.',g:'The rollbot runs a 4-minute loop drive aisle ↔ maneuvering area; whoever knows it knows when the deliveries are unwatched. The monitors show only the garage, not the tower. The one guard from the office mostly stands with the gatekeeper.'},
3:{t:'Deliveries & loading dock',p:'Catering unloads, a shift supervisor with a tablet coordinates, Vesperline crates pile up. Three dock gates, one van, one armored art transport.',g:'The shift list knows every name; an unknown one stands out (“temp, last minute” is the answer). An empty Vesperline crate holds one person. At 01:30 three crates of “stage equipment” ride the freight elevator to 111. The art transport collects the pieces at 05:00; its driver sleeps in the cab. Blind spot behind the transport.'},
4:{t:'Freight lobby & freight elevator',p:'A guard scans badges, delivery notes and crates. The freight elevator goes up to the penthouse core corridor.',g:'Crates are only scanned from the outside (metal and radio stand out; “stage equipment” explains a lot). Level 110 cannot be selected, but the shaft door there exists. The guard changes every two hours; the relief does not know the early shift’s faces.'},
5:{t:'Staff stairs (emergency exit)',p:'Escape stairs through the whole building.',g:'111 floors on foot are not an option, but two levels to the ground-floor lobby are: the glass elevator waits there, and staff becomes guests. At the top the stairs end at the roof (alarm contact); they pass 110 with a locked fire door.'},
6:{t:'Utility room / building control node',p:'Locked, sign “Utilities”. Transformer, distribution.',g:'Physical access to the building automation: elevators, doors, cameras of the garage and the core corridor on 111. A hacker position out of sight. Level 110 has its own host and cannot be reached from here, but the freight elevator can be stopped at 110.'},
7:{t:'Delivery drone depot & drone shaft',p:'Drones hum, charge, launch through an entry opening to the street. A shaft leads upward.',g:'The drone shaft (40×40 cm) ends in the kitchen on 111 and at the drone port on the roof. A rigger takes over a delivery drone and sends a weapon, tool or keycard through the building. The drone entry is a way for micro drones past the gatekeeper. No camera.'},
8:{t:'Staff locker room',p:'Lockers, uniforms, a sink.',g:'Uniforms of catering and building services, badges hang on the lockers. No camera. Doors to the freight lobby and the drive aisle: the change between guest and staff in both directions.'},
9:{t:'VIP drop-off & lobby elevator',p:'Limousines, valets, a red carpet to the elevator up to the ground floor, where the glass elevator waits. A drivers’ lounge with a trid.',g:'Invitations are only checked upstairs; here appearance counts. In the drivers’ lounge: gossip about guests, about Venn (“the curator with the black eye”) and Kade (“the one with the chrome arms sees everything”). Valet key board = getaway vehicles. Camera at the barrier.'},
10:{t:'Crate storage & waste room',p:'Empties, a waste compactor.',g:'No camera coverage, a good hiding place. The compactor noise covers a lot. Empty crates disguise gear that should not pass the scan.'},
};
PLAN_EN.routes['garage']={
A:{t:'As staff: loading dock → freight lobby → freight elevator',d:'Uniform, crate, delivery note. The scan checks badge and load, not faces. Ends in the core corridor on 111.'},
B:{t:'As a guest: VIP drop-off → lobby elevator → ground floor → glass elevator',d:'Appearance instead of ID. The real check waits upstairs in the foyer.'},
C:{t:'On foot over the ramp → locker room → freight lobby',d:'Nobody questions pedestrians. In the locker room the stranger becomes staff; door 2 leads straight to the guard with the scanner.'},
D:{t:'Drone shaft (items only)',d:'A rigger or hacker sends gear to the kitchen on 111 or the roof. None of it passes the scan.'},
E:{t:'Staff stairs → ground-floor lobby',d:'Two levels up, then switch to the glass elevator. The quiet way when the garage gets too hot.'},
F:{t:'Up in a crate',d:'Crates ride at 01:30 or 05:00. Whoever sits inside arrives unscanned in the core corridor. Tight, blind, desperate if checked.'},
};
PLAN_EN.sits['garage']=[
 '<b>Unloading under pressure.</b> The catering van has to clear the dock in ten minutes. Whoever lends a hand is not asked who they are.',
 '<b>Wrong name.</b> The shift supervisor scans her tablet: “You are not on here.” Sway or Deception: “Temp, last minute.” On a 4/5 she calls the caterer, who is not reachable right now. Ten minutes’ grace.',
 '<b>Crate goes up.</b> At 01:30 three crates of “stage equipment” ride to 111. Whoever sits inside arrives in the core corridor. Crates are only scanned from the outside.',
 '<b>Rollbot.</b> Four-minute loop. Whoever knows the rhythm has two minutes of unwatched maneuvering area.',
 '<b>Getaway vehicle.</b> Valet key board, armored art transport with a sleeping driver, limousines with drivers in the lounge. Three options, three volume levels.',
 '<b>Hacker in the basement.</b> From the building control node: elevators, doors, garage cameras. Not level 110. But stopping the freight elevator at 110, that works.',
];
PLAN_EN.sits['schnitt']=[
 '<b>Every level has at least three connections up and down.</b> If a route gets blocked (elevator stopped, door locked), do not show the group the section, but let them ask: “What else is there?” The answer is here.',
 '<b>Two routes carry items only.</b> Drone shaft and dumbwaiter separate gear from people: the crew walks unarmed through the arch, the weapons follow via the kitchen.',
 '<b>Level 110 is the bottleneck.</b> Only collector lift, private lift, maintenance shaft and gondola reach it regularly; freight elevator and stairs need a trick (Interface, fire alarm). That is exactly why it is the vault.',
 '<b>A split crew.</b> If the group gets separated (consequence), give each part its own vertical route: one in the freight elevator, one on the access ladder, one in the gondola. They meet on 110 from three directions.',
];
