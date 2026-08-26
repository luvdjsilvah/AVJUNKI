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
      nowPlaying.textContent = "SELECT 1–6";
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

    const startingVolume =
      Number(masterVolume.value);

    audioTracks.forEach((audio) => {

      if (audio) {
        audio.volume = startingVolume;
      }

    });


    masterVolume.addEventListener(
      "input",
      () => {

        const volume =
          Number(masterVolume.value);

        audioTracks.forEach((audio) => {

          if (audio) {
            audio.volume = volume;
          }

        });

      }
    );
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
