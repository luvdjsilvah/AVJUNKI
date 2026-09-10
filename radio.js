/* =========================================================
   AV JUNKI RADIO
   radio.js
   Foundation hooks
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const audio = document.getElementById("radio-audio");
  const playPause = document.getElementById("play-pause");
  const volumeSlider = document.getElementById("volume-slider");
  const radioStatus = document.getElementById("radio-status");
  const screenContent = document.getElementById("screen-content");
  const screenButtons = document.querySelectorAll("[data-screen]");
  const panelButtons = document.querySelectorAll(".panel-hotspot");


  /* =======================================================
     VOLUME
  ======================================================= */

  if (audio && volumeSlider) {
    audio.volume = Number(volumeSlider.value) / 100;

    volumeSlider.addEventListener("input", () => {
      audio.volume = Number(volumeSlider.value) / 100;
    });
  }


  /* =======================================================
     PLAY / PAUSE
  ======================================================= */

  if (audio && playPause) {

    playPause.addEventListener("click", async () => {

      if (!audio.src) {
        setStatus("Stream source not connected yet.");
        return;
      }

      try {

        if (audio.paused) {
          await audio.play();
        } else {
          audio.pause();
        }

      } catch (error) {
        setStatus("Unable to start audio.");
      }

    });

    audio.addEventListener("play", () => {
      playPause.textContent = "❚❚";
      playPause.setAttribute("aria-label", "Pause");
    });

    audio.addEventListener("pause", () => {
      playPause.textContent = "▶";
      playPause.setAttribute("aria-label", "Play");
    });

  }


  /* =======================================================
     CENTER-SCREEN NAVIGATION
  ======================================================= */

  screenButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const screen = button.dataset.screen || "";

      if (screenContent) {
        screenContent.dataset.activeScreen = screen;
      }

      setStatus(formatLabel(screen));

    });

  });


  /* =======================================================
     SIDE PANEL HOOKS
  ======================================================= */

  panelButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const channel = button.dataset.channel || "";

      setStatus(formatLabel(channel));

    });

  });


  /* =======================================================
     STATUS HELPER
  ======================================================= */

  let statusTimer = null;

  function setStatus(message) {

    if (!radioStatus) {
      return;
    }

    radioStatus.textContent = message;

    window.clearTimeout(statusTimer);

    statusTimer = window.setTimeout(() => {
      radioStatus.textContent = "";
    }, 2200);

  }


  function formatLabel(value) {

    return String(value)
      .split("-")
      .map((part) => {
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(" ");

  }

});
