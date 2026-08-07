const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const filterButtons = document.querySelectorAll(".filter-button");
const portfolioItems = document.querySelectorAll(".portfolio-item");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const selectedFilter = button.dataset.filter;

    portfolioItems.forEach((item) => {
      const shouldShow =
        selectedFilter === "all" ||
        item.dataset.category === selectedFilter;

      item.classList.toggle("hidden", !shouldShow);
    });
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
const tracks = [
  {
    title: "Captain Of the Sea",
    src: "assets/audio/Captain Of the Sea.mp3"
  },
  {
    title: "IS SHE",
    src: "assets/audio/IS SHE.mp3"
  },
  {
    title: "Jolli Xs",
    src: "assets/audio/Jolli Xs.mp3"
  },
  {
    title: "Podcast Him & Her",
    src: "assets/audio/Podcast Him & Her.mp3"
  },
  {
    title: "SOAP",
    src: "assets/audio/SOAP.mp3"
  },
  {
    title: "True Luv X",
    src: "assets/audio/True Luv X.mp3"
  }
];

function timeFormat(sec) {
  if (!Number.isFinite(sec)) return "0:00";

  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function buildDeck(prefix, defaultIndex) {

  const audio = document.getElementById(`audio-${prefix}`);
  const title = document.getElementById(`${prefix}-title`);
  const current = document.getElementById(`${prefix}-current`);
  const duration = document.getElementById(`${prefix}-duration`);
  const progress = document.getElementById(`${prefix}-progress`);
  const select = document.getElementById(`${prefix}-track-select`);
  const play = document.getElementById(`${prefix}-play`);
  const cue = document.getElementById(`${prefix}-cue`);
  const platter = document.getElementById(`${prefix}-platter`);
  const tempo = document.getElementById(`${prefix}-tempo`);
  const pitchUp = document.getElementById(`${prefix}-pitch-up`);
  const pitchDown = document.getElementById(`${prefix}-pitch-down`);

  function load(index) {
    const track = tracks[index];

    audio.pause();
    audio.src = encodeURI(track.src);

    title.textContent = track.title;
    progress.value = 0;
    current.textContent = "0:00";

    platter.classList.remove("playing");
    play.classList.remove("active");
    play.textContent = "▶ PLAY";
  }

  select.addEventListener("change", () => {
    load(Number(select.value));
  });

  play.addEventListener("click", () => {

    if (audio.paused) {

      audio.play().then(() => {
        platter.classList.add("playing");
        play.classList.add("active");
        play.textContent = "❚❚ PAUSE";
      });

    } else {

      audio.pause();
      platter.classList.remove("playing");
      play.classList.remove("active");
      play.textContent = "▶ PLAY";
    }
  });

  cue.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;

    platter.classList.remove("playing");
    play.classList.remove("active");
    play.textContent = "▶ PLAY";
  });

  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = timeFormat(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {

    current.textContent = timeFormat(audio.currentTime);

    if (audio.duration) {
      progress.value =
        (audio.currentTime / audio.duration) * 100;
    }
  });

  progress.addEventListener("input", () => {

    if (!audio.duration) return;

    audio.currentTime =
      (Number(progress.value) / 100) *
      audio.duration;
  });

  tempo.addEventListener("input", () => {
    audio.playbackRate = Number(tempo.value);
  });

  pitchUp.addEventListener("click", () => {
    tempo.value =
      Math.min(1.2, Number(tempo.value) + 0.01);

    audio.playbackRate = Number(tempo.value);
  });

  pitchDown.addEventListener("click", () => {
    tempo.value =
      Math.max(0.8, Number(tempo.value) - 0.01);

    audio.playbackRate = Number(tempo.value);
  });

  audio.addEventListener("ended", () => {
    platter.classList.remove("playing");
    play.classList.remove("active");
    play.textContent = "▶ PLAY";
  });

  select.value = String(defaultIndex);
  load(defaultIndex);

  return audio;
}


const deckAudioA = buildDeck("a", 0);
const deckAudioB = buildDeck("b", 3);


const crossfader = document.getElementById("crossfader");
const masterVolume = document.getElementById("master-volume");

const gainA = document.getElementById("a-gain");
const gainB = document.getElementById("b-gain");

const levelA = document.getElementById("a-level");
const levelB = document.getElementById("b-level");


function updateMixer() {

  const x = Number(crossfader.value);

  let left = 1;
  let right = 1;

  if (x > 0) {
    left = 1 - x;
  }

  if (x < 0) {
    right = 1 + x;
  }

  const master = Number(masterVolume.value);

  deckAudioA.volume = Math.min(
    1,
    Number(gainA.value) *
    Number(levelA.value) *
    left *
    master
  );

  deckAudioB.volume = Math.min(
    1,
    Number(gainB.value) *
    Number(levelB.value) *
    right *
    master
  );
}


[
  crossfader,
  masterVolume,
  gainA,
  gainB,
  levelA,
  levelB
].forEach(control => {
  control.addEventListener("input", updateMixer);
});


const masterLeftBars =
  document.querySelectorAll("#master-left i");

const masterRightBars =
  document.querySelectorAll("#master-right i");


function animateVu() {

  const leftLevel =
    deckAudioA.paused
      ? 0
      : Math.floor(Math.random() * 7) + 2;

  const rightLevel =
    deckAudioB.paused
      ? 0
      : Math.floor(Math.random() * 7) + 2;


  masterLeftBars.forEach((bar, index) => {
    bar.classList.toggle(
      "active",
      index < leftLevel
    );
  });

  masterRightBars.forEach((bar, index) => {
    bar.classList.toggle(
      "active",
      index < rightLevel
    );
  });

  requestAnimationFrame(animateVu);
}


updateMixer();
animateVu();
