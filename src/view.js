const canvas = document.getElementById("game"),
  ctx = canvas.getContext("2d"),
  $ = (id) => document.getElementById(id);
let state = Sim.fresh(),
  keys = {},
  modal = null,
  autosave = 0,
  last = 0,
  started = false,
  sound = null;
try {
  state = Sim.restore(localStorage.getItem("hearth-hush-v1"));
} catch {}
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function save() {
  try {
    localStorage.setItem(
      "hearth-hush-v1",
      JSON.stringify(tutorialSave || state),
    );
    return true;
  } catch {
    return false;
  }
}
function panel(html, kind = "read") {
  modal = kind;
  $("panel").innerHTML = html;
  $("overlay").style.display = "flex";
}
function closePanel() {
  modal = null;
  $("overlay").style.display = "none";
  keys = {};
}
function btn(label, action, disabled = false) {
  return `<button ${disabled ? "disabled" : ""} onclick="${action}">${label}</button>`;
}
function pause() {
  if (modal === "welcome" || state.ended) return;
  state.paused = !state.paused;
  keys = {};
  if (!state.paused && modal === "journal") closePanel();
}
function doAct(verb, id, opts) {
  const ok = Sim.act(state, verb, id, opts);
  if (!ok && !state.paused) {
    state.toast = "That needs the right person, place, time, or enough coins.";
    state.toastTime = 4;
  }
  if (ok) Guide.action(state, verb, id);
  save();
  return ok;
}
function welcome() {
  state.paused = true;
  panel(
    `<div class="eyebrow">A seven-day innkeeper story • playable prototype</div><h2>Welcome to your inn.</h2><p>I run a small inn. I earn coins by serving drinks, learn about my guests by talking and listening, and choose what to do with the information.</p><p><b>New here?</b> Try a short guided practice. One task at a time, with no ticking clock. My saved game stays safe.</p><label>Your name<input id="keeperName" type="text" maxlength="24" value="${esc(state.player.name)}"></label><label>Coat <select id="coat"><option value="#d6ab5f">Ochre</option><option value="#7caaa0">River green</option><option value="#b68c9d">Heather</option></select></label><p class="muted">About 21 minutes. Autosaves on this browser. Quiet moments can pass unnoticed; important stories have more than one trail. No service timers. Desktop recommended.</p><div class="actions">${btn("Learn the basics", "startGame(true)")}${btn(state.time || state.day > 1 ? "Continue my game" : "Skip practice and start", "startGame()")}</div>`,
    "welcome",
  );
  $("coat").value = state.player.color;
}
function startGame(learn = false) {
  state.player.name = $("keeperName").value.trim() || "Keeper";
  state.player.color = $("coat").value;
  state.paused = false;
  started = true;
  closePanel();
  if (state.ended) {
    state.paused = true;
    ending();
  }
  save();
  if (learn) startPractice();
}
function talk(id) {
  if (!doAct("talk", id)) return;
  const n = Sim.npc(state, id);
  const memories = n.memory
    .slice(-3)
    .map((t) => "<li>" + esc(t) + "</li>")
    .join("");
  const options = (state.practice ? [] : Dialogue.choices(state, n))
    .map(
      (o) =>
        '<div class="decision">' +
        btn(o.label, "choice('" + o.verb + "','" + id + "')", o.disabled) +
        "<p>" +
        esc(o.detail) +
        "</p></div>",
    )
    .join("");
  panel(
    '<div class="character-head"><canvas id="portrait" width="112" height="118" aria-hidden="true"></canvas><div><div class="eyebrow">' +
      esc(n.role) +
      "</div><h2>" +
      esc(n.name) +
      '</h2></div></div><div class="speech-label">' +
      esc(n.name) +
      ' says</div><p class="spoken">“' +
      esc(Dialogue.line(state, n)) +
      '”</p><details class="person-notes"><summary>My notes about ' +
      esc(n.name) +
      "</summary><p>" +
      esc(Dialogue.personalNote(n)) +
      "</p>" +
      (n.familiar > 2
        ? '<p class="muted">Favorite order: ' + esc(n.favorite) + ".</p>"
        : "") +
      (memories ? "<h3>What I did</h3><ul>" + memories + "</ul>" : "") +
      '</details><div class="decisions">' +
      options +
      '</div><div class="actions">' +
      btn("End conversation", "closePanel()") +
      '</div><p class="muted">The room waits while I read. Ending this conversation does not share or refuse anything.</p>',
    "talk",
  );
  const pc = $("portrait").getContext("2d");
  pc.fillStyle = "#233c42";
  pc.beginPath();
  pc.arc(56, 58, 52, 0, Math.PI * 2);
  pc.fill();
  pc.save();
  pc.translate(-22, -15);
  pc.scale(1.4, 1.4);
  TavernArt.person(pc, { ...n, x: 56, y: 75, path: [], served: false });
  pc.restore();
}
function choice(v, id) {
  if (state.paused) return;
  doAct(v, id);
  closePanel();
}
function board() {
  let q = state.quest,
    letter = state.evidence.find((e) => e.id === "letter");
  if (letter) doAct("inspect", "letter");
  panel(
    `<div class="eyebrow">The office • hands beyond the inn</div><h2>Letters & departures</h2><p>${letter ? esc(letter.text) : "Your desk holds letters from travelers and a map of the roads around Rookcross."}</p>${q ? `<h3>Blackwood tollhouse</h3><p>${q.returnSeen || q.debriefed ? "You have seen Cedric back at the inn. Find him for the full story." : "Cedric" + (q.bram ? " and Bram" : "") + " left on day " + q.departDay + ". They expected two days on the road."}</p>` : `<h3>Survey the Blackwood tollhouse</h3><p>Ask Cedric to find the missing wagons. He is eager, but has never led a survey. A bridge on this road may be unsafe.</p><label><input id="bram" type="checkbox" checked> Ask Bram to accompany him · 6 coins</label><label><input id="supplies" type="checkbox" checked> Rope, provisions and dry blankets · 4 coins</label><label><input id="cautious" type="checkbox" checked> Survey cautiously; come home before taking risks</label><label><input id="warning" type="checkbox" ${state.knowledge.warning ? "checked" : "disabled"}> Share Bram's ridge-route warning ${state.knowledge.warning ? "" : "(not learned)"}</label><p class="muted">Cedric's fee: 8 coins. Both selected travelers must be in the inn. Depart by day four to allow a return this week.</p>${btn("Agree and send them", "dispatch()", !state.knowledge.wagons || state.day > 4)}`}
<div class="actions">${btn("Read journal", "journal()")}${btn("Back to the room", "closePanel()")}</div>`,
    "board",
  );
}
function dispatch() {
  if (state.paused) return;
  let opts = {};
  for (let id of ["bram", "supplies", "cautious", "warning"])
    opts[id] = $(id).checked;
  if (doAct("dispatch", null, opts)) closePanel();
}
function journal(filter = "") {
  if (modal === "welcome") return;
  Guide.action(state, "journal");
  panel(
    `<div class="eyebrow">${esc(state.player.name)}'s journal • inspection only</div><h2>What I know</h2><input id="search" type="text" placeholder="Search people, sources, rumors…" value="${esc(filter)}" oninput="filterJournal(this.value)"><div id="entries"></div><div class="actions">${btn("Back to the room", "closePanel()")}${state.practice && state.lesson === 6 ? btn("Finish practice", "finishPractice()") : ""}</div>`,
    "journal",
  );
  filterJournal(filter);
}
function filterJournal(filter) {
  let f = filter.toLowerCase(),
    entries = Object.values(state.knowledge).filter(
      (k) =>
        JSON.stringify(k).toLowerCase().includes(f) ||
        JSON.stringify(DATA.rumors[k.id]).toLowerCase().includes(f),
    );
  $("entries").innerHTML =
    entries
      .map(
        (k) =>
          `<article><span class="tag">${k.status}</span><h3>${DATA.rumors[k.id].title}</h3><p>${DATA.rumors[k.id].text}</p><p class="muted">${k.observations.map((o) => `Day ${o.day} • ${esc(o.source)} • ${o.channel}`).join("<br>")}<br>People I know have this information: ${[...new Set(k.knownBy)].map((n) => esc(n === "keeper" ? "Me" : n)).join(", ")}</p></article>`,
      )
      .join("") +
    (!entries.length
      ? "<p>No matching leads. My other notes are below.</p>"
      : "") +
    "<h3>People & choices</h3>" +
    state.notes
      .filter((n) => n.text.toLowerCase().includes(f))
      .map((n) => `<p class="muted">Day ${n.day} — ${esc(n.text)}</p>`)
      .join("") +
    Object.entries(state.observedRelationships)
      .filter(
        ([k, v]) =>
          (k + v).toLowerCase().includes(f) &&
          k.split(":").every((id) => Sim.npc(state, id).familiar > 0),
      )
      .map(
        ([k, v]) =>
          `<p class="muted">${esc(k.replace(":", " & "))}: ${esc(v)}</p>`,
      )
      .join("");
}
function settings() {
  if (modal === "welcome") return;
  if (state.practice) {
    tutorialHelp();
    return;
  }
  panel(
    `<div class="eyebrow">Comfort & access</div><h2>Make yourself at home</h2><label><input type="checkbox" ${state.settings.clear ? "checked" : ""} onchange="state.settings.clear=this.checked"> Clearer conversation cues and a little more hearing range</label><label><input type="checkbox" ${state.settings.slow ? "checked" : ""} onchange="state.settings.slow=this.checked"> Longer days (the keeper still walks at the same pace)</label><div class="actions">${btn("Save now", "state.toast=save()?'Saved on this browser.':'Browser storage is unavailable.';state.toastTime=5;closePanel()")}${btn("New week", "confirmReset()")}${btn("Back", "closePanel()")}</div><p class="muted">Pause freely with Space. No actions can be issued while paused. This prototype contains no essential audio cues.</p>`,
    "settings",
  );
}
function confirmReset() {
  panel(
    '<h2>Begin again?</h2><p>This replaces the saved week in this browser.</p><div class="actions">' +
      btn("Start a fresh week", "state=Sim.fresh();closePanel();welcome()") +
      btn("Keep this week", "closePanel()") +
      "</div>",
    "settings",
  );
}
function ending() {
  panel(
    '<div class="eyebrow">Seven days at Rookcross</div><h2>The door will open again.</h2>' +
      Sim.summary(state)
        .map((s) => "<p>" + esc(s) + "</p>")
        .join("") +
      '<div class="actions">' +
      btn("Read your journal", "journal()") +
      btn("Try another week", "confirmReset()") +
      btn("Look at the room", "closePanel()") +
      '</div><p class="muted">End of this vertical slice. Long-term romance, town simulation and construction belong to the future game.</p>',
    "ending",
  );
}
function interact() {
  if (state.paused || modal) return;
  let n = Sim.nearNpc(state),
    st = Sim.nearStation(state),
    e = state.evidence.find((e) => Sim.dist(e, state.player) < 65);
  if (n && state.player.carry) {
    doAct("serve", n.id);
    return;
  }
  if (e && e.id === "spill") {
    doAct("inspect", e.id);
    return;
  }
  if (st && (!n || Sim.dist(st, state.player) < Sim.dist(n, state.player))) {
    if (["ale", "wine", "tea", "stew"].includes(st.id)) doAct("take", st.id);
    else if (st.id === "board") board();
    else if (st.id === "bed") {
      if (!doAct("sleep")) {
        state.toast =
          "Closing comes near the end of the day. There is time to listen.";
        state.toastTime = 5;
      }
    } else if (st.id === "room" || st.id === "hearth") doAct("inspect", st.id);
    return;
  }
  if (n) talk(n.id);
}
window.addEventListener("keydown", (e) => {
  if (e.target.matches("input,select")) return;
  if (modal === "welcome") return;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key))
    e.preventDefault();
  let k = e.key.toLowerCase();
  if (!e.repeat) {
    if (k === " ") {
      if (modal !== "welcome" && !state.ended) pause();
      return;
    }
    if (k === "escape") {
      closePanel();
      return;
    }
    if (k === "j") {
      modal === "journal" ? closePanel() : journal();
      return;
    }
    if (k === "e") interact();
    if (k === "x" && !modal) doAct("discard");
  }
  keys[k] = true;
});
window.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));
window.addEventListener("blur", () => {
  keys = {};
  if (started) state.paused = true;
  save();
});
canvas.addEventListener("pointerdown", (e) => {
  if (state.paused || modal) return;
  let r = canvas.getBoundingClientRect(),
    p = {
      x: ((e.clientX - r.left) * 1000) / r.width,
      y: ((e.clientY - r.top) * 660) / r.height,
    };
  if (!Sim.blocked(p.x, p.y)) state.player.path = Sim.route(state.player, p);
});
function rect(x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}
function ellipse(x, y, rx, ry, c) {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}
function text(t, x, y, size = 13, color = "#ddd1b5", align = "center") {
  ctx.font = `${size}px Georgia`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(t, x, y);
}
function bubble(t, x, y, color = "#d9d3b7") {
  ctx.font = "14px Georgia";
  let w = Math.min(370, ctx.measureText(t).width + 22);
  rect(x - w / 2, y - 22, w, 29, "#1d2b28ed");
  text(t, x, y - 3, 14, color);
}
function person(n, isPlayer = false) {
  TavernArt.person(ctx, n, isPlayer, state.time);
  if (n.id === "cedric" && state.quest?.outcome === "injured")
    rect(n.x - 9, n.y - 14, 18, 4, "#e8dbb5");
  ctx.save();
  const label = isPlayer ? state.player.name : n.name;
  ctx.font = "600 13px system-ui";
  const width = ctx.measureText(label).width + 16;
  ctx.fillStyle = isPlayer ? "#294744ed" : "#18272de8";
  ctx.beginPath();
  ctx.roundRect(n.x - width / 2, n.y + 16, width, 21, 6);
  ctx.fill();
  ctx.strokeStyle = isPlayer ? "#dcb579" : "#9f957866";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.shadowColor = "#111a22";
  ctx.shadowBlur = 4;
  text(
    isPlayer ? state.player.name : n.name,
    n.x,
    n.y + 31,
    13,
    isPlayer ? "#ffe6ad" : "#f0dcc0",
  );
  ctx.restore();
}
function draw() {
  ctx.clearRect(0, 0, 1000, 660);
  TavernArt.room(ctx, state.time);
  text("OFFICE", 300, 58, 10, "#e4c494");
  text("GUEST ROOM", 838, 61, 10, "#e4c494");
  text("PRIVATE BOOTH", 832, 322, 10, "#c7c9aa");
  text("FRONT DOOR", 490, 641, 10, "#adbeae");
  text("BACK DOOR", 911, 218, 9, "#c6c6ad");
  for (const st of DATA.stations.filter((s) =>
    ["ale", "wine", "tea", "stew"].includes(s.id),
  ))
    text(st.id.toUpperCase(), st.x, st.y + 29, 10, "#e8c899");
  for (let e of state.evidence) {
    if (e.id === "spill") {
      ellipse(e.x, e.y, 21, 12, "#8b72a777");
      for (let j = 0; j < 4; j++)
        ellipse(e.x + j * 12, e.y - j * 7, 3, 2, "#987ca8");
    } else {
      rect(e.x - 10, e.y - 7, 20, 14, "#e9d6a7");
    }
  }
  for (let n of [
    ...state.npcs.filter((n) => n.present && Sim.line(state.player, n)),
    { ...state.player, isPlayer: true },
  ].sort((a, b) => a.y - b.y))
    person(n, n.isPlayer);
  let best = null;
  const attending = Sim.attendedTalk(state);
  for (let t of Sim.activeTalks(state)) {
    let p = Sim.perceive(state, t),
      n = Sim.npc(state, t.a),
      h = state.heard[t.id];
    if (p.tier === 1) {
      text(
        state.settings.clear ? "speaking" : "···",
        n.x,
        n.y - 46,
        state.settings.clear ? 13 : 18,
        "#e9dabc",
      );
    }
    if (p.tier === 2) bubble(t.fragment, n.x, n.y - 45);
    if (p.tier === 3) {
      text(t.whisper ? "…" : "···", n.x, n.y - 46, 20, "#ead6a5");
      if (t.id === attending?.id) best = { t, dwell: h?.dwell || 0 };
    }
  }
  $("caption").style.display = best ? "block" : "none";
  if (best)
    $("caption").textContent =
      best.dwell >= 3 ? best.t.line : best.t.fragment + " (linger nearby)";
  let near = Sim.nearNpc(state),
    st = Sim.nearStation(state);
  let hint = state.paused
    ? "PAUSED · inspect freely · Space to resume"
    : state.player.carry
      ? `Carrying ${state.player.carry} · E near a guest · X to set down`
      : near
        ? `E · Talk to ${near.name}`
        : st
          ? ["ale", "wine", "tea", "stew"].includes(st.id)
            ? `E · Prepare ${st.id}`
            : `E · ${st.name}`
          : !state.knowledge.wagons
            ? "Start with one guest · walk close, then press E"
            : !state.quest && state.day <= 4
              ? "Missing wagons · visit the office board to plan a trip"
              : "Talk to a guest, serve a drink, or check my journal";
  $("interaction-hint").textContent =
    state.practice && !state.paused ? Guide.copy[state.lesson][0] : hint;
  if (state.pour > 0) {
    rect(state.player.x - 15, state.player.y + 36, 30, 3, "#272d28");
    rect(
      state.player.x - 15,
      state.player.y + 36,
      (30 * state.pour) / 0.65,
      3,
      "#e7c578",
    );
  }
  let phase =
    state.time < 35
      ? "Morning"
      : state.time < 110
        ? "Afternoon"
        : state.time < 145
          ? "Evening"
          : "Closing";
  $("status").innerHTML =
    `<span class="eyebrow">Day ${state.day} / 7 · ${phase}</span><div class="day-track" aria-hidden="true"><i style="width:${(100 * state.time) / 180}%"></i></div><span>${DATA.dayNames[state.day - 1]}</span> <strong class="coin-count">${state.coins} coins</strong>`;
  $("pause").textContent = state.paused ? "Resume" : "Pause";
  $("toast").textContent = state.practice
    ? "Practice only. My saved coins, guests and story stay unchanged."
    : state.toastTime > 0
      ? state.toast
      : state.staff.hired
        ? "Nell has the public tables. You have a little more room to listen."
        : "A warm room. Eight lives. You cannot be everywhere.";
  drawGuide();
  if (state.paused && modal !== "welcome") {
    rect(45, 45, 900, 571, "#15222330");
    text(state.ended ? "WEEK COMPLETE" : "PAUSED", 500, 312, 32, "#ffebbc");
  }
  if (modal) {
    for (let b of $("panel").querySelectorAll("button")) {
      if (/choice\(|dispatch\(/.test(b.getAttribute("onclick") || "")) {
        if (!("originalDisabled" in b.dataset))
          b.dataset.originalDisabled = String(b.disabled);
        b.disabled = state.paused || b.dataset.originalDisabled === "true";
      }
    }
  }
}
function frame(t) {
  let dt = Math.min(0.1, (t - last) / 1000 || 0);
  last = t;
  let wasEnded = state.ended;
  if (!modal)
    Sim.tick(
      state,
      dt,
      modal
        ? {}
        : {
            up: keys.w || keys.arrowup,
            down: keys.s || keys.arrowdown,
            left: keys.a || keys.arrowleft,
            right: keys.d || keys.arrowright,
            interact: keys.e,
          },
    );
  if (state.ended && !wasEnded) ending();
  autosave += dt;
  if (autosave > 8) {
    save();
    autosave = 0;
  }
  draw();
  requestAnimationFrame(frame);
}
welcome();
requestAnimationFrame(frame);
