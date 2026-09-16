# Hearth & Hush — provisional development codename

## 1. Product and creative authority
Design baseline, 14 September 2026. A single-player fantasy social RPG inside a physical tavern. The HTML slice proves attention, attachment and consequence before a Unity/C# production rebuild. No final title is selected. The complete original conversation is preserved in docs/creative-source.md; later user choices supersede earlier illustrative suggestions. New names and scenario details below are provisional implementation decisions, not retroactive creative commitments.

Player promise: everyone else goes on the adventure. You pour their drinks, learn what they leave unsaid, decide who learns what, and wait for the door to open again. Priority: characters, stories/shenanigans, influence, then beautification. Audience: players of character-driven RPGs and forgiving living-world management games. Desktop keyboard first; no combat, reflex checks or service countdowns.

## 2. Creative Constitution
1. Tavern is a physical place, never a glorified menu.
2. Attention is the signature mechanic.
3. Missing information is allowed; missing the actual game is not.
4. Information has uncertainty and provenance.
5. Characters exist when the player is not looking.
6. Simulation serves storytelling, not vice versa.
7. Player remains an innkeeper, not an action hero.
8. Adventurers are the player's hands beyond the tavern.
9. Death is real but not cheap.
10. Hospitality is an RPG skill.
11. Progression means delegation.
12. Reputation is plural.
13. Morality is behavior and consequences, not a meter.
14. Factions manipulate the player too.
15. Quiet nights matter.

## 3. Setting and tone
Rookcross was a prosperous junction before Westbridge trade dwindled. The inherited inn has carved beams, a broad stone hearth, patched boards, a private booth and a room above. Its former owner left debts and a habit of writing names in margins. Most of the building is mundane. A carving repeats on an old treaty; a sealed space beneath the hearth may matter much later. The mystery starts as optional background, not a main-quest marker.

Traditional fantasy peoples coexist with original peoples. Warmth and grounded ridiculousness coexist with frightening consequences. A wizard's refusal to buy a second breakfast for a familiar belongs alongside a merchant's genuine fear of losing her livelihood. Avoid parody destroying emotional stakes. Town recovery is indirect through trade and relationships; the player never becomes mayor.

## 4. Player and time
Fixed inheritance setup, custom keeper name and coat in the slice. Backgrounds in production. Move directly with WASD/arrows, interact with E, journal with J, pause with Space. Clicking a floor destination also moves the keeper along a traversable route. Pressing E once at a cask pours (holding remains supported); carry one drink or meal to a guest. Nearby conversations open only at physical reach. Menus support decisions, never replace traveling to a person or object.

Seven days, approximately three minutes each, plus time spent freely paused. Morning gives room to prepare; arrivals and meetings gather through afternoon; lamps and departures mark closing. An accessible slower clock may be selected. Day four is deliberately quiet. At closing the bed advances the night; waiting also advances naturally. No objective timer punishes service. At week end a retrospective describes consequences and offers continued inspection or a new run.

Pause stops the simulation, movement, service, purchases, dispatch, information transfers and sleep. Read-only journal and inspection remain available. Losing window focus pauses. Saves capture the current position, time, NPC states, information provenance, event ledger, debts and expedition. Auto-save regularly and at day boundaries; manual save and reset available. Corrupt saves fail gracefully to a new game.

## 5. Attention specification
There is no attention resource or upgradeable attention meter. Perception is a query on world state. Each active conversation has speaker, partner, location, duration, volume, snippets, full line and optional knowledge payload. At long visible range, bodies turn toward each other and small marks indicate speech without revealing content. At intermediate audible range, fragments appear. Sustained proximity yields full dialogue and a journal entry. Familiar guests are easier to understand. Solid partitions block visual perception and attenuate hearing; closed-room boundaries prevent cross-room overhearing. Whispering has a smaller radius. No global event feed reveals distant speech.

Ordinary exchanges expire permanently and generate no missed-content notification. Physical incidents create persistent local evidence until cleaned or investigated. Major caravan arc has overlapping trails: merchant conversation, guard conversation, delivered letter and expedition evidence. These are diegetic authored fallbacks, not omniscient alerts. Staff remember only conversations within coverage and can report secondhand interpretations when spoken to. A server's report is a new provenance entry, not the original eyewitness account. Accessibility increases cue contrast and hearing distance without exposing the entire map.

Tuning targets: 2–4 seconds of comfortable lingering; text remains long enough to read; no crucial simultaneous dialogues competing within one bubble; physical reach approximately a character and a half. Movement must feel unhurried and permit all doors, seats and stations. UI never exposes unknown conversation content in a tooltip or journal.

## 6. Understanding and influence
Knowledge records have stable IDs, statement, observations with source/day/channel, reliability state, known-by set and related arc. Repeating one source does not corroborate itself. Independent testimony can corroborate a lead; recovered physical records can confirm or contradict it. Certainty is epistemic, not a truth oracle: characters' claims remain visibly claims. World truth is held separately from player knowledge.

SHARE: tell Mira about the caravan trail. She acts on it through her criminal connections; she is not a passive quest button. SELL: sell the lead to merchant Oren, yielding money and commercial consequences. WITHHOLD: explicitly decline a confidence; others remember refusal, and silence can preserve a relationship. INVESTIGATE: send a prepared party or inspect local evidence. EXPLOIT: pressure Oren using corroborated evidence, accepting a profitable but hostile relationship. Recipients remember exact choices and acquire the relevant knowledge. No global morality or reputation score.

Production office: physical map, portraits, letters and connectable hypotheses; links express a theory, never award a correctness beep. Searchable journal supplements it. Slice office presents discovered evidence and expedition preparation; free-form hypothesis linking is deferred.

## 7. Eight recurring people
| Person | Role, desire and contradiction | Hospitality and ties |
|---|---|---|
| Cedric | Novice swordsman; wants to pay for his sister's apprenticeship; boasts to hide fear | Ale, hearth seat; trusts Mira, admires Bram |
| Mira | Rogue with Reed Knives obligations; wants enough independence to stop taking orders | Wine, booth; cares for Cedric but sells access |
| Nell | Potential server; notices hands, misreads motives; saving to buy a boat | Tea; fond of Cedric, distrusts Oren |
| Oren | Merchant; reroutes trade for profit, tells himself it keeps workers fed | Wine; manipulates Mira and bargains with Tomas |
| Tomas | Guard; wants lawful proof rather than rumor, stretched by unpaid wages | Stew; wary friendship with Mira |
| Aldous | Cleric; practical healer, quietly housing displaced families | Tea; protective of Cedric, patient with Ivo |
| Bram | Veteran dwarf; skilled at preparation, reluctant to lead another disaster | Ale; mentors Cedric, distrusts grand claims |
| Ivo | Wizard and eccentric lodger; researching treaty history, argues about familiar tariffs | Stew; shares old carvings with Aldous |

Independent arrivals, seats, conversations and departures operate without player observation. Expedition participants leave schedules until their physical return. Memories change lines, seating/relationships and later opportunities. Production expands to romance, careers, grudges, rivalries and new generations over many hours; the slice demonstrates friendship damaged or reinforced, not a full life simulation. Approximate capability descriptions come from introductions, hospitality and returned evidence; no visible levels or percentage success.

## 8. One-week authored scenario
Days 1–2 introduce routines and missing Westbridge wagons. Oren suggests bandits, while Tomas recalls wagons turning voluntarily. A quiet booth exchange implies paid diversion. The player can relay the uncertain story, sell it, wait, or prepare a survey. A day-three letter ensures the road problem remains discoverable without revealing its answer.

Mira given the lead forwards it to the Reed Knives, who strip a warehouse before proof can be secured. This can imperil Cedric and leave the player thinking, 'I should not have told Mira that.' Oren pays to shape the story. A prepared expedition can recover a stamped ledger, showing deliberate diversion. An unprepared novice faces believable injury; the slice does not randomly kill a regular. Day four permits ordinary soup, rain and personal conversation. Later return dialogue, a search at the inn and an end-week reflection reconcile the choices. The old inn carving provides a separate slow mystery. A spilled familiar-related drink leaves evidence and comedy between heavier beats.

Major outcomes: prepared evidence recovery and improved trade; injured return without complete proof; compromised evidence after gossip; merchant profit and displaced trade; guarded silence. Same events can be learned through different sources. Consequences must exist in simulation even if not observed immediately.

## 9. Expeditions
Physical board in the office. Select Cedric and optional Bram, provision budget, and cautious survey versus rushing to recover goods. Share the known warning or withhold it. Require present participants, sufficient funds, a lead, and a departure early enough for a return within the slice. They walk out, remain absent for two days and walk back carrying evidence/injury. No instant result pane or probability readout. The player's instructions, party preparation and information leak determine outcome, not arbitrary RNG.

Production: richer equipment, competing requests, recruited specialists, delays, missing parties, recovery expeditions, artifacts and real death from legible risk chains. Permanent death needs foreshadowed danger, event history and survivor reactions. Do not implement a mortality dice roll simply to claim this feature.

## 10. Hospitality, economy and delegation
Casks and stove produce ale, wine, tea or stew. Physical service rewards a few coins; a favorite earns a remembered kindness and more candid conversation. Guests do not explode or vanish when ignored. Clean spills and inspect the rented room for modest income/evidence. Hire Nell for a one-time agreement and daily wage; she physically serves guests, freeing attention. She covers public tables, not closed rooms. Her reports have limited fidelity.

Daily modest costs make debt possible. Negative funds become a merchant favor, changing later dialogue; no hard game-over. Production difficulty controls costs, grace and setbacks. Deep stock simulation, recipes, room allocation, bartender/cook/housekeeper/stablehand and free furniture building follow proven character systems. Architecture expansion trades opportunity for unmonitored space; a private booth must actually change hearing, not simply add income.

## 11. Factions and outside threats
Crown watch, merchant compact, Reed Knives, competing dock smugglers, religious houses and mages are overlapping networks. Slice uses person-specific memories plus a few named faction consequences. A late guard search is resolved through testimony, hiding information or cooperation, never combat. Production threats include refugees, hostile guests, plague, cursed artifacts and attacks resolved by preparation, staff, relationships and evacuation. Factions offer selective truth and manipulate the keeper in turn.

## 12. Presentation and accessibility
Illustrated overhead 2D, warm amber against cool rain, timber floor, carved partitions, rugs, hearth light and distinct character silhouettes/colors. Characters have readable names and grounded speech. UI uses a compact top status, contextual bottom hint, and an optional readable journal. No minimap of secrets. Audio is optional ambient fire/rain with muted default or a clear opt-in. No essential information exclusively in sound or color. Keyboard movement, large click targets, high contrast cues, slower time, free pause, responsive canvas and readable scalable text are required. Touch play is secondary and must not be represented as fully tested.

## 13. Technical architecture and Unity migration
No dependencies or network requests at runtime. Ship index.html as a self-contained playable artifact generated from src/data.js, src/sim.js, src/view.js and src/style.css. Content holds NPCs, rumors, conversations, stations and geometry. Simulation owns serializable world state, movement/navigation, events, perception, relationships, staff, quest and economy. View owns input, rendering and accessible panels. Build script bundles these without requiring a web server. Save schema is versioned.

Unity migration: reproduce stable-ID content as ScriptableObjects/JSON, world state as serializable C# models, deterministic simulation functions as services and presentation as scene components. Replace 2D routes with NavMesh and perception rays without changing narrative contracts. Keep known-by sets and provenance distinct from omniscient truth. Port scenario regression fixtures before graphics. Avoid mechanically translating canvas rendering.

## 14. Production plan, acceptance and risks
Milestone 0: source archive and this GDD committed before code. M1: physical room and collision, attention query, conversations and eight schedules. M2: service, memory, knowledge actions, delegation, delayed expedition. M3: seven-day branch content, onboarding, save, accessibility and end reflection. M4: regression checks, browser playtest, public deployment verification. Post-slice: interviews and tuning before committing to Unity production scope.

Acceptance: walk complete routes to all stations without collision traps; distant/blocked speech absent from knowledge; proximity plus dwell learns it; duplicate sources cannot corroborate; paused actions do nothing; NPCs/events progress unobserved; ordinary missed talk is not announced; staff reports require physical debrief; party exits and remains absent until return day; at least two preparation branches and information-leak consequences differ; save roundtrip preserves story; seven days complete without fatal errors. Automated input replay is not a substitute for human feel testing and must be labeled accurately.

Playtest questions: which regular do you remember and why; did you move to listen without being told; did uncertainty affect disclosure; did serving feel like hospitality or chores; did you notice empty seats while waiting; what choice would you change next run? Targets are hypotheses, not claimed measured outcomes. Risks: reading overload, idle waiting, omniscient UI leakage, route bottlenecks, expensive authored branching and feature creep. Mitigate with brief speech, parallel ordinary life, fallback trails, invariant tests and the stated priority order.

## 15. Scope truth
This document specifies the full product direction and bounded implementation plan. The delivered README and test report must enumerate actual implementation and deferrals. A seven-day prototype cannot establish long-term attachment, kingdom simulation, romance, construction or commercial readiness. Publishing requires a functioning external account/session; if blocked, report the exact blocker and deliver the local playable artifact without claiming a public release.

## 16. Validated refinement, September 15

Expedition instructions have causal meaning: a cautious party without a usable route or supplies turns back safely. Bram carries his own route knowledge; including him does not require the keeper to repeat his advice. A supplied, warned, cautious Cedric can survey alone. Reckless instructions can still cause injury, with an account that distinguishes bridge failure from a rushed ridge crossing. These changes replace the initial all-checkboxes-required resolution rule.

Only the nearest fully audible conversation accumulates the keeper's listening time, matching the displayed caption. Staff need sustained close hearing and respect whispers. Relationship notes are snapshots of developments actually heard or debriefed, rather than a live view of hidden simulation state. An expedition return appears on the board only after the keeper sees Cedric or hears his debrief. This preserves both anticipation and uncertainty without adding an attention meter.

## Beginner onboarding refinement — September 16

A six-step optional practice teaches walking, pouring, serving, talking, overhearing and reading the journal. It uses real movement and perception rules in a disposable rehearsal; the clock and other guests wait, and the saved week is preserved. Help can replay it at any time. Regular dialogue, journal and decision panels suspend world ticks while open, so reading has no time cost; explicit Space pause still blocks actions. Extra character notes are collapsed until requested.
