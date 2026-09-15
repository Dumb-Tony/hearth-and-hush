// Optional synthesized ambience; no downloads and no essential audio information.
let ambienceContext = null;
function toggleAmbience() {
  if (ambienceContext) {
    const playing = ambienceContext.state === "running";
    playing ? ambienceContext.suspend() : ambienceContext.resume();
    $("sound").textContent = playing ? "Sound off" : "Sound on";
    return;
  }
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return;
  ambienceContext = new Audio();
  const ac = ambienceContext,
    buffer = ac.createBuffer(1, ac.sampleRate * 5, ac.sampleRate),
    data = buffer.getChannelData(0);
  let lastNoise = 0;
  for (let i = 0; i < data.length; i++) {
    lastNoise = (lastNoise + Math.random() * 0.035 - 0.0175) / 1.015;
    data[i] = lastNoise;
  }
  const noise = ac.createBufferSource(),
    filter = ac.createBiquadFilter(),
    gain = ac.createGain();
  noise.buffer = buffer;
  noise.loop = true;
  filter.type = "lowpass";
  filter.frequency.value = 950;
  gain.gain.value = 0.23;
  noise.connect(filter).connect(gain).connect(ac.destination);
  noise.start();
  for (let frequency of [146.83, 220, 293.66]) {
    const tone = ac.createOscillator(),
      volume = ac.createGain();
    tone.type = "sine";
    tone.frequency.value = frequency;
    volume.gain.value = 0.006;
    tone.connect(volume).connect(ac.destination);
    tone.start();
  }
  $("sound").textContent = "Sound on";
}
