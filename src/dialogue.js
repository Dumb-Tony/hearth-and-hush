// Player-facing choices name the information or action explicitly. Neutral
// conversation exits never count as refusing a request or sharing a secret.
const Dialogue = {
  personalNote(n) {
    return {
      cedric:
        "Cedric told me he is paying for his sister’s glassmaking apprenticeship.",
      mira: "Mira told me she is saving enough to leave the people she works for.",
      nell: "Nell told me she wants to buy a small boat.",
      oren: "Oren told me he needs the shipments to pay his drivers and feed his horses.",
      tomas: "Tomas told me he needs evidence he can use in his report.",
      aldous: "Aldous asked for blankets and food for families at the chapel.",
      bram: "Bram told me he wants to keep Cedric safe while he learns.",
      ivo: "Ivo told me he found the inn in three old treaties. He wants to know why people met here.",
    }[n.id];
  },
  choices(s, n) {
    const options = [];
    const add = (verb, label, detail, disabled = false) =>
      options.push({ verb, label, detail, disabled });
    if (n.id === "mira" && s.knowledge.wagons && !s.world.leak) {
      add(
        "share",
        "Tell Mira about the missing wagons",
        "I will tell Mira what I know. She may tell other people.",
      );
      add(
        "withhold",
        "Don't tell Mira about the wagons",
        "I will tell Mira I am keeping this information private.",
      );
    }
    if (n.id === "oren") {
      if (s.knowledge.wagons && !s.world.sold) {
        add(
          "sell",
          "Sell Oren my wagon information · 15 coins",
          "Oren will pay me 15 coins for my information about the missing wagons.",
        );
        add(
          "withhold",
          "Don't sell Oren the information",
          "I will refuse Oren’s offer, keep my information and receive no payment.",
        );
      }
      if (s.knowledge.ledger && !s.world.exploited)
        add(
          "exploit",
          "Demand 25 coins to keep the ledger secret",
          "I will threaten to expose Oren’s payments unless he pays me. He will remember this.",
        );
    }
    if (n.id === "nell") {
      if (!s.staff.hired)
        add(
          "hire",
          "Hire Nell · 12 coins",
          s.coins < 12
            ? "I need 12 coins to hire Nell. I will also owe her 3 coins per day."
            : "Nell will serve my public tables. I will pay her 3 coins per day.",
          s.coins < 12,
        );
      else
        add(
          "report",
          "Ask Nell what she overheard",
          "I will ask Nell to repeat conversations she was close enough to understand.",
        );
    }
    if (n.id === "cedric" && s.quest?.resolved && !s.quest.debriefed)
      add(
        "debrief",
        "Ask what happened on the expedition",
        "I will hear Cedric’s full account and inspect anything he brought back.",
      );
    if (n.id === "tomas") {
      if (s.events.search) {
        add(
          "cooperate",
          "Let Tomas search the inn",
          "I will give Tomas permission to search my inn for evidence.",
        );
        add(
          "withhold",
          "Refuse the search",
          "I will refuse Tomas permission to search my inn. He will record my refusal.",
        );
      }
      if (s.knowledge.ledger)
        add(
          "testify",
          "Give Tomas the ledger as evidence",
          "I will give Tomas the record of Oren’s payments.",
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
