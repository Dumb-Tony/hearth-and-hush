// A disposable rehearsal uses the real movement, service and hearing rules.
const Guide = {
  create(player) {
    const s = Sim.fresh();
    s.practice = true;
    s.lesson = 0;
    Object.assign(s.player, {
      name: player.name,
      color: player.color,
      x: 230,
      y: 300,
    });
    for (const n of s.npcs) {
      n.present = n.id === "nell";
      n.path = [];
      n.away = false;
    }
    return s;
  },
  target(s) {
    if (s.lesson < 2) return DATA.stations.find((x) => x.id === "tea");
    if (s.lesson < 4) return Sim.npc(s, "nell");
    if (s.lesson === 4) return Sim.npc(s, "bram");
    return null;
  },
  update(s) {
    if (!s.practice) return;
    if (s.lesson === 0 && Sim.nearStation(s)?.id === "tea") s.lesson = 1;
    if (s.lesson === 1 && s.player.carry === "tea") s.lesson = 2;
    if (s.lesson === 2 && !s.player.carry && !Sim.npc(s, "nell").served)
      s.lesson = 1;
    if (s.lesson === 4 && s.knowledge.warning) s.lesson = 5;
  },
  action(s, verb, id) {
    if (!s.practice) return;
    if (s.lesson === 2 && verb === "serve" && id === "nell") s.lesson = 3;
    else if (s.lesson === 3 && verb === "talk" && id === "nell") {
      s.lesson = 4;
      s.time = 30;
      for (const [id, x] of [
        ["bram", 340],
        ["cedric", 405],
      ]) {
        Object.assign(Sim.npc(s, id), { present: true, x, y: 485, path: [] });
      }
    } else if (s.lesson === 5 && verb === "journal") s.lesson = 6;
    Guide.update(s);
  },
  copy: [
    [
      "Walk to the tea kettle",
      "Click the glowing ring by the kettle, or use WASD / arrow keys. I am the character named Keeper (or the name I chose).",
    ],
    [
      "Pour a cup of tea",
      "Press E once, or click Pour tea below. I can carry one drink at a time.",
    ],
    [
      "Bring the tea to Nell",
      "Walk to Nell’s glowing ring, then press E to serve her. Serving drinks earns coins.",
    ],
    [
      "Say hello to Nell",
      "Now my hands are empty. Press E beside Nell to talk. Read her words, then choose End conversation.",
    ],
    [
      "Listen to Bram and Cedric",
      "End the conversation with Nell. Walk to Bram’s ring and stay nearby for a few seconds. No button needed. Their words appear at the bottom of the room.",
    ],
    [
      "Find the note I just learned",
      "Open Journal (or press J). The bridge warning is recorded with its source. I do not need to memorize every conversation.",
    ],
    [
      "Ready to run the inn",
      "Serve drinks for coins. Talk and listen for information. Decide whom to trust. Space pauses the room whenever I need a moment.",
    ],
  ],
};
let tutorialSave = null,
  guideMarkup = "";
function startPractice() {
  if (tutorialSave) return;
  save();
  tutorialSave = state;
  state = Guide.create(state.player);
  started = true;
  closePanel();
  document.body.classList.add("learning");
  guideMarkup = "";
}
function finishPractice() {
  if (!tutorialSave) return;
  state = tutorialSave;
  tutorialSave = null;
  state.paused = false;
  closePanel();
  document.body.classList.remove("learning");
  $("guide").hidden = true;
  state.toast =
    "Start with one guest: walk close and press E. Help is always available above.";
  state.toastTime = 12;
  save();
  if (state.ended) {
    state.paused = true;
    ending();
  }
}
function tutorialHelp() {
  if (modal === "welcome") return;
  panel(
    '<div class="eyebrow">How to play</div><h2>Run the inn. Get to know its guests.</h2><p>Serve drinks to earn coins. Talk to guests and stand near conversations to learn things. Your journal keeps the notes. Later, you can pay adventurers to investigate outside the inn.</p><p><b>Start small:</b> choose one guest. Walk close and press E. You do not need to catch every conversation.</p><p>Click the floor to walk. E interacts. J opens notes. Space pauses. Press E once at a cask or kettle to prepare a drink.</p><div class="actions">' +
      btn(
        tutorialSave ? "Return to practice" : "Practice the basics",
        tutorialSave ? "closePanel()" : "startPractice()",
      ) +
      btn("Back to the inn", "closePanel()") +
      '</div><p class="muted">Practice waits for you and leaves your saved week unchanged.</p>',
    "help",
  );
}
function guideAction() {
  if (state.paused || modal) return;
  if (state.lesson === 6) {
    finishPractice();
    return;
  }
  if (state.lesson === 5) {
    journal();
    return;
  }
  const target = Guide.target(state);
  if (
    target &&
    (Sim.dist(state.player, target) > 55 || !Sim.line(state.player, target))
  )
    state.player.path = Sim.route(state.player, target);
  else if (state.lesson !== 4) interact();
}
function drawGuide() {
  if (!state.practice) {
    $("guide").hidden = true;
    return;
  }
  Guide.update(state);
  const step = state.lesson,
    p = Guide.target(state),
    [title, detail] = Guide.copy[step];
  const near = p && Sim.dist(state.player, p) < 55 && Sim.line(state.player, p);
  const label =
    step === 6
      ? "Return to my game"
      : step === 5
        ? "Open journal"
        : !near
          ? "Walk to the marker"
          : step === 1
            ? "Pour tea"
            : step === 2
              ? "Serve Nell"
              : step === 3
                ? "Talk to Nell"
                : "Listening…";
  const html =
    '<div><span class="eyebrow">Practice · ' +
    Math.min(step + 1, 6) +
    " / 6 · the clock waits</span><h2>" +
    title +
    "</h2><p>" +
    detail +
    '</p></div><div class="guide-buttons">' +
    btn(
      label,
      "guideAction()",
      state.paused || !!modal || (step === 4 && near),
    ) +
    btn("Leave practice", "finishPractice()") +
    "</div>";
  $("guide").hidden = false;
  if (html !== guideMarkup) {
    $("guide").innerHTML = html;
    guideMarkup = html;
  }
  if (p) {
    ctx.save();
    ctx.strokeStyle = "#ffe39d";
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 5]);
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 12, 29, 14, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}
