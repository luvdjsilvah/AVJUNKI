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
