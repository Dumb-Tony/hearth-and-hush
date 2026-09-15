# Validation and playtest report

## Automated checks

26 scenario regressions pass under Node 24.19.0 using the same simulation bundled into the playable HTML. These include:

- Complete routes from four room origins to every interaction station; keyboard collision sweeps and a continuous click-route input replay to every station.
- Distant quiet speech stays unknown; close lingering learns a sourced warning; partitions block both perception and interaction, including with clearer cues enabled.
- Duplicate testimony and Nell repeating the same original source do not self-corroborate.
- Time and all tested world actions freeze while paused.
- Held-key pouring, favorite service, specific memories, and repeat-drink money-exploit prevention.
- Physical staff service, no automatic service in the private room, and limited staff coverage.
- Physical expedition departure, two-day absence, prepared proof return, information-leak compromise, and underprepared injury.
- Late or unaffordable dispatch rejection; persistent fallback letter; full seven-day ending; serialized state roundtrip and damaged-save recovery.
- Sale, blackmail, ledger testimony, guard-search cooperation and refusal produce different state and memories.

JavaScript syntax checks and the standalone HTML build pass. The deployed workflow repeats scenario tests before publishing.

## Browser interaction checks

The actual local build was opened in the Codex browser at a laptop-sized viewport. Verified through browser controls and visible results:

- Onboarding opens and enters the game.
- Click-to-walk reaches Nell, and E opens her conversation.
- Space disables physical dialogue actions; resuming re-enables eligible actions while leaving unavailable ones disabled.
- Hiring Nell deducts 12 coins, closes the conversation, and changes the room's delegation status.
- Save/reload returns to the current day and keeps the keeper's position and state.
- The complete room, front door, controls and status now fit on the laptop viewport without scrolling.
- Public-build movement beside Bram and Cedric reveals their full bridge warning; the journal records Bram, day one, and the overheard channel.
- Journal return buttons were clicked and verified to close the overlay after the browser-specific handler fix.

This is agent-driven browser playtesting, **not a human manual-feel test**. The full week and expedition branches were exercised in the deterministic simulation, not replayed for 21 wall-clock minutes through browser input. Browser audio and touch play have not received human listening/usability checks.

## Defects found and corrected during this pass

1. Canvas height cut off the front door on laptop screens → viewport-fitted stage.
2. Dialogue actions remained disabled after pausing and resuming → preserve original eligibility and restore it on resume.
3. Long-range rendering showed people behind solid partitions → render NPCs only along unobstructed sight lines.
4. Journal exposed Mira's onward recipient before the keeper could know → reveal that recipient during the return debrief.
5. Secondhand repeat testimony counted as independent corroboration → preserve original-source identity.
6. Early path termination bunched characters together → route to the nearest valid destination grid cell.
7. Repeated service could create unlimited coins → additional drinks are gifts after a guest's first paid service that day.
8. Nearby interaction hint could identify a guest through a wall → enforce sight at target selection as well as action execution.
9. Rehydrated NPCs kept old routes after layout edits → rebuild routes after loading.
10. An inline `close()` handler resolved to the browser document method instead of closing the journal → use a distinct `closePanel()` name; retested by clicking the real button.

## Next human playtest

Please play without reading the scenario code. Useful notes: whom you remembered, when you moved to overhear something, whether the quiet time felt comfortable or empty, whether you cared about the absent party, and whether an information choice surprised you. In particular, tune speech range, reading time, service frequency and expedition delay before expanding recipes or decoration.

## Public deployment

The public GitHub Pages URL was opened in the browser and the onboarding and playable scene loaded successfully. GitHub Actions completed both validation/build and deployment successfully.

## Remaining limits

See README for explicit feature deferrals. Most importantly, authored schedules are a bounded prototype of independent lives; there is one expedition and one main information arc. Art is simple 2D. Long-term attachment, robust screen-reader play, fully supported touch interaction and the eventual 3D design are unproven.

