/* =========================================================
   AV JUNKI — DJ PAGE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const screenVideo = document.getElementById("dj-screen-video");
  const optionalPlatters = document.querySelectorAll(".dj-platter");

  // If platter PNGs have not been uploaded yet, hide broken image icons.
  optionalPlatters.forEach((platter) => {
    platter.addEventListener("error", () => {
      platter.classList.add("is-missing");
    });
  });

  // Hero video should remain muted so browsers allow autoplay.
  if (screenVideo) {
    screenVideo.muted = true;

    const tryPlay = () => {
      const playPromise = screenVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // If autoplay is blocked, the black screen in the master remains visible.
        });
      }
    };

    tryPlay();

    // Save resources while the tab is hidden.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        screenVideo.pause();
      } else {
        tryPlay();
      }
    });
  }
});
