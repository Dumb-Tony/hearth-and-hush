// Player-facing choices name the information or action explicitly. Neutral
// conversation exits never count as refusing a request or sharing a secret.
const Dialogue = {
  choices(s, n) {
    const options = [];
    const add = (verb, label, detail, disabled = false) =>
      options.push({ verb, label, detail, disabled });
    if (n.id === "mira" && s.knowledge.wagons && !s.world.leak) {
      add(
        "share",
        "Tell Mira about the missing wagons",
        "She will learn what you know. She may tell other people.",
      );
      add(
        "withhold",
        "Don't tell Mira about the wagons",
        "Tell her you are keeping this information private.",
      );
    }
    if (n.id === "oren") {
      if (s.knowledge.wagons && !s.world.sold) {
        add(
          "sell",
          "Sell your wagon information · 15 coins",
          "Oren pays you for what you know about the missing shipment.",
        );
        add(
          "withhold",
          "Don't sell Oren the information",
          "Refuse his offer. You keep the information and receive no payment.",
        );
      }
      if (s.knowledge.ledger && !s.world.exploited)
        add(
          "exploit",
          "Demand 25 coins to keep the ledger secret",
          "Threaten to expose Oren's payments unless he pays you. He will remember this.",
        );
    }
    if (n.id === "nell") {
      if (!s.staff.hired)
        add(
          "hire",
          "Hire Nell · 12 coins",
          s.coins < 12
            ? "You need 12 coins to hire her. Her wage is 3 coins per day."
            : "She serves the public tables. Her wage is 3 coins per day.",
          s.coins < 12,
        );
      else
        add(
          "report",
          "Ask Nell what she overheard",
          "Hear her account of conversations she was close enough to understand.",
        );
    }
    if (n.id === "cedric" && s.quest?.resolved && !s.quest.debriefed)
      add(
        "debrief",
        "Ask what happened on the expedition",
        "Hear his full account and inspect anything he brought back.",
      );
    if (n.id === "tomas") {
      if (s.events.search) {
        add(
          "cooperate",
          "Let Tomas search the inn",
          "Give the watch permission to look for evidence.",
        );
        add(
          "withhold",
          "Refuse the search",
          "Do not let the watch search. Tomas will record your refusal.",
        );
      }
      if (s.knowledge.ledger)
        add(
          "testify",
          "Give Tomas the ledger as evidence",
          "Show the watch the record of Oren's payments.",
        );
    }
    return options;
  },
  line(s, n) {
    if (n.id === "mira" && s.world.leak)
      return "I asked my contacts about those wagons. I told them what you told me. I thought they could help.";
    if (n.id === "oren" && s.world.exploited)
      return "You have your money. Keep that ledger away from the watch. I will not forget this.";
    if (n.id === "oren" && s.world.sold)
      return "I paid you for that information about the wagons. Please do not pass it to the watch as well.";
    if (n.id === "tomas" && s.events.search)
      return "I am investigating the old tollhouse. May I search the inn for evidence? You can refuse, but I will record that in my report.";
    if (n.id === "cedric" && s.quest?.resolved)
      return (
        s.quest.returnLine ||
        "I am back from the tollhouse. Let me tell you what happened."
      );
    if (n.id === "bram" && n.familiar >= 2 && !s.quest?.resolved)
      return "The north bridge is rotten. Take rope and use the ridge path instead. If the crossing looks unsafe, turn back.";
    if (n.id === "tomas" && n.familiar >= 2)
      return "The wagon tracks turn toward the old tollhouse. I found no sign of a fight at the junction. I still need to find out why they went that way.";
    const def = DATA.npcs.find((d) => d.id === n.id);
    return n.familiar > 1 ? DATA.daily[n.id][s.day - 1] : def.intro;
  },
};
