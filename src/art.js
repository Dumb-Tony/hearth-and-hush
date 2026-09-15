// Stylized, shaded canvas art. The drawing uses the simulation's existing
// footprints: furniture height is visual and never changes walkable space.
const TavernArt = (() => {
  let roomCache;
  function box(c, x, y, w, h, r, fill, stroke = "#211b20", lw = 2) {
    c.beginPath();
    c.roundRect(x, y, w, h, r);
    c.fillStyle = fill;
    c.fill();
    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = lw;
      c.stroke();
    }
  }
  function oval(c, x, y, rx, ry, fill, stroke = null) {
    c.beginPath();
    c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    c.fillStyle = fill;
    c.fill();
    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = 1.6;
      c.stroke();
    }
  }
  function line(c, x, y, x2, y2, color, width = 1) {
    c.strokeStyle = color;
    c.lineWidth = width;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x2, y2);
    c.stroke();
  }
  function gradient(c, x, y, w, h, colors) {
    let g = c.createLinearGradient(x, y, x + w, y + h);
    colors.forEach((v, i) => g.addColorStop(i / (colors.length - 1), v));
    return g;
  }
  function shadow(c, x, y, w, h) {
    c.save();
    c.filter = "blur(7px)";
    oval(c, x, y, w, h, "#090b1480");
    c.restore();
  }
  function glow(c, x, y, r, color) {
    let g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "#ffbe6500");
    c.fillStyle = g;
    c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function mug(c, x, y) {
    oval(c, x + 5, y - 3, 4, 4, "#a99770", "#392f29");
    box(
      c,
      x - 5,
      y - 8,
      9,
      12,
      2,
      gradient(c, x - 5, y, 9, 0, ["#906842", "#dac08b", "#6a4734"]),
    );
    oval(c, x - 0.5, y - 8, 4, 2, "#f1ddab");
  }
  function candle(c, x, y) {
    oval(c, x, y + 2, 8, 4, "#bd9153", "#49372c");
    box(c, x - 2, y - 10, 4, 11, 1, "#e6ce94", null);
    oval(c, x, y - 13, 2.5, 4, "#ffdd7c");
    glow(c, x, y - 12, 28, "#ffbd5433");
  }
  function wood(c, x, y, w, h) {
    box(
      c,
      x,
      y,
      w,
      h,
      5,
      gradient(c, x, y, 0, h, ["#b6834d", "#876039", "#62432d"]),
    );
    for (let i = 1; i < 4; i++) {
      let yy = y + (h * i) / 4;
      line(c, x + 5, yy, x + w - 5, yy, "#49312080");
      line(c, x + 8, yy + 1, x + w - 8, yy + 1, "#dfb16c30");
    }
    for (let i = 0; i < 5; i++) {
      c.strokeStyle = "#e4b87525";
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(x + 8, y + 5 + i * 6);
      c.bezierCurveTo(
        x + w * 0.3,
        y + i * 6 - 2,
        x + w * 0.55,
        y + i * 6 + 13,
        x + w - 8,
        y + 7 + i * 6,
      );
      c.stroke();
    }
  }
  function furniture(c, f) {
    let { x, y, w, h, type } = f;
    shadow(c, x + w / 2 + 8, y + h * 0.7 + 13, w * 0.58, h * 0.6);
    for (let xx of [x + 9, x + w - 17]) {
      box(c, xx, y + h - 10, 8, 18, 2, "#392922");
      line(c, xx + 2, y + h - 6, xx + 2, y + h + 6, "#a17144");
    }
    box(c, x, y + 2, w, h, 5, "#402c26");
    wood(c, x, y - 9, w, h);
    if (type === "table") {
      for (let xx of [x + 15, x + w - 27]) {
        box(c, xx, y - 23, 21, 10, 3, "#714632");
        box(c, xx, y + h + 7, 21, 9, 3, "#714632");
      }
      oval(c, x + w * 0.55, y + 11, 12, 7, "#d9c8a0", "#6a513a");
      oval(c, x + w * 0.55, y + 10, 8, 4, "#b69862");
      mug(c, x + 20, y + 14);
      mug(c, x + w - 17, y + 23);
      candle(c, x + w * 0.7, y + 9);
    } else if (type === "bed") {
      box(c, x + 8, y - 4, w - 16, h - 10, 7, "#bc9c78");
      box(
        c,
        x + 34,
        y - 3,
        w - 43,
        h - 12,
        5,
        gradient(c, x, y, w, 0, ["#326e73", "#5b9890", "#28535e"]),
      );
      for (let i = 0; i < 3; i++)
        line(
          c,
          x + 47 + i * 18,
          y + 2,
          x + 42 + i * 18,
          y + h - 20,
          "#a5c3a52b",
          2,
        );
      box(c, x + 9, y, 24, h - 23, 7, "#eddbb5", "#846950");
      line(c, x + 13, y + 3, x + 28, y + 3, "#fff2d0", 2);
    } else if (type === "desk") {
      for (let i = 0; i < 5; i++) {
        box(
          c,
          x + 9 + i * 13,
          y - 4,
          10,
          26,
          2,
          ["#447f77", "#a75d48", "#c19353"][i % 3],
        );
        line(c, x + 12 + i * 13, y + 2, x + 12 + i * 13, y + 17, "#edd6a670");
      }
      box(c, x + w - 48, y + 20, 32, 19, 2, "#ecd5a1", "#72583b", 1);
      for (let j = 0; j < 3; j++)
        line(
          c,
          x + w - 43,
          y + 25 + j * 4,
          x + w - 24,
          y + 25 + j * 4,
          "#8f7858",
        );
      candle(c, x + w - 15, y + 3);
    } else {
      for (let i = 0; i < 5; i++) {
        let yy = y + 15 + i * 27;
        oval(c, x + w * 0.7, yy, 8, 4, "#bea273");
        mug(c, x + w * 0.7, yy);
      }
      line(c, x + w - 9, y + 4, x + w - 9, y + h - 16, "#e6b77460", 3);
    }
  }
  function barrel(c, x, y, tea = false) {
    shadow(c, x + 5, y + 7, 22, 15);
    if (tea) {
      oval(
        c,
        x,
        y,
        20,
        16,
        gradient(c, x - 20, y - 15, 40, 25, ["#c2ba92", "#657c78", "#354750"]),
        "#202d33",
      );
      box(c, x - 7, y - 15, 14, 5, 2, "#bcbb98");
      line(c, x + 14, y - 3, x + 27, y - 7, "#a5b39e", 5);
    } else {
      box(
        c,
        x - 18,
        y - 15,
        36,
        35,
        11,
        gradient(c, x - 18, y, 36, 0, [
          "#483426",
          "#ac7941",
          "#765037",
          "#3d2d27",
        ]),
      );
      for (let xx = -10; xx < 15; xx += 8)
        line(c, x + xx, y - 12, x + xx, y + 16, "#3a29286b");
      for (let yy of [-8, 10])
        box(c, x - 18, y + yy, 36, 4, 2, "#525b57", "#292c2e", 1);
      oval(c, x, y - 14, 17, 7, "#a27843", "#332923");
      oval(c, x, y - 14, 12, 4, "#735431");
    }
    box(c, x + 14, y - 2, 12, 5, 2, "#c9a658");
    oval(c, x + 25, y + 1, 3, 3, "#e7c37f");
  }
  function wall(c, w) {
    shadow(c, w.x + w.w / 2 + 6, w.y + w.h / 2 + 7, w.w / 2 + 8, w.h / 2 + 7);
    box(c, w.x - 2, w.y - 14, w.w + 4, w.h + 15, 3, "#382c29");
    box(
      c,
      w.x - 2,
      w.y - 20,
      w.w + 4,
      w.h + 5,
      3,
      gradient(c, w.x, w.y - 20, 0, w.h + 6, ["#ba8a56", "#765337"]),
    );
    line(c, w.x, w.y - 18, w.x + w.w, w.y - 18, "#e3b979", 2);
    if (w.w > 50)
      for (let x = w.x + 14; x < w.x + w.w; x += 40)
        line(c, x, w.y - 15, x + 12, w.y + w.h - 18, "#543b2e66");
  }
  function makeRoom() {
    let cv = document.createElement("canvas");
    cv.width = 1000;
    cv.height = 660;
    let c = cv.getContext("2d");
    c.fillStyle = gradient(c, 0, 0, 1000, 660, [
      "#142d37",
      "#182431",
      "#101920",
    ]);
    c.fillRect(0, 0, 1000, 660);
    shadow(c, 505, 338, 475, 303);
    box(c, 29, 30, 932, 601, 16, "#222328", "#101721", 4);
    box(c, 43, 44, 902, 572, 8, "#523b2d");
    for (let row = 0; row < 25; row++) {
      let y = 45 + row * 23;
      for (let col = -1; col < 10; col++) {
        let x = 45 + col * 108 + (row % 2) * 54;
        let left = Math.max(45, x),
          right = Math.min(943, x + 107);
        if (right <= left) continue;
        let colors = ["#6d4b34", "#76513a", "#80563a", "#684a37", "#78543a"];
        box(
          c,
          left,
          y,
          right - left,
          22,
          2,
          colors[(row * 7 + col + 10) % 5],
          "#332922",
          0.8,
        );
        line(c, left + 3, y + 2, right - 3, y + 2, "#c99a5c33");
        for (let j = 0; j < 2; j++)
          line(
            c,
            left + 7,
            y + 8 + j * 7,
            Math.min(right - 5, left + 55 + (row % 3) * 10),
            y + 7 + j * 7,
            "#352d282b",
          );
      }
    }
    // Stone floor in the office and worn, woven rugs.
    box(c, 45, 45, 348, 140, 2, "#454c49", null);
    for (let y = 48; y < 180; y += 29)
      for (let x = 48; x < 390; x += 47)
        box(
          c,
          x,
          y,
          43,
          25,
          3,
          (x + y) % 3 ? "#555a50" : "#626354",
          "#353d3c",
          1,
        );
    box(c, 230, 325, 450, 262, 7, "#31282c", "#382329", 3);
    box(c, 235, 330, 440, 252, 4, "#863e3b", "#c18a59", 2);
    box(c, 248, 343, 414, 226, 2, "#65433b", "#d6a36b", 1);
    for (let i = 0; i < 15; i++) {
      let x = 255 + i * 27;
      line(c, x, 334, x + 7, 340, "#e1b77a");
      line(c, x, 575, x + 7, 568, "#e1b77a");
    }
    for (let y = 352; y < 565; y += 9) line(c, 252, y, 658, y, "#d4a3700d");
    box(c, 752, 195, 167, 132, 4, "#254d51", "#bd935a", 2);
    for (let x = 760; x < 916; x += 14) line(c, x, 201, x, 322, "#a9c3a514");
    for (const f of DATA.furniture) furniture(c, f);
    for (const w of DATA.walls) wall(c, w);
    // Stone chimney with a dark firebox and a thick mantel.
    shadow(c, 516, 86, 67, 30);
    box(c, 456, 36, 112, 65, 7, "#6e6b60", "#292c30", 3);
    for (let row = 0; row < 3; row++)
      for (let col = 0; col < 5; col++)
        box(
          c,
          459 + col * 21,
          39 + row * 17,
          19,
          15,
          2,
          ["#8c8975", "#747969", "#a29b80"][(row + col) % 3],
          "#4c504a",
          1,
        );
    box(c, 469, 51, 86, 38, 15, "#252528", "#534d42", 4);
    box(
      c,
      451,
      88,
      124,
      11,
      3,
      gradient(c, 451, 88, 0, 11, ["#bba582", "#6a5d4e"]),
    );
    // Glazed windows and curtains establish thick outer walls.
    for (let x of [400, 605]) {
      box(c, x, 40, 52, 10, 3, "#151f29", "#7d6848");
      box(c, x + 5, 42, 42, 6, 2, "#6a9a9c", null);
      line(c, x + 26, 42, x + 26, 48, "#d3aa71", 3);
    }
    for (let [x, y] of [
      [190, 67],
      [678, 67],
    ]) {
      box(
        c,
        x,
        y,
        15,
        108,
        3,
        gradient(c, x, y, 15, 0, ["#322b29", "#91683e", "#523927"]),
      );
      for (let yy of [y + 8, y + 80])
        box(c, x - 3, yy, 21, 6, 2, "#414b49", "#282d30", 1);
    }
    barrel(c, 77, 255);
    barrel(c, 77, 305);
    barrel(c, 77, 355, true);
    shadow(c, 124, 450, 26, 15);
    box(c, 96, 432, 48, 20, 8, "#3d3e3c");
    oval(
      c,
      120,
      436,
      23,
      17,
      gradient(c, 100, 420, 35, 25, ["#6c7e71", "#303c40"]),
      "#1d272c",
    );
    oval(c, 120, 431, 19, 11, "#c79245", "#1f2a2d", 3);
    for (let i = 0; i < 6; i++)
      oval(
        c,
        108 + i * 4,
        430 + (i % 3),
        2,
        1.5,
        ["#d1b36a", "#63845d", "#b8663e"][i % 3],
      );
    box(c, 95, 75, 35, 53, 5, "#675341", "#322a28");
    box(c, 99, 85, 27, 39, 4, "#397878");
    box(c, 98, 76, 28, 13, 4, "#e6d7b0");
    box(c, 267, 139, 27, 19, 2, "#eed6a6", "#765334", 1);
    line(c, 270, 142, 287, 153, "#a48b65");
    oval(c, 281, 150, 3, 3, "#a04e3b");
    for (const [x, y] of [
      [195, 210],
      [685, 210],
      [905, 375],
      [225, 570],
    ]) {
      line(c, x, y - 20, x, y - 6, "#272c2e", 3);
      box(c, x - 7, y - 10, 14, 19, 4, "#e4a84c", "#3d342c", 3);
      box(c, x - 3, y - 7, 6, 12, 2, "#ffe1a0", null);
      line(c, x - 10, y - 13, x + 10, y - 13, "#ac8456", 3);
    }
    box(c, 444, 609, 94, 16, 3, "#48392c", "#141e25", 3);
    for (let x = 452; x < 535; x += 12) line(c, x, 612, x, 622, "#a77a4d");
    // Edge shade keeps the center inviting without hiding navigable areas.
    let vignette = c.createRadialGradient(500, 335, 180, 500, 335, 570);
    vignette.addColorStop(0, "#0c152000");
    vignette.addColorStop(1, "#0c152065");
    c.fillStyle = vignette;
    c.fillRect(35, 35, 918, 590);
    return cv;
  }
  function room(c, time) {
    if (!roomCache) roomCache = makeRoom();
    c.drawImage(roomCache, 0, 0);
    let t = performance.now() / 1000;
    glow(c, 510, 83, 180, "#ffc05c35");
    for (let [x, y] of [
      [195, 210],
      [685, 210],
      [905, 375],
      [225, 570],
    ])
      glow(c, x, y, 86, "#ffcd6b25");
    for (let i = 0; i < 8; i++) {
      let h = 15 + Math.sin(t * 4 + i * 3) * 5;
      oval(c, 481 + i * 9, 81 - h / 2, 6, h / 2, i % 2 ? "#f5a341" : "#ef6c37");
      oval(c, 482 + i * 9, 82 - h * 0.25, 3, h * 0.25, "#ffe898");
    }
    for (let i = 0; i < 3; i++) {
      let yy = (t * 14 + i * 15) % 48;
      c.strokeStyle =
        "#e8dabb" +
        Math.floor((1 - yy / 48) * 50)
          .toString(16)
          .padStart(2, "0");
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(120 + Math.sin(t + i) * 4, 421 - yy);
      c.quadraticCurveTo(130, 414 - yy, 121, 407 - yy);
      c.stroke();
    }
    if (time > 110) {
      c.fillStyle = "#14203518";
      c.fillRect(44, 44, 900, 571);
    }
  }
  function person(c, n, keeper = false, time = 0) {
    let moving = !!n.path?.length,
      t = performance.now() / 1000,
      step = moving ? Math.sin(t * 11) : 0,
      bob = moving ? Math.abs(step) * 1.8 : Math.sin(t * 1.9 + n.x) * 0.5;
    let x = n.x,
      y = n.y - bob;
    shadow(c, x + 4, y + 8, 18, 7);
    if (keeper) {
      c.strokeStyle = "#f5d38a";
      c.lineWidth = 1.6;
      c.beginPath();
      c.ellipse(x, y + 9, 21, 9, 0, 0, 7);
      c.stroke();
    }
    let broad = n.id === "bram",
      w = broad ? 17 : 13;
    box(c, x - w + 3, y - 1, 9, 13 + step * 3, 4, "#3c3030");
    box(c, x + 3, y - 1, 9, 13 - step * 3, 4, "#3c3030");
    line(
      c,
      x - w + 5,
      y + 10 + step * 3,
      x - w + 10,
      y + 10 + step * 3,
      "#9b7654",
      2,
    );
    line(c, x + 5, y + 10 - step * 3, x + 10, y + 10 - step * 3, "#9b7654", 2);
    box(
      c,
      x - w,
      y - 26,
      w * 2,
      30,
      9,
      gradient(c, x - w, y - 25, w * 2, 18, [n.color, "#303c40"]),
      "#20232a",
      2.3,
    );
    oval(c, x - w, y - 13 + step * 2, 5, 10, n.color, "#26272b");
    oval(c, x + w, y - 13 - step * 2, 5, 10, n.color, "#26272b");
    oval(c, x - w, y - 5 + step * 2, 4, 4, "#c99570");
    oval(c, x + w, y - 5 - step * 2, 4, 4, "#c99570");
    line(c, x - w + 4, y - 17, x + w - 4, y - 17, "#e6d1a542", 2);
    box(c, x - w + 2, y - 1, w * 2 - 4, 5, 1, "#47322b", null);
    box(c, x - 2, y, 5, 4, 1, "#cea15d", null);
    if (keeper) {
      box(
        c,
        x - 9,
        y - 18,
        18,
        22,
        3,
        gradient(c, x, y - 18, 0, 22, ["#e4d3a6", "#ab916c"]),
        "#65573e",
        1,
      );
      line(c, x - 9, y - 17, x + 10, y - 3, "#85724d", 1);
    }
    // Larger, shaded heads, ears, brows and noses replace the flat pawn shapes.
    oval(c, x - 11, y - 33, 4, 5, "#bd845f", "#3b2b29");
    oval(c, x + 11, y - 33, 4, 5, "#bd845f", "#3b2b29");
    oval(
      c,
      x,
      y - 34,
      12,
      14,
      gradient(c, x - 10, y - 45, 20, 20, ["#efc99a", "#d9a276", "#a66c55"]),
      "#352b2d",
    );
    let hair = n.hair || "#493633";
    oval(c, x - 1, y - 44, 12, 7, hair, "#2c292c");
    oval(c, x - 9, y - 38, 4, 7, hair);
    line(c, x - 5, y - 34, x - 2, y - 34, "#4a3430", 2);
    line(c, x + 4, y - 34, x + 7, y - 34, "#4a3430", 2);
    oval(c, x - 3, y - 31, 1.3, 1.8, "#242932");
    oval(c, x + 5, y - 31, 1.3, 1.8, "#242932");
    oval(c, x + 1, y - 27, 3, 2, "#bc805e");
    line(c, x - 2, y - 23, x + 4, y - 23, "#774c42", 1);
    if (broad) {
      oval(
        c,
        x,
        y - 21,
        11,
        10,
        gradient(c, x - 10, y - 25, 18, 12, ["#d5c9a9", "#9d9787"]),
        "#514b46",
      );
      for (let i = -6; i <= 6; i += 4)
        line(c, x + i, y - 22, x + i * 0.8, y - 14, "#6e716a", 1);
      oval(c, x + 1, y - 28, 4, 3, "#d59c76");
    }
    if (n.id === "mira") {
      c.strokeStyle = "#394d49";
      c.lineWidth = 5;
      c.beginPath();
      c.arc(x, y - 37, 16, Math.PI, Math.PI * 2);
      c.stroke();
      line(c, x - 13, y - 39, x - 12, y - 23, "#455f54", 5);
    }
    if (n.id === "nell") {
      oval(c, x + 13, y - 38, 6, 8, hair, "#44312c");
      box(c, x - 13, y - 40, 25, 4, 2, "#c8d7b0", null);
    }
    if (n.id === "tomas") {
      box(
        c,
        x - 13,
        y - 48,
        26,
        9,
        5,
        gradient(c, x, y - 48, 0, 9, ["#b7c8b9", "#607c80"]),
      );
      line(c, x - 14, y - 39, x + 14, y - 39, "#d9d5b8", 3);
      box(c, x - 8, y - 15, 16, 11, 3, "#81999b", "#374c57", 1);
      line(c, x - 6, y - 12, x + 6, y - 12, "#d9d5b8");
    }
    if (n.id === "ivo") {
      c.fillStyle = gradient(c, x - 15, y - 66, 25, 30, ["#c1a2cc", "#645689"]);
      c.strokeStyle = "#302d44";
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(x - 13, y - 43);
      c.quadraticCurveTo(x - 8, y - 72, x + 9, y - 65);
      c.lineTo(x + 14, y - 43);
      c.closePath();
      c.fill();
      c.stroke();
      oval(c, x, y - 43, 18, 4, "#85739f", "#322d43");
      oval(c, x + 3, y - 55, 2, 2, "#f0d89e");
    }
    if (n.id === "aldous") {
      box(c, x - 3, y - 15, 6, 11, 2, "#c7ad68", "#5b573b", 1);
      line(c, x - 7, y - 12, x + 7, y - 12, "#c7ad68", 2);
    }
    if (n.id === "oren") {
      line(c, x - 8, y - 25, x + 8, y - 25, "#69503d", 3);
      oval(c, x + 13, y - 27, 2, 3, "#ebc474");
    }
    if (n.served || (keeper && n.carry))
      mug(c, x + w + 4, y - 9 + Math.sin(t * 1.5) * 0.7);
  }
  return { room, person };
})();
