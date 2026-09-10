/* =========================================================
   AV JUNKI RADIO
   radio.js

   Broadcast player foundation
   Web Audio processing
   Spectrum
   Analog VU
   Compressor GR
   DSP status
========================================================= */

"use strict";


document.addEventListener("DOMContentLoaded", () => {


  /* =======================================================
     DOM
  ======================================================= */

  const audio =
    document.getElementById("radio-audio");

  const playPause =
    document.getElementById("play-pause");

  const previousTrack =
    document.getElementById("previous-track");

  const nextTrack =
    document.getElementById("next-track");

  const volumeSlider =
    document.getElementById("volume-slider");

  const trackTitle =
    document.getElementById("player-track-title");

  const trackArtist =
    document.getElementById("player-artist");

  const radioStatus =
    document.getElementById("radio-status");

  const screenContent =
    document.getElementById("screen-content");

  const screenButtons =
    document.querySelectorAll("[data-screen]");

  const panelButtons =
    document.querySelectorAll(".panel-hotspot");

  const spectrumCanvas =
    document.getElementById("spectrum-canvas");

  const vuNeedle =
    document.getElementById("vu-needle");

  const grFill =
    document.getElementById("gr-fill");

  const grValue =
    document.getElementById("gr-value");

  const dspStatus =
    document.getElementById("dsp-status");


  /* =======================================================
     AUDIO ENGINE VARIABLES
  ======================================================= */

  let audioContext = null;

  let mediaSource = null;

  let inputGain = null;

  let lowShelf = null;

  let presenceEQ = null;

  let compressor = null;

  let limiter = null;

  let analyser = null;

  let masterGain = null;

  let audioGraphReady = false;

  let currentPreset = "music";


  /* =======================================================
     INITIAL VOLUME
  ======================================================= */

  if (volumeSlider) {

    volumeSlider.value = 80;

  }


  /* =======================================================
     BUILD WEB AUDIO GRAPH
  ======================================================= */

  function buildAudioGraph() {

    if (
      audioGraphReady ||
      !audio
    ) {
      return;
    }


    const AudioContextClass =
      window.AudioContext ||
      window.webkitAudioContext;


    if (!AudioContextClass) {

      setStatus(
        "Web Audio is not supported in this browser."
      );

      return;

    }


    audioContext =
      new AudioContextClass();


    mediaSource =
      audioContext.createMediaElementSource(audio);


    inputGain =
      audioContext.createGain();


    lowShelf =
      audioContext.createBiquadFilter();

    lowShelf.type =
      "lowshelf";

    lowShelf.frequency.value =
      120;


    presenceEQ =
      audioContext.createBiquadFilter();

    presenceEQ.type =
      "peaking";

    presenceEQ.frequency.value =
      3200;

    presenceEQ.Q.value =
      0.8;


    compressor =
      audioContext.createDynamicsCompressor();


    limiter =
      audioContext.createDynamicsCompressor();

    limiter.threshold.value =
      -1.0;

    limiter.knee.value =
      0;

    limiter.ratio.value =
      20;

    limiter.attack.value =
      0.002;

    limiter.release.value =
      0.08;


    analyser =
      audioContext.createAnalyser();

    analyser.fftSize =
      256;

    analyser.smoothingTimeConstant =
      0.78;


    masterGain =
      audioContext.createGain();

    masterGain.gain.value =
      0.8;


    mediaSource
      .connect(inputGain);

    inputGain
      .connect(lowShelf);

    lowShelf
      .connect(presenceEQ);

    presenceEQ
      .connect(compressor);

    compressor
      .connect(limiter);

    limiter
      .connect(analyser);

    analyser
      .connect(masterGain);

    masterGain
      .connect(audioContext.destination);


    audioGraphReady =
      true;


    applyPreset(
      currentPreset
    );


    updateVolume();


    if (dspStatus) {

      dspStatus.classList.add(
        "active"
      );

    }


    startMeters();

  }


  /* =======================================================
     AUDIO PRESETS
  ======================================================= */

  function applyPreset(preset) {

    currentPreset =
      preset;


    if (
      !audioGraphReady ||
      !inputGain ||
      !lowShelf ||
      !presenceEQ ||
      !compressor
    ) {
      return;
    }


    /* ==========================================
       MUSIC

       Beefy FM-style starting point.
       Keeps low end alive for reggae / R&B.
    ========================================== */

    if (preset === "music") {

      inputGain.gain.value =
        1.0;

      lowShelf.gain.value =
        2.0;

      presenceEQ.gain.value =
        1.0;

      compressor.threshold.value =
        -16;

      compressor.knee.value =
        8;

      compressor.ratio.value =
        3;

      compressor.attack.value =
        0.018;

      compressor.release.value =
        0.18;

    }


    /* ==========================================
       PODCAST

       Close, controlled radio voice.
    ========================================== */

    else if (preset === "podcast") {

      inputGain.gain.value =
        1.08;

      lowShelf.gain.value =
        1.5;

      presenceEQ.gain.value =
        2.5;

      compressor.threshold.value =
        -20;

      compressor.knee.value =
        8;

      compressor.ratio.value =
        4;

      compressor.attack.value =
        0.008;

      compressor.release.value =
        0.16;

    }


    /* ==========================================
       LIVE

       Safer transient protection.
    ========================================== */

    else if (preset === "live") {

      inputGain.gain.value =
        0.92;

      lowShelf.gain.value =
        0.5;

      presenceEQ.gain.value =
        1.0;

      compressor.threshold.value =
        -18;

      compressor.knee.value =
        10;

      compressor.ratio.value =
        3.5;

      compressor.attack.value =
        0.006;

      compressor.release.value =
        0.12;

    }


    setStatus(
      `${formatLabel(preset)} processing active`
    );

  }


  /* =======================================================
     VOLUME
  ======================================================= */

  function updateVolume() {

    if (
      !masterGain ||
      !volumeSlider
    ) {
      return;
    }


    const value =
      Number(volumeSlider.value) / 100;


    masterGain.gain.value =
      value;

  }


  if (volumeSlider) {

    volumeSlider.addEventListener(
      "input",
      updateVolume
    );

  }


  /* =======================================================
     PLAY / PAUSE
  ======================================================= */

  if (
    audio &&
    playPause
  ) {

    playPause.addEventListener(
      "click",
      async () => {


        buildAudioGraph();


        if (
          audioContext &&
          audioContext.state === "suspended"
        ) {

          await audioContext.resume();

        }


        if (!audio.src) {

          setStatus(
            "No audio source connected yet."
          );

          return;

        }


        try {


          if (audio.paused) {

            await audio.play();

          }

          else {

            audio.pause();

          }


        }

        catch (error) {

          console.error(
            error
          );

          setStatus(
            "Unable to start audio."
          );

        }


      }
    );


    audio.addEventListener(
      "play",
      () => {

        playPause.textContent =
          "❚❚";

        playPause.setAttribute(
          "aria-label",
          "Pause"
        );

      }
    );


    audio.addEventListener(
      "pause",
      () => {

        playPause.textContent =
          "▶";

        playPause.setAttribute(
          "aria-label",
          "Play"
        );

      }
    );

  }


  /* =======================================================
     PREVIOUS / NEXT PLACEHOLDERS
  ======================================================= */

  if (previousTrack) {

    previousTrack.addEventListener(
      "click",
      () => {

        setStatus(
          "Previous track hook ready."
        );

      }
    );

  }


  if (nextTrack) {

    nextTrack.addEventListener(
      "click",
      () => {

        setStatus(
          "Next track hook ready."
        );

      }
    );

  }


  /* =======================================================
     NAVIGATION
  ======================================================= */

  screenButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const screen =
            button.dataset.screen || "";


          if (screenContent) {

            screenContent.dataset.activeScreen =
              screen;

          }


          setStatus(
            formatLabel(screen)
          );

        }
      );

    }
  );


  /* =======================================================
     SIDE CHANNEL HOTSPOTS
  ======================================================= */

  panelButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const channel =
            button.dataset.channel || "";

          const preset =
            button.dataset.preset || "music";


          buildAudioGraph();

          applyPreset(
            preset
          );


          setStatus(
            formatLabel(channel)
          );

        }
      );

    }
  );


  /* =======================================================
     SPECTRUM + VU + GR METERS
  ======================================================= */

  function startMeters() {

    if (
      !analyser ||
      !spectrumCanvas
    ) {
      return;
    }


    const context =
      spectrumCanvas.getContext("2d");


    const frequencyData =
      new Uint8Array(
        analyser.frequencyBinCount
      );


    const timeData =
      new Uint8Array(
        analyser.fftSize
      );


    function draw() {

      window.requestAnimationFrame(
        draw
      );


      resizeCanvas(
        spectrumCanvas
      );


      analyser.getByteFrequencyData(
        frequencyData
      );


      analyser.getByteTimeDomainData(
        timeData
      );


      drawSpectrum(
        context,
        spectrumCanvas,
        frequencyData
      );


      updateVU(
        timeData
      );


      updateGainReduction();

    }


    draw();

  }


  /* =======================================================
     CANVAS SIZE
  ======================================================= */

  function resizeCanvas(canvas) {

    const width =
      canvas.clientWidth;

    const height =
      canvas.clientHeight;


    if (
      canvas.width !== width ||
      canvas.height !== height
    ) {

      canvas.width =
        width;

      canvas.height =
        height;

    }

  }


  /* =======================================================
     DRAW SPECTRUM
  ======================================================= */

  function drawSpectrum(
    context,
    canvas,
    data
  ) {

    const width =
      canvas.width;

    const height =
      canvas.height;


    context.clearRect(
      0,
      0,
      width,
      height
    );


    const barCount =
      42;


    const step =
      Math.max(
        1,
        Math.floor(
          data.length / barCount
        )
      );


    const gap =
      2;


    const barWidth =
      Math.max(
        1,
        (width / barCount) - gap
      );


    for (
      let i = 0;
      i < barCount;
      i++
    ) {

      const value =
        data[i * step] / 255;


      const barHeight =
        Math.max(
          2,
          value * height
        );


      const x =
        i *
        (barWidth + gap);


      const y =
        height - barHeight;


      const gradient =
        context.createLinearGradient(
          0,
          height,
          0,
          0
        );


      gradient.addColorStop(
        0,
        "rgba(45, 190, 255, 0.88)"
      );

      gradient.addColorStop(
        0.5,
        "rgba(155, 90, 255, 0.9)"
      );

      gradient.addColorStop(
        0.82,
        "rgba(255, 175, 60, 0.95)"
      );

      gradient.addColorStop(
        1,
        "rgba(255, 70, 65, 0.95)"
      );


      context.fillStyle =
        gradient;


      context.fillRect(
        x,
        y,
        barWidth,
        barHeight
      );

    }

  }


  /* =======================================================
     ANALOG VU

     RMS-driven needle.
  ======================================================= */

  function updateVU(data) {

    if (!vuNeedle) {
      return;
    }


    let sum =
      0;


    for (
      let i = 0;
      i < data.length;
      i++
    ) {

      const normalized =
        (data[i] - 128) / 128;


      sum +=
        normalized * normalized;

    }


    const rms =
      Math.sqrt(
        sum / data.length
      );


    const db =
      rms > 0
        ? 20 * Math.log10(rms)
        : -60;


    const clampedDb =
      Math.max(
        -30,
        Math.min(
          3,
          db
        )
      );


    const normalized =
      (clampedDb + 30) / 33;


    const angle =
      -42 +
      (normalized * 84);


    vuNeedle.style.transform =
      `translateX(-50%) rotate(${angle}deg)`;

  }


  /* =======================================================
     COMPRESSOR GAIN REDUCTION
  ======================================================= */

  function updateGainReduction() {

    if (
      !compressor ||
      !grFill ||
      !grValue
    ) {
      return;
    }


    const reduction =
      Math.abs(
        compressor.reduction || 0
      );


    const clamped =
      Math.min(
        reduction,
        12
      );


    const percent =
      (clamped / 12) * 100;


    grFill.style.height =
      `${percent}%`;


    grValue.textContent =
      `${reduction.toFixed(1)} dB`;

  }


  /* =======================================================
     TRACK INFO HELPER
  ======================================================= */

  window.setRadioTrack =
    function ({
      title = "AV Junki Radio",
      artist = "Music Lives Here",
      artwork = "",
      src = "",
      preset = "music"
    } = {}) {


      if (trackTitle) {

        trackTitle.textContent =
          title;

      }


      if (trackArtist) {

        trackArtist.textContent =
          artist;

      }


      const albumArt =
        document.getElementById(
          "player-album-art"
        );


      if (
        albumArt &&
        artwork
      ) {

        albumArt.style.backgroundImage =
          `url("${artwork}")`;

      }


      if (
        audio &&
        src
      ) {

        audio.src =
          src;

        audio.load();

      }


      currentPreset =
        preset;


      if (audioGraphReady) {

        applyPreset(
          preset
        );

      }

    };


  /* =======================================================
     STATUS
  ======================================================= */

  let statusTimer =
    null;


  function setStatus(message) {

    if (!radioStatus) {
      return;
    }


    radioStatus.textContent =
      message;


    window.clearTimeout(
      statusTimer
    );


    statusTimer =
      window.setTimeout(
        () => {

          radioStatus.textContent =
            "";

        },
        2200
      );

  }


  /* =======================================================
     LABEL FORMATTER
  ======================================================= */

  function formatLabel(value) {

    return String(value)
      .split("-")
      .map(
        (part) => {

          return (
            part.charAt(0).toUpperCase() +
            part.slice(1)
          );

        }
      )
      .join(" ");

  }


});
