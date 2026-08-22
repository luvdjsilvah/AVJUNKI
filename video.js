document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     ELEMENTS
  ========================================================= */

  const mainVideo = document.getElementById("main-video");
  const mainPlayButton = document.getElementById("main-play-button");

  const playPauseButton = document.getElementById("video-play-pause");
  const muteButton = document.getElementById("video-mute");
  const fullscreenButton = document.getElementById("video-fullscreen");

  const progressBar = document.getElementById("video-progress");
  const videoTime = document.getElementById("video-time");

  const videoScreen = document.querySelector(".main-video-screen");

  const thumbnails = Array.from(
    document.querySelectorAll(".video-thumbnail")
  );

  const switcherButtons = Array.from(
    document.querySelectorAll(".switcher-button")
  );

  const mobileMenuButton = document.getElementById(
    "mobile-menu-button"
  );

  const videoNav = document.querySelector(".video-nav");

  const mobileServicesButton = document.getElementById(
    "mobile-services-button"
  );

  const mobileServices = document.getElementById(
    "mobile-services"
  );


  /* =========================================================
     VIDEO DATA
  ========================================================= */

  const videos = {

    "01": {
      src: "assets/video/video-01-event.mp4",
      poster: "assets/images/video-01-event-thumb.jpg"
    },

    "02": {
      src: "assets/video/video-02-commercial.mp4",
      poster: "assets/images/video-02-commercial-thumb.jpg"
    },

    "03": {
      src: "assets/video/video-03-music-video.mp4",
      poster: "assets/images/video-03-music-video-thumb.jpg"
    },

    "04": {
      src: "assets/video/video-04-interview.mp4",
      poster: "assets/images/video-04-interview-thumb.jpg"
    },

    "05": {
      src: "assets/video/video-05-drone.mp4",
      poster: "assets/images/video-05-drone-thumb.jpg"
    },

    "06": {
      src: "assets/video/video-06-multicamera.mp4",
      poster: "assets/images/video-06-multicamera-thumb.jpg"
    }

  };


  /* =========================================================
     CURRENT VIDEO
  ========================================================= */

  let currentVideoNumber = "01";


  /* =========================================================
     FORMAT TIME
  ========================================================= */

  function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;

  }


  /* =========================================================
     UPDATE TIME DISPLAY
  ========================================================= */

  function updateTimeDisplay() {

    const current = formatTime(mainVideo.currentTime);

    const duration = formatTime(mainVideo.duration);

    videoTime.textContent = `${current} / ${duration}`;

  }


  /* =========================================================
     UPDATE PLAY BUTTONS
  ========================================================= */

  function updatePlayButtons() {

    if (mainVideo.paused) {

      mainPlayButton.style.display = "flex";

      playPauseButton.textContent = "▶";

      playPauseButton.setAttribute(
        "aria-label",
        "Play video"
      );

    } else {

      mainPlayButton.style.display = "none";

      playPauseButton.textContent = "❚❚";

      playPauseButton.setAttribute(
        "aria-label",
        "Pause video"
      );

    }

  }


  /* =========================================================
     PLAY / PAUSE
  ========================================================= */

  function togglePlayPause() {

    if (mainVideo.paused) {

      mainVideo.play().catch(() => {});

    } else {

      mainVideo.pause();

    }

  }


  mainPlayButton.addEventListener(
    "click",
    togglePlayPause
  );

  playPauseButton.addEventListener(
    "click",
    togglePlayPause
  );

  mainVideo.addEventListener(
    "click",
    togglePlayPause
  );


  /* =========================================================
     VIDEO PLAY / PAUSE EVENTS
  ========================================================= */

  mainVideo.addEventListener(
    "play",
    updatePlayButtons
  );

  mainVideo.addEventListener(
    "pause",
    updatePlayButtons
  );

  mainVideo.addEventListener(
    "ended",
    updatePlayButtons
  );


  /* =========================================================
     LOAD VIDEO
  ========================================================= */

  function loadVideo(videoNumber, autoplay = true) {

    const selectedVideo = videos[videoNumber];

    if (!selectedVideo) {
      return;
    }

    currentVideoNumber = videoNumber;

    mainVideo.pause();

    mainVideo.src = selectedVideo.src;

    mainVideo.poster = selectedVideo.poster;

    mainVideo.load();

    progressBar.value = 0;

    videoTime.textContent = "0:00 / 0:00";

    updateActiveControls(videoNumber);

    if (autoplay) {

      mainVideo.addEventListener(
        "canplay",
        function startSelectedVideo() {

          mainVideo.removeEventListener(
            "canplay",
            startSelectedVideo
          );

          mainVideo.play().catch(() => {});

        }
      );

    }

  }


  /* =========================================================
     ACTIVE THUMBNAILS + SWITCHER
  ========================================================= */

  function updateActiveControls(videoNumber) {

    thumbnails.forEach((thumbnail) => {

      const number =
        thumbnail.dataset.videoNumber;

      thumbnail.classList.toggle(
        "active",
        number === videoNumber
      );

    });


    switcherButtons.forEach((button) => {

      const number =
        button.dataset.switchVideo;

      button.classList.toggle(
        "active",
        number === videoNumber
      );

    });

  }


  /* =========================================================
     THUMBNAILS
  ========================================================= */

  thumbnails.forEach((thumbnail) => {

    thumbnail.addEventListener(
      "click",
      () => {

        const videoNumber =
          thumbnail.dataset.videoNumber;

        loadVideo(videoNumber, true);

      }
    );

  });


  /* =========================================================
     PHYSICAL DESK SWITCHER
  ========================================================= */

  switcherButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const videoNumber =
          button.dataset.switchVideo;

        loadVideo(videoNumber, true);

      }
    );

  });


  /* =========================================================
     PROGRESS BAR
  ========================================================= */

  mainVideo.addEventListener(
    "timeupdate",
    () => {

      if (!mainVideo.duration) {
        return;
      }

      const progress =
        (mainVideo.currentTime /
          mainVideo.duration) *
        100;

      progressBar.value = progress;

      updateTimeDisplay();

    }
  );


  mainVideo.addEventListener(
    "loadedmetadata",
    () => {

      updateTimeDisplay();

    }
  );


  progressBar.addEventListener(
    "input",
    () => {

      if (!mainVideo.duration) {
        return;
      }

      const newTime =
        (progressBar.value / 100) *
        mainVideo.duration;

      mainVideo.currentTime = newTime;

    }
  );


  /* =========================================================
     MUTE / UNMUTE
  ========================================================= */

  muteButton.addEventListener(
    "click",
    () => {

      mainVideo.muted = !mainVideo.muted;

      if (mainVideo.muted) {

        muteButton.textContent = "🔇";

        muteButton.setAttribute(
          "aria-label",
          "Unmute video"
        );

      } else {

        muteButton.textContent = "🔊";

        muteButton.setAttribute(
          "aria-label",
          "Mute video"
        );

      }

    }
  );


  /* =========================================================
     FULLSCREEN
  ========================================================= */

  fullscreenButton.addEventListener(
    "click",
    () => {

      if (!document.fullscreenElement) {

        if (videoScreen.requestFullscreen) {

          videoScreen.requestFullscreen();

        } else if (
          videoScreen.webkitRequestFullscreen
        ) {

          videoScreen.webkitRequestFullscreen();

        }

      } else {

        if (document.exitFullscreen) {

          document.exitFullscreen();

        } else if (
          document.webkitExitFullscreen
        ) {

          document.webkitExitFullscreen();

        }

      }

    }
  );


  /* =========================================================
     SHOW CONTROLS ON MOBILE TAP
  ========================================================= */

  let controlsTimer;

  function showControlsTemporarily() {

    videoScreen.classList.add(
      "controls-visible"
    );

    clearTimeout(controlsTimer);

    controlsTimer = setTimeout(
      () => {

        if (!mainVideo.paused) {

          videoScreen.classList.remove(
            "controls-visible"
          );

        }

      },
      3000
    );

  }


  videoScreen.addEventListener(
    "mousemove",
    showControlsTemporarily
  );

  videoScreen.addEventListener(
    "touchstart",
    showControlsTemporarily,
    {
      passive: true
    }
  );


  /* =========================================================
     MOBILE MENU
  ========================================================= */

  if (
    mobileMenuButton &&
    videoNav
  ) {

    mobileMenuButton.addEventListener(
      "click",
      () => {

        const isOpen =
          videoNav.classList.toggle("open");

        mobileMenuButton.setAttribute(
          "aria-expanded",
          isOpen ? "true" : "false"
        );

      }
    );


    videoNav.querySelectorAll("a").forEach(
      (link) => {

        link.addEventListener(
          "click",
          () => {

            videoNav.classList.remove("open");

            mobileMenuButton.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      }
    );

  }


  /* =========================================================
     MOBILE SERVICES
  ========================================================= */

  if (
    mobileServicesButton &&
    mobileServices
  ) {

    mobileServicesButton.addEventListener(
      "click",
      () => {

        const isOpen =
          mobileServices.classList.toggle(
            "open"
          );

        mobileServicesButton.setAttribute(
          "aria-expanded",
          isOpen ? "true" : "false"
        );


        if (isOpen) {

          mobileServicesButton.textContent =
            "HIDE SERVICES";

        } else {

          mobileServicesButton.textContent =
            "VIEW SERVICES";

        }

      }
    );

  }


  /* =========================================================
     KEYBOARD SUPPORT
  ========================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      const activeTag =
        document.activeElement.tagName;

      if (
        activeTag === "INPUT" ||
        activeTag === "BUTTON" ||
        activeTag === "A"
      ) {
        return;
      }


      if (event.code === "Space") {

        event.preventDefault();

        togglePlayPause();

      }


      if (
        event.key >= "1" &&
        event.key <= "6"
      ) {

        const number =
          `0${event.key}`;

        loadVideo(number, true);

      }

    }
  );


  /* =========================================================
     INITIAL STATE
  ========================================================= */

  mainVideo.src =
    videos[currentVideoNumber].src;

  mainVideo.poster =
    videos[currentVideoNumber].poster;

  mainVideo.load();

  updateActiveControls(
    currentVideoNumber
  );

  updatePlayButtons();

});