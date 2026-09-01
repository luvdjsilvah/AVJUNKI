document.addEventListener("DOMContentLoaded", () => {
  const screenVideo = document.getElementById("dj-screen-video");

  if (!screenVideo) return;

  screenVideo.muted = true;

  const tryPlay = () => {
    const playPromise = screenVideo.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  };

  tryPlay();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      screenVideo.pause();
    } else {
      tryPlay();
    }
  });
});
/* Reveal mixer only after hero image is ready */
document.addEventListener("DOMContentLoaded", () => {
  const heroImage = document.querySelector(".dj-master");

  const revealMixer = () => {
    document.body.classList.add("dj-mixer-ready");
  };

  if (!heroImage) {
    revealMixer();
    return;
  }

  if (heroImage.complete && heroImage.naturalWidth > 0) {
    revealMixer();
  } else {
    heroImage.addEventListener("load", revealMixer, { once: true });
    heroImage.addEventListener("error", revealMixer, { once: true });
  }
});
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("pageshow", () => {
  if (
    window.matchMedia("(max-width: 760px)").matches &&
    !window.location.hash
  ) {
    window.scrollTo(0, 0);
  }
});
/* =========================================================
   DJ MIX SAMPLE PLAYER
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const trackControls =
    document.querySelectorAll("[data-track]");

  const faderChannels =
    document.querySelectorAll(".dj-fader-channel");

  const speakerTracks =
    document.querySelectorAll(".dj-speaker-track");

  const nowPlaying =
    document.getElementById("dj-now-playing");

  const trackTime =
    document.getElementById("dj-track-time");

  const masterVolume =
    document.getElementById("dj-master-volume");


  const audioTracks = [
    document.getElementById("dj-audio-1"),
    document.getElementById("dj-audio-2"),
    document.getElementById("dj-audio-3"),
    document.getElementById("dj-audio-4"),
    document.getElementById("dj-audio-5"),
    document.getElementById("dj-audio-6")
  ];


  let activeTrack = null;


  function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
      return "0:00";
    }

    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  }


  function clearActiveState() {

    faderChannels.forEach((fader) => {
      fader.classList.remove("is-active");
    });

    speakerTracks.forEach((speaker) => {
      speaker.classList.remove("is-active");
    });
  }


  function setActiveState(trackNumber) {

    clearActiveState();

    const activeFader =
      document.querySelector(
        `.dj-fader-channel[data-track="${trackNumber}"]`
      );

    const activeSpeaker =
      document.querySelector(
        `.dj-speaker-track[data-track="${trackNumber}"]`
      );

    if (activeFader) {
      activeFader.classList.add("is-active");
    }

    if (activeSpeaker) {
      activeSpeaker.classList.add("is-active");
    }
  }


  function stopOtherTracks(trackNumber) {

    audioTracks.forEach((audio, index) => {

      if (!audio) return;

      if (index + 1 !== trackNumber) {

        audio.pause();
        audio.currentTime = 0;
      }

    });
  }


  function resetDisplay() {

    activeTrack = null;

    clearActiveState();

    if (nowPlaying) {
     nowPlaying.textContent = "CLICK FADER 1–6";
    }

    if (trackTime) {
      trackTime.textContent = "0:00 / 0:00";
    }
  }


  function playTrack(trackNumber) {

    const audio =
      audioTracks[trackNumber - 1];

    if (!audio) return;


    /*
       Clicking the currently playing
       track pauses it.
    */

    if (
      activeTrack === trackNumber &&
      !audio.paused
    ) {

      audio.pause();

      clearActiveState();

      if (nowPlaying) {
        nowPlaying.textContent =
          `TRACK ${trackNumber} — PAUSED`;
      }

      return;
    }


    /*
       Clicking the paused active track
       resumes it.
    */

    if (
      activeTrack === trackNumber &&
      audio.paused &&
      audio.currentTime > 0
    ) {

      audio.play().catch(() => {});

      setActiveState(trackNumber);

      if (nowPlaying) {
        nowPlaying.textContent =
          `TRACK ${trackNumber} — PLAYING`;
      }

      return;
    }


    /*
       Start a new track.
    */
if (
  trackNumber === 6 &&
  audio.dataset.explicitApproved !== "yes"
) {
  window.djExplicitGate.request(() => {
    audio.dataset.explicitApproved = "yes";
    playTrack(trackNumber);
  });

  return;
}

if (trackNumber === 6) {
  audio.dataset.explicitApproved = "";
}
    stopOtherTracks(trackNumber);

    activeTrack = trackNumber;

    audio.currentTime = 0;

    audio.play().catch(() => {});

    setActiveState(trackNumber);

    if (nowPlaying) {
      nowPlaying.textContent =
        `TRACK ${trackNumber} — PLAYING`;
    }
  }


  /*
     FADERS + SPEAKER BUTTONS
  */

  trackControls.forEach((control) => {

    control.addEventListener("click", () => {

      const trackNumber =
        Number(control.dataset.track);

      if (
        trackNumber >= 1 &&
        trackNumber <= 6
      ) {

        playTrack(trackNumber);
      }

    });

  });



   /*
     MASTER VOLUME
  */

  if (masterVolume) {
    masterVolume.addEventListener("input", () => {
      const volume = Number(masterVolume.value);

      window.dispatchEvent(
        new CustomEvent("dj-master-volume-change", {
          detail: volume
        })
      );
    });
  }

  /*
     LCD TIMER
  */

  audioTracks.forEach((audio, index) => {

    if (!audio) return;

    const trackNumber = index + 1;


    audio.addEventListener(
      "loadedmetadata",
      () => {

        if (
          activeTrack === trackNumber &&
          trackTime
        ) {

          trackTime.textContent =
            `0:00 / ${formatTime(audio.duration)}`;
        }

      }
    );


    audio.addEventListener(
      "timeupdate",
      () => {

        if (
          activeTrack !== trackNumber ||
          !trackTime
        ) {
          return;
        }

        trackTime.textContent =
          `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;

      }
    );


    audio.addEventListener(
      "ended",
      () => {

        if (activeTrack === trackNumber) {
          resetDisplay();
        }

      }
    );

  });

});
/* =========================================================
   LIVE DJ VU METER
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("dj-vu-meter");

  if (!canvas) return;

  const meterContext = canvas.getContext("2d");

  const sampleAudios = [
    document.getElementById("dj-audio-1"),
    document.getElementById("dj-audio-2"),
    document.getElementById("dj-audio-3"),
    document.getElementById("dj-audio-4"),
    document.getElementById("dj-audio-5"),
    document.getElementById("dj-audio-6")
  ].filter(Boolean);

  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext;

  let audioContext = null;
  let mixBus = null;
  let splitter = null;
  let analyserLeft = null;
  let analyserRight = null;
  let leftData = null;
  let rightData = null;
  let graphReady = false;

  let leftLevel = 0;
  let rightLevel = 0;

  function setupAudioGraph() {
    if (
      graphReady ||
      !AudioContextClass ||
      !sampleAudios.length
    ) {
      return;
    }

    audioContext = new AudioContextClass();

mixBus = audioContext.createGain();

const masterVolumeControl =
  document.getElementById("dj-master-volume");

if (masterVolumeControl) {
  mixBus.gain.value =
    Number(masterVolumeControl.value);
}

splitter = audioContext.createChannelSplitter(2);

    analyserLeft = audioContext.createAnalyser();
    analyserRight = audioContext.createAnalyser();

    analyserLeft.fftSize = 256;
    analyserRight.fftSize = 256;

    analyserLeft.smoothingTimeConstant = 0.75;
    analyserRight.smoothingTimeConstant = 0.75;

    sampleAudios.forEach((audio) => {
      const source =
        audioContext.createMediaElementSource(audio);

      source.connect(mixBus);
    });

    /* Normal audio output */
    mixBus.connect(audioContext.destination);

    /* Meter analysis path */
    mixBus.connect(splitter);

    splitter.connect(analyserLeft, 0, 0);
    splitter.connect(analyserRight, 1, 0);

    leftData =
      new Uint8Array(analyserLeft.fftSize);

    rightData =
      new Uint8Array(analyserRight.fftSize);

    graphReady = true;
  }
window.addEventListener(
  "dj-master-volume-change",
  (event) => {
    if (!mixBus || !audioContext) return;

    mixBus.gain.setTargetAtTime(
      event.detail,
      audioContext.currentTime,
      0.01
    );
  }
);
  function wakeAudioMeter() {
    setupAudioGraph();

    if (
      audioContext &&
      audioContext.state === "suspended"
    ) {
      audioContext.resume().catch(() => {});
    }
  }

  /* Start Web Audio before a fader/speaker click */
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (
        event.target.closest(
          "[data-track], #dj-master-volume"
        )
      ) {
        wakeAudioMeter();
      }
    },
    true
  );

  sampleAudios.forEach((audio) => {
    audio.addEventListener(
      "play",
      wakeAudioMeter
    );
  });

  function getLevel(analyser, data) {
    if (!analyser || !data) return 0;

    analyser.getByteTimeDomainData(data);

    let sum = 0;

    for (let i = 0; i < data.length; i++) {
      const sample =
        (data[i] - 128) / 128;

      sum += sample * sample;
    }

    const rms =
      Math.sqrt(sum / data.length);

    return Math.min(1, rms * 3.6);
  }

  function resizeMeter() {
    const rect =
      canvas.getBoundingClientRect();

    const ratio =
      window.devicePixelRatio || 1;

    canvas.width =
      Math.max(1, Math.round(rect.width * ratio));

    canvas.height =
      Math.max(1, Math.round(rect.height * ratio));

    meterContext.setTransform(
      ratio,
      0,
      0,
      ratio,
      0,
      0
    );
  }

  window.addEventListener(
    "resize",
    resizeMeter
  );

  resizeMeter();

  function drawMeterRow(
    level,
    y,
    width,
    height,
    label
  ) {
    const segmentCount = 10;

    const labelWidth = width * 0.13;
    const rightPadding = width * 0.05;

    const meterWidth =
      width -
      labelWidth -
      rightPadding;

    const gap =
      Math.max(1, width * 0.008);

    const segmentWidth =
      (
        meterWidth -
        gap * (segmentCount - 1)
      ) / segmentCount;

    const activeSegments =
      Math.round(level * segmentCount);

    meterContext.font =
      `${Math.max(6, height * 0.22)}px Montserrat, Arial`;

    meterContext.textAlign = "center";
    meterContext.textBaseline = "middle";
    meterContext.fillStyle = "#ffffff";

    meterContext.fillText(
      label,
      labelWidth * 0.45,
      y + height / 2
    );

    for (
      let index = 0;
      index < segmentCount;
      index++
    ) {
      const x =
        labelWidth +
        index *
          (segmentWidth + gap);

      if (index < activeSegments) {
        if (index >= 9) {
          meterContext.fillStyle =
            "#ff3b30";
        } else if (index >= 7) {
          meterContext.fillStyle =
            "#ffd54d";
        } else {
          meterContext.fillStyle =
            "#9cff00";
        }
      } else {
        meterContext.fillStyle =
          "rgba(255,255,255,.10)";
      }

      meterContext.fillRect(
        x,
        y,
        segmentWidth,
        height
      );
    }
  }

  function drawVuMeter() {
    requestAnimationFrame(drawVuMeter);

    const width =
      canvas.clientWidth;

    const height =
      canvas.clientHeight;

    if (!width || !height) return;

    meterContext.clearRect(
      0,
      0,
      width,
      height
    );

    const newLeft =
      getLevel(
        analyserLeft,
        leftData
      );

    const newRight =
      getLevel(
        analyserRight,
        rightData
      );

    /* Fast rise / slower fall */
    leftLevel =
      newLeft > leftLevel
        ? newLeft
        : leftLevel * 0.86;

    rightLevel =
      newRight > rightLevel
        ? newRight
        : rightLevel * 0.86;

    const rowHeight =
      height * 0.25;

    drawMeterRow(
      leftLevel,
      height * 0.18,
      width,
      rowHeight,
      "L"
    );

    drawMeterRow(
      rightLevel,
      height * 0.57,
      width,
      rowHeight,
      "R"
    );
  }

  drawVuMeter();
});
/* =========================================================
   MOBILE DJ MIX PLAYER
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const mobilePlayer =
    document.getElementById("dj-mobile-player");

  if (!mobilePlayer) return;


  const trackButtons =
    mobilePlayer.querySelectorAll("[data-mobile-track]");

  const playPauseButton =
    document.getElementById("dj-mobile-play-pause");

  const shuffleButton =
    document.getElementById("dj-mobile-shuffle");

  const repeatButton =
    document.getElementById("dj-mobile-repeat");

  const nowPlaying =
    document.getElementById("dj-mobile-now-playing");

  const trackTime =
    document.getElementById("dj-mobile-track-time");

  const progressControl =
    document.getElementById("dj-mobile-progress");

  const volumeControl =
    document.getElementById("dj-mobile-volume");

  const desktopVolume =
    document.getElementById("dj-master-volume");

  const mobileLcdText =
    document.getElementById("dj-mobile-lcd-text");


  const audioTracks = [
    document.getElementById("dj-audio-1"),
    document.getElementById("dj-audio-2"),
    document.getElementById("dj-audio-3"),
    document.getElementById("dj-audio-4"),
    document.getElementById("dj-audio-5"),
    document.getElementById("dj-audio-6")
  ];


let activeTrack = null;
let activeTrackNumber = null;

  let shuffleEnabled = false;
  let repeatEnabled = false;


  function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
      return "0:00";
    }

    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  }


  function clearButtons() {

    trackButtons.forEach((button) => {
      button.classList.remove("is-active");
    });
  }


  function setActiveButton(trackNumber) {

    clearButtons();

    const button =
      mobilePlayer.querySelector(
        `[data-mobile-track="${trackNumber}"]`
      );

    if (button) {
      button.classList.add("is-active");
    }
  }


  function stopOtherTracks(trackNumber) {

    audioTracks.forEach((audio, index) => {

      if (!audio) return;

      if (index + 1 !== trackNumber) {
        audio.pause();
        audio.currentTime = 0;
      }

    });
  }


  function startTrack(trackNumber) {

    const audio =
      audioTracks[trackNumber - 1];

    if (!audio) return;


    /* TRACK 6 EXPLICIT WARNING */

    if (
      trackNumber === 6 &&
      audio.dataset.explicitApproved !== "yes"
    ) {

      window.djExplicitGate.request(() => {

        audio.dataset.explicitApproved = "yes";

        startTrack(trackNumber);

      });

      return;
    }


    if (trackNumber === 6) {
      audio.dataset.explicitApproved = "";
    }


    stopOtherTracks(trackNumber);

    activeTrack = audio;
    activeTrackNumber = trackNumber;

    audio.loop = repeatEnabled;
    audio.currentTime = 0;

    setActiveButton(trackNumber);


    if (progressControl) {
      progressControl.value = 0;
    }


    if (nowPlaying) {
      nowPlaying.textContent =
        `TRACK ${trackNumber} — PLAYING`;
    }


    if (mobileLcdText) {
      mobileLcdText.textContent =
        `TRACK ${trackNumber} PLAYING`;
    }


    audio.play().catch(() => {});

  }


  /* TRACK BUTTONS */

  trackButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const trackNumber =
        Number(button.dataset.mobileTrack);

      if (
        trackNumber >= 1 &&
        trackNumber <= 6
      ) {
        startTrack(trackNumber);
      }

    });

  });


  /* PLAY / PAUSE */

  if (playPauseButton) {

    playPauseButton.addEventListener("click", () => {

    if (!activeTrack) {
  startTrack(1);
  return;
}


      if (activeTrack.paused) {

        activeTrack.play().catch(() => {});


        if (nowPlaying) {
          nowPlaying.textContent =
            `TRACK ${activeTrackNumber} — PLAYING`;
        }


        if (mobileLcdText) {
          mobileLcdText.textContent =
            `TRACK ${activeTrackNumber} PLAYING`;
        }


      } else {

        activeTrack.pause();


        if (nowPlaying) {
          nowPlaying.textContent =
            `TRACK ${activeTrackNumber} — PAUSED`;
        }


        if (mobileLcdText) {
          mobileLcdText.textContent =
            `TRACK ${activeTrackNumber} PAUSED`;
        }

      }

    });

  }


/* MOBILE TRANSPORT CONTROLS */

const prevButton =
  document.getElementById("dj-mobile-prev");

const nextButton =
  document.getElementById("dj-mobile-next");


function getRandomTrackNumber(excludeTrack) {

  const availableTracks =
    [1, 2, 3, 4, 5, 6].filter(
      (number) => number !== excludeTrack
    );

  return availableTracks[
    Math.floor(
      Math.random() * availableTracks.length
    )
  ];
}


/* PREVIOUS */

if (prevButton) {

  prevButton.addEventListener("click", () => {

    let previousTrack =
      activeTrackNumber
        ? activeTrackNumber - 1
        : 1;

    if (previousTrack < 1) {
      previousTrack = 6;
    }

    startTrack(previousTrack);

  });

}


/* NEXT */

if (nextButton) {

  nextButton.addEventListener("click", () => {

    let nextTrack =
      activeTrackNumber
        ? activeTrackNumber + 1
        : 1;

    if (nextTrack > 6) {
      nextTrack = 1;
    }

    startTrack(nextTrack);

  });

}


/* SHUFFLE */

if (shuffleButton) {

  shuffleButton.setAttribute(
    "aria-pressed",
    "false"
  );

  shuffleButton.addEventListener("click", () => {

    shuffleEnabled = !shuffleEnabled;

    shuffleButton.classList.toggle(
      "is-on",
      shuffleEnabled
    );

    shuffleButton.setAttribute(
      "aria-pressed",
      String(shuffleEnabled)
    );

    /* Immediately jump to a random track */
    if (shuffleEnabled) {

      const randomTrack =
        getRandomTrackNumber(
          activeTrackNumber
        );

      startTrack(randomTrack);
    }

  });

}


/* REPEAT */

if (repeatButton) {

  repeatButton.setAttribute(
    "aria-pressed",
    "false"
  );

  repeatButton.addEventListener("click", () => {

    repeatEnabled = !repeatEnabled;

    repeatButton.classList.toggle(
      "is-on",
      repeatEnabled
    );

    repeatButton.setAttribute(
      "aria-pressed",
      String(repeatEnabled)
    );

    if (activeTrack) {
      activeTrack.loop = repeatEnabled;
    }

  });

}
  /* VOLUME */

  if (volumeControl) {

    volumeControl.addEventListener("input", () => {

      const volume =
        Number(volumeControl.value);


      if (desktopVolume) {
        desktopVolume.value = volume;
      }


      window.dispatchEvent(
        new CustomEvent(
          "dj-master-volume-change",
          {
            detail: volume
          }
        )
      );

    });

  }


  /* AUDIO EVENTS */

  audioTracks.forEach((audio, index) => {

    if (!audio) return;


    const trackNumber =
      index + 1;


    const rowButton =
      mobilePlayer.querySelector(
        `[data-mobile-track="${trackNumber}"]`
      );


    const rowDuration =
      rowButton
        ? rowButton.querySelector(
            ".dj-mobile-track-duration"
          )
        : null;


    audio.addEventListener(
      "loadedmetadata",
      () => {

        if (rowDuration) {

          rowDuration.textContent =
            formatTime(audio.duration);

        }


        if (
          activeTrackNumber === trackNumber &&
          trackTime
        ) {

          trackTime.textContent =
            `0:00 / ${formatTime(audio.duration)}`;

        }

      }
    );


    audio.addEventListener(
      "timeupdate",
      () => {

        if (
          activeTrackNumber !== trackNumber
        ) {
          return;
        }


        if (trackTime) {

          trackTime.textContent =
            `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;

        }


        if (
          progressControl &&
          Number.isFinite(audio.duration) &&
          audio.duration > 0
        ) {

          progressControl.value =
            (audio.currentTime / audio.duration) * 100;

        }

      }
    );


    audio.addEventListener(
      "ended",
      () => {

        if (
          activeTrackNumber !== trackNumber
        ) {
          return;
        }


        /* SHUFFLE TO ANOTHER TRACK */

        if (shuffleEnabled) {

          const availableTracks =
            [1, 2, 3, 4, 5, 6].filter(
              (number) =>
                number !== trackNumber
            );


          const randomTrack =
            availableTracks[
              Math.floor(
                Math.random() *
                availableTracks.length
              )
            ];


          startTrack(randomTrack);

          return;
        }


        activeTrack = null;
        activeTrackNumber = null;

        clearButtons();


        if (progressControl) {
          progressControl.value = 0;
        }


        if (nowPlaying) {
          nowPlaying.textContent =
            "SELECT A TRACK";
        }


        if (mobileLcdText) {
          mobileLcdText.textContent =
            "NOW PLAYING";
        }


        if (trackTime) {
          trackTime.textContent =
            "0:00 / 0:00";
        }

      }
    );

  });

});

/* =========================================================
   TRACK 6 EXPLICIT CONTENT WARNING
   ========================================================= */

const explicitWarning =
  document.getElementById("dj-explicit-warning");

const explicitPlay =
  document.getElementById("dj-explicit-play");

const explicitCancel =
  document.getElementById("dj-explicit-cancel");

let pendingExplicitAction = null;

window.djExplicitGate = {
  request(action) {
    pendingExplicitAction = action;

    if (explicitWarning) {
      explicitWarning.hidden = false;
    }
  }
};

if (explicitCancel) {
  explicitCancel.addEventListener("click", () => {
    pendingExplicitAction = null;

    if (explicitWarning) {
      explicitWarning.hidden = true;
    }
  });
}

if (explicitPlay) {
  explicitPlay.addEventListener("click", () => {
    const action = pendingExplicitAction;

    pendingExplicitAction = null;

    if (explicitWarning) {
      explicitWarning.hidden = true;
    }

    if (typeof action === "function") {
      action();
    }
  });
}
