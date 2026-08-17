document.addEventListener("DOMContentLoaded", () => {

  const screenVideo =
    document.getElementById("dj-screen-video");

  if (!screenVideo) {
    return;
  }

  screenVideo.muted = true;


  const tryPlay = () => {

    const playPromise =
      screenVideo.play();

    if (
      playPromise &&
      typeof playPromise.catch === "function"
    ) {

      playPromise.catch(() => {
        /* Keep the master image visible if autoplay is blocked. */
      });

    }

  };


  tryPlay();


  document.addEventListener(
    "visibilitychange",
    () => {

      if (document.hidden) {

        screenVideo.pause();

      } else {

        tryPlay();

      }

    }
  );

});
