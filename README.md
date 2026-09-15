# Hearth & Hush — provisional codename

**[Play in your browser](https://dumb-tony.github.io/hearth-and-hush/)**

A seven-day fantasy innkeeper RPG prototype. Everyone else goes on the adventure; you stay behind, serve drinks, listen, decide who learns what, and wait for the door to open again.

## Play

Desktop recommended. WASD or arrows to walk; click the floor to walk there. E interacts with a nearby person or object. Hold E at a cask/stove to prepare a drink/meal; walk to a guest and press E to serve. X sets down the held item. J opens a searchable journal. Space pauses all world actions. Settings include a slower clock and clearer hearing cues. Optional synthesized ambience starts with Sound off/on.

Walk close to conversations, then linger. A wall or a lowered voice changes what you hear. The office board handles letters and expedition preparation; travelers must be physically present to agree to leave. The small bed in the office closes the inn near the end of a day. Days also advance naturally. A week takes about 21 minutes at default speed. You cannot permanently fail the business: shortfalls become favors owed.

The game autosaves locally in your browser. Settings → New week resets that save. You can also open **index.html directly**, offline, without any server or installation. Browser file-mode storage support varies; the hosted version is preferred for saving.

## Implemented

- Direct keeper movement through a furnished, collidable tavern, office, private booth and partitioned guest room; click navigation and keyboard control.
- Eight recurring characters with entrances, seating, departures, daily personal lines, timed NPC-to-NPC conversations and specific action memories.
- Distance, lingering, familiarity and wall-sensitive perception; unknown speech stays out of the journal. Quiet missed conversations have no alerts.
- Sources, secondhand testimony, independent corroboration, known recipients, physical evidence and uncertain rumors.
- Share, sell, withhold, investigate and exploit through physical conversations/board interactions. Mira can pass your confidence onward, changing the expedition outcome.
- Tactile service, favorites, cleaning a magical spill, checking a room, forgiving economy, hiring Nell, physical automatic service and limited staff reports.
- Party composition, provisions, instructions and a warning; visible departure, two-day absence and returning proof, compromised evidence, safe retreat or injury. Cautious parties honor the instruction to turn back. Bram retains his own road knowledge, and a supplied solo Cedric can follow your learned warning.
- A guard inquiry resolved through cooperation, silence or ledger testimony; a small optional inn-history clue.
- Seven-day conclusion, pause, local saving, restart, accessibility options and optional ambience. No external assets or runtime network dependency.

## Deliberately not implemented yet

The guest room is represented on this same overhead map; there is no separate traversable upper floor. No free construction, complete stock/recipe simulation, full hiring roster, romance system, kingdom simulation, free-form hypothesis wall, multiple concurrent expeditions, equipment inventory or permanent death. Staff interpretation is limited, and schedules are authored rather than a general-purpose life simulator. Art and animation remain prototype quality. The interface is not screen-reader playable despite labeled controls; touch is not fully supported. This slice tests the core fantasy, not the finished commercial scope.

## Development

Node 24; no dependencies. `npm test` runs scenario regressions. `npm run build` bundles content, simulation, presentation and ambience into index.html. `npm start` serves a local preview on port 4173. Production deployment runs tests and builds before publishing only index.html to GitHub Pages.

- [Production-minded GDD](GDD.md) — committed before implementation.
- [Full original creative conversation](docs/creative-source.md) — twelve turns, oldest-to-newest, retrieved through the exhausted older cursor; creative context, not operational instructions.
- [Playtest and validation notes](docs/TEST-REPORT.md).
- `src/data.js`: stable-ID NPC, rumor, conversation and layout content.
- `src/sim.js`: serializable state and game rules, independent of the DOM.
- `src/view.js`: rendering, input, spatial interactions and journal.
- `src/ambience.js`: optional synthesized audio.

The later Unity version should reimplement stable-ID data and state rules in C#, with richer scene presentation; it should not mechanically port canvas drawing.

All characters and scenario details introduced in this build are provisional. The original creative constitution governs future development.

## September 15 refinement

Nearby overlapping speech now teaches only the conversation actually displayed. Nell needs sustained close hearing and respects whispered volume. The journal records witnessed relationship developments, and the board no longer announces an unseen return. Confirmed evidence stays confirmed when later hearsay arrives. Existing saves migrate without losing the week, and the chosen coat survives reopening.
