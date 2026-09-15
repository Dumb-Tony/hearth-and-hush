const fs = require("node:fs"),
  vm = require("node:vm"),
  assert = require("node:assert/strict");
const context = vm.createContext({ console });
vm.runInContext(
  fs.readFileSync("src/data.js", "utf8") +
    "\n" +
    fs.readFileSync("src/sim.js", "utf8") +
    "\n" +
    fs.readFileSync("src/dialogue.js", "utf8") +
    "\nglobalThis.api={DATA,Sim,Dialogue};",
  context,
);
const { DATA, Sim, Dialogue } = context.api;
let count = 0;
function test(name, fn) {
  try {
    fn();
    console.log("PASS " + name);
    count++;
  } catch (e) {
    console.error("FAIL " + name);
    throw e;
  }
}
function advance(s, secs) {
  for (let i = 0; i < secs * 10; i++) Sim.tick(s, 0.1);
}
function place(s, id) {
  let n = Sim.npc(s, id);
  n.present = true;
  n.away = false;
  s.player.x = n.x;
  s.player.y = n.y;
  return n;
}
function at(s, id) {
  let p = DATA.stations.find((x) => x.id === id);
  s.player.x = p.x;
  s.player.y = p.y;
}
function prep(opts, leak = false) {
  let s = Sim.fresh();
  advance(s, 50);
  Sim.learn(s, "wagons", "test witness");
  Sim.learn(s, "warning", "Bram");
  if (leak) {
    place(s, "mira");
    assert(Sim.act(s, "share", "mira"));
  }
  at(s, "board");
  assert(Sim.act(s, "dispatch", null, opts));
  return s;
}
test("every station is reachable from entrance, office, booth and bar", () => {
  for (let start of [
    { x: 480, y: 597 },
    { x: 280, y: 160 },
    { x: 800, y: 220 },
    { x: 80, y: 400 },
  ])
    for (let st of DATA.stations) {
      if (Sim.dist(start, st) < 35) continue;
      let route = Sim.route(start, st);
      assert(route.length, st.id + " from " + JSON.stringify(start));
      assert(Sim.dist(route.at(-1), st) < 65);
      for (let p of route) assert(!Sim.blocked(p.x, p.y));
    }
});
test("complete keyboard routes do not pass through tables or partitions", () => {
  let s = Sim.fresh();
  for (let dir of ["left", "up", "right", "down"]) {
    for (let i = 0; i < 600; i++) {
      Sim.tick(s, 0.1, { [dir]: true });
      assert(!Sim.blocked(s.player.x, s.player.y));
    }
  }
});
test("quiet information is not learned at a distance", () => {
  let s = Sim.fresh();
  s.player.x = 90;
  s.player.y = 110;
  advance(s, 140);
  assert.equal(Object.keys(s.knowledge).length, 0);
  assert.equal(s.notes.length, 0);
});
test("proximity and lingering acquire a sourced warning", () => {
  let s = Sim.fresh();
  advance(s, 30);
  s.player.x = 350;
  s.player.y = 480;
  advance(s, 15);
  assert(s.knowledge.warning);
  assert.equal(s.knowledge.warning.observations[0].source, "Bram");
});
test("partitions block perception and accessibility does not reveal through walls", () => {
  let s = Sim.fresh(),
    n = Sim.npc(s, "mira");
  n.x = 775;
  n.y = 150;
  let t = DATA.talks.find((t) => t.id === "booth");
  s.player.x = 680;
  s.player.y = 150;
  assert.equal(Sim.perceive(s, t).tier, 0);
  s.settings.clear = true;
  assert.equal(Sim.perceive(s, t).tier, 0);
});
test("duplicate sources never self-corroborate", () => {
  let s = Sim.fresh();
  Sim.learn(s, "wagons", "Oren");
  Sim.learn(s, "wagons", "Oren");
  assert.equal(s.knowledge.wagons.observations.length, 1);
  assert.notEqual(s.knowledge.wagons.status, "Corroborated");
  Sim.learn(s, "wagons", "Tomas");
  assert.equal(s.knowledge.wagons.status, "Corroborated");
});
test("all world actions and time freeze while paused", () => {
  let s = Sim.fresh();
  advance(s, 50);
  place(s, "nell");
  s.player.carry = "tea";
  s.paused = true;
  let before = JSON.stringify(s);
  for (let verb of [
    "serve",
    "hire",
    "talk",
    "report",
    "withhold",
    "take",
    "dispatch",
    "sleep",
    "discard",
  ])
    assert.equal(Sim.act(s, verb, "nell"), false);
  advance(s, 20);
  assert.equal(JSON.stringify(s), before);
});
test("hospitality earns money and a specific remembered kindness", () => {
  let s = Sim.fresh();
  at(s, "tea");
  assert(Sim.act(s, "take", "tea"));
  let n = place(s, "nell");
  assert(Sim.act(s, "serve", "nell"));
  assert.equal(s.coins, 29);
  assert.equal(n.familiar, 2);
  assert(n.memory[0].includes("tea"));
});
test("hiring staff serves physical public tables and preserves upstairs blind spot", () => {
  let s = Sim.fresh();
  advance(s, 10);
  place(s, "nell");
  assert(Sim.act(s, "hire", "nell"));
  advance(s, 100);
  assert(s.npcs.some((n) => n.id !== "nell" && n.served));
  assert.equal(Sim.npc(s, "ivo").served, 0);
});
test("prepared expedition physically exits and remains absent for days", () => {
  let s = prep({ bram: true, supplies: true, warning: true, cautious: true });
  advance(s, 12);
  assert(!Sim.npc(s, "cedric").present);
  assert(!s.quest.resolved);
  Sim.nextDay(s);
  advance(s, 60);
  assert(!Sim.npc(s, "cedric").present);
  assert(!s.quest.resolved);
  Sim.nextDay(s);
  advance(s, 30);
  assert(s.quest.resolved);
  assert(Sim.npc(s, "cedric").present);
  place(s, "cedric");
  assert(Sim.act(s, "debrief", "cedric"));
  assert.equal(s.quest.outcome, "proof");
  assert(s.knowledge.ledger);
});
test("Mira disclosure changes outcome and who knows the rumor", () => {
  let s = prep(
    { bram: true, supplies: true, warning: true, cautious: true },
    true,
  );
  Sim.nextDay(s);
  Sim.nextDay(s);
  advance(s, 30);
  place(s, "cedric");
  Sim.act(s, "debrief", "cedric");
  assert.equal(s.quest.outcome, "compromised");
  assert(!s.knowledge.ledger);
  assert(s.knowledge.wagons.knownBy.includes("Reed Knives"));
  assert(s.relationships["cedric:mira"].includes("distrusts"));
});
test("underprepared expedition returns injured, without arbitrary mortality", () => {
  let s = prep({
    bram: false,
    supplies: false,
    warning: false,
    cautious: false,
  });
  Sim.nextDay(s);
  Sim.nextDay(s);
  advance(s, 30);
  assert.equal(s.quest.outcome, "injured");
  assert(Sim.npc(s, "cedric").present);
});
test("critical fallback letter remains locally inspectable", () => {
  let s = Sim.fresh();
  Sim.nextDay(s);
  Sim.nextDay(s);
  advance(s, 30);
  assert(!s.knowledge.wagons);
  at(s, "board");
  assert(Sim.act(s, "inspect", "letter"));
  assert(s.knowledge.wagons);
  assert(s.knowledge.diversion);
});
test("seven unobserved days complete safely with debt and an ending", () => {
  let s = Sim.fresh();
  advance(s, 1262);
  assert(s.ended);
  assert.equal(s.day, 7);
  assert(s.paused);
  assert(Sim.summary(s).length > 5);
});
test("save roundtrip preserves expedition, evidence and memories", () => {
  let s = prep(
    { bram: true, supplies: true, warning: true, cautious: true },
    true,
  );
  let restored = JSON.parse(JSON.stringify(s));
  assert.equal(JSON.stringify(restored), JSON.stringify(s));
  advance(restored, 10);
  assert(restored.world.leak);
  assert(restored.quest.party.includes("bram"));
});
test("holding interact fills a drink at a cask and stops at full hands", () => {
  let s = Sim.fresh();
  s.player.x = 80;
  s.player.y = 260;
  for (let i = 0; i < 20; i++) Sim.tick(s, 0.1, { interact: true });
  assert.equal(s.player.carry, "ale");
  assert.equal(s.coins, 24);
});
test("repeat drinks are gifts, not an unlimited money exploit", () => {
  let s = Sim.fresh();
  place(s, "nell");
  s.player.carry = "tea";
  Sim.act(s, "serve", "nell");
  s.player.carry = "tea";
  Sim.act(s, "serve", "nell");
  assert.equal(s.coins, 29);
});
test("secondhand repetition of the original source is not corroboration", () => {
  let s = Sim.fresh();
  Sim.learn(s, "wagons", "Oren");
  Sim.learn(s, "wagons", "Nell, recalling Oren", "secondhand");
  assert.notEqual(s.knowledge.wagons.status, "Corroborated");
});
test("selling and exploiting information have distinct persistent outcomes", () => {
  let s = Sim.fresh();
  place(s, "oren");
  Sim.learn(s, "wagons", "Tomas");
  assert(Sim.act(s, "sell", "oren"));
  assert.equal(s.coins, 39);
  assert.equal(Sim.act(s, "sell", "oren"), false);
  Sim.learn(s, "ledger", "Ledger", "evidence", true);
  assert(Sim.act(s, "exploit", "oren"));
  assert.equal(s.coins, 64);
  assert(s.world.trade.includes("silence"));
  assert(
    Sim.npc(s, "oren").memory.some((m) =>
      m.includes("I threatened to expose Oren"),
    ),
  );
});
test("testimony changes the road without a morality meter", () => {
  let s = Sim.fresh();
  place(s, "tomas");
  Sim.learn(s, "ledger", "Ledger", "evidence", true);
  assert(Sim.act(s, "testify", "tomas"));
  assert(s.world.trade.includes("reopened"));
  assert(!("morality" in s));
});
test("search cooperation and withholding produce different watch memories", () => {
  let s = Sim.fresh();
  s.events.search = true;
  place(s, "tomas");
  assert(Sim.act(s, "cooperate", "tomas"));
  assert(s.world.guard.includes("no proof"));
  assert(Sim.act(s, "withhold", "tomas"));
  assert(s.world.guard.includes("declined"));
});
test("physical interactions cannot reach a guest through a wall", () => {
  let s = Sim.fresh(),
    n = Sim.npc(s, "mira");
  n.x = 740;
  n.y = 150;
  n.present = true;
  s.player.x = 695;
  s.player.y = 150;
  assert.equal(Sim.act(s, "talk", "mira"), false);
  assert.equal(Sim.nearNpc(s), undefined);
});
test("party preparation rejects insufficient money and late departures", () => {
  let s = Sim.fresh();
  advance(s, 50);
  Sim.learn(s, "wagons", "Oren");
  at(s, "board");
  s.coins = 2;
  assert(!Sim.act(s, "dispatch", null, { bram: true }));
  s.coins = 100;
  s.day = 5;
  assert(!Sim.act(s, "dispatch", null, {}));
});
test("click-route input replay reaches all stations without geometry penetration", () => {
  let s = Sim.fresh();
  for (let st of DATA.stations) {
    s.player.path = Sim.route(s.player, st);
    for (let i = 0; i < 300 && s.player.path.length; i++) {
      Sim.tick(s, 0.1);
      assert(
        !Sim.blocked(s.player.x, s.player.y),
        st.id + " at " + s.player.x + "," + s.player.y,
      );
    }
    assert(Sim.dist(s.player, st) < 65, st.id);
  }
});
test("corrupt or incomplete saves recover to a playable new week", () => {
  for (const raw of [
    "{broken",
    "null",
    '{"version":1}',
    JSON.stringify({ ...Sim.fresh(), day: 99 }),
    JSON.stringify({ ...Sim.fresh(), npcs: [] }),
  ]) {
    const s = Sim.restore(raw);
    assert.equal(s.day, 1);
    assert.equal(s.npcs.length, 8);
    advance(s, 3);
  }
  const original = prep(
    { bram: true, supplies: true, warning: true, cautious: true },
    true,
  );
  const loaded = Sim.restore(JSON.stringify(original));
  assert(loaded.world.leak);
  assert(loaded.quest.bram);
  assert.equal(loaded.day, original.day);
});
test("every authored conversation has a physically realizable meeting", () => {
  const s = Sim.fresh(),
    seen = new Set();
  for (let i = 0; i < 12600; i++) {
    Sim.tick(s, 0.1);
    for (const t of Sim.activeTalks(s)) seen.add(t.id);
  }
  for (const t of DATA.talks) assert(seen.has(t.id), t.id);
});
test("cautious underprepared parties turn back alive and follow instructions", () => {
  const s = prep({
    bram: false,
    supplies: false,
    warning: false,
    cautious: true,
  });
  Sim.nextDay(s);
  Sim.nextDay(s);
  advance(s, 30);
  place(s, "cedric");
  Sim.act(s, "debrief", "cedric");
  assert.equal(s.quest.outcome, "turnedBack");
  assert(s.quest.returnLine.includes("turned back"));
  assert(s.knowledge.warning);
  assert(!s.knowledge.ledger);
});
test("Bram retains his own road knowledge without the keeper repeating it", () => {
  const s = prep({
    bram: true,
    supplies: true,
    warning: false,
    cautious: true,
  });
  Sim.nextDay(s);
  Sim.nextDay(s);
  advance(s, 30);
  assert.equal(s.quest.outcome, "proof");
});
test("a supplied solo novice can follow a learned safe route", () => {
  const s = prep({
    bram: false,
    supplies: true,
    warning: true,
    cautious: true,
  });
  Sim.nextDay(s);
  Sim.nextDay(s);
  advance(s, 30);
  place(s, "cedric");
  Sim.act(s, "debrief", "cedric");
  assert.equal(s.quest.outcome, "proof");
  assert(s.knowledge.ledger);
  assert(s.quest.returnLine.includes("Your warning"));
});
test("an unseen return does not reveal relationship changes", () => {
  const s = prep({ bram: true, supplies: true, warning: true, cautious: true });
  Sim.nextDay(s);
  Sim.nextDay(s);
  s.player.x = 90;
  s.player.y = 100;
  advance(s, 30);
  assert(s.quest.resolved);
  assert(!s.quest.returnSeen);
  assert(!s.observedRelationships["cedric:bram"]);
  place(s, "cedric");
  Sim.act(s, "debrief", "cedric");
  assert(s.quest.returnSeen);
  assert(s.observedRelationships["cedric:bram"]);
});
test("later hearsay cannot downgrade confirmed physical evidence", () => {
  const s = Sim.fresh();
  Sim.learn(s, "ledger", "Ledger", "physical evidence", true);
  Sim.learn(s, "ledger", "Oren", "heard");
  assert.equal(s.knowledge.ledger.status, "Confirmed evidence");
});
test("overlapping speech only teaches the conversation actually attended", () => {
  const s = Sim.fresh();
  s.time = 10;
  for (const [id, x, y] of [
    ["bram", 350, 510],
    ["cedric", 415, 510],
    ["aldous", 430, 510],
    ["nell", 495, 510],
  ]) {
    const n = Sim.npc(s, id);
    n.present = true;
    n.x = x;
    n.y = y;
    n.goal = null;
  }
  s.player.x = 350;
  s.player.y = 480;
  DATA.talks.push(
    {
      id: "test-a",
      days: [1],
      start: 0,
      end: 20,
      a: "bram",
      b: "cedric",
      rumor: "warning",
    },
    {
      id: "test-b",
      days: [1],
      start: 0,
      end: 20,
      a: "aldous",
      b: "nell",
      rumor: "diversion",
    },
  );
  try {
    advance(s, 4);
    assert(s.knowledge.warning);
    assert(!s.knowledge.diversion);
  } finally {
    DATA.talks.splice(-2);
  }
});
test("Nell cannot instantly collect whispers outside close hearing", () => {
  const s = Sim.fresh();
  s.staff.hired = true;
  s.time = 15;
  const def = DATA.npcs.find((n) => n.id === "bram"),
    oldY = def.y;
  def.y = 265;
  for (const n of s.npcs) {
    n.present = true;
    n.served = 1;
  }
  Object.assign(Sim.npc(s, "nell"), { x: 245, y: 265 });
  Object.assign(Sim.npc(s, "bram"), { x: 350, y: 265 });
  Object.assign(Sim.npc(s, "cedric"), { x: 415, y: 265 });
  DATA.talks.push({
    id: "test-whisper",
    days: [1],
    start: 0,
    end: 21,
    a: "bram",
    b: "cedric",
    whisper: true,
    rumor: "knives",
  });
  try {
    advance(s, 4);
    assert(!s.staff.reports.some((r) => r.id === "knives"));
  } finally {
    DATA.talks.pop();
    def.y = oldY;
  }
});
test("existing v1 saves migrate without resetting the player's week", () => {
  const old = Sim.fresh();
  old.day = 4;
  delete old.observedRelationships;
  const restored = Sim.restore(JSON.stringify(old));
  assert.equal(restored.day, 4);
  assert.equal(Object.keys(restored.observedRelationships).length, 0);
});
test("refusal choices require an actual information request", () => {
  const s = Sim.fresh();
  for (const id of [
    "nell",
    "bram",
    "cedric",
    "aldous",
    "ivo",
    "mira",
    "oren",
  ]) {
    const n = place(s, id);
    assert(!Dialogue.choices(s, n).some((o) => o.verb === "withhold"));
    assert.equal(Sim.act(s, "withhold", id), false);
  }
  Sim.learn(s, "wagons", "witness");
  const mira = place(s, "mira");
  assert(Dialogue.choices(s, mira).some((o) => o.verb === "withhold"));
  const coins = s.coins;
  assert(Sim.act(s, "withhold", "mira"));
  assert.equal(s.coins, coins);
  assert(!s.world.leak);
  assert(Sim.act(s, "share", "mira"));
  assert(
    !Dialogue.choices(s, mira).some(
      (o) => o.verb === "share" || o.verb === "withhold",
    ),
  );
});
test("dialogue refreshes authored copy in existing saves", () => {
  const s = Sim.fresh();
  const nell = Sim.npc(s, "nell");
  nell.intro = "obsolete saved dialogue";
  nell.familiar = 0;
  assert.equal(
    Dialogue.line(s, nell),
    DATA.npcs.find((n) => n.id === "nell").intro,
  );
  s.coins = 0;
  assert(Dialogue.choices(s, nell).find((o) => o.verb === "hire").disabled);
});
test("legacy transaction memories migrate once without reversing the payment", () => {
  const s = Sim.fresh();
  const oren = Sim.npc(s, "oren");
  oren.memory = [
    "You sold me the road news for 15 coins.",
    "You used my ledger against me.",
  ];
  Sim.npc(s, "nell").memory = [
    "You brought tea on day 2.",
    "You gave me steady work.",
  ];
  s.notes = [
    {
      day: 2,
      text: "You gave Tomas the ledger. The watch can act on evidence.",
    },
  ];
  const restored = Sim.restore(JSON.stringify(s));
  assert.equal(restored.coins, s.coins);
  assert.equal(
    Sim.npc(restored, "oren").memory[0],
    "I sold Oren information about the missing wagons. He paid me 15 coins.",
  );
  assert.equal(
    Sim.npc(restored, "nell").memory[0],
    "I served Nell tea on day 2.",
  );
  assert(restored.notes[0].text.startsWith("I gave Tomas"));
  const again = Sim.restore(JSON.stringify(restored));
  assert.deepEqual(
    again.npcs.map((n) => n.memory),
    restored.npcs.map((n) => n.memory),
  );
});
test("new sale records keeper as seller and Oren as payer", () => {
  const s = Sim.fresh();
  Sim.learn(s, "wagons", "witness");
  const oren = place(s, "oren"),
    before = s.coins;
  assert(Sim.act(s, "sell", "oren"));
  assert.equal(s.coins, before + 15);
  assert.equal(
    oren.memory.at(-1),
    "I sold Oren information about the missing wagons. He paid me 15 coins.",
  );
  assert(!Sim.act(s, "sell", "oren"));
  assert.equal(s.coins, before + 15);
});
console.log("\n" + count + " scenario regressions passed.");
