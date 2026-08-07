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
/* =========================
   AV JUNKI DJ CONTROLLER
   ========================= */

const djTracks = [
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

const deckA = {
  audio: document.getElementById("deck-a-audio"),
  select: document.getElementById("deck-a-select"),
  title: document.getElementById("deck-a-title"),
  time: document.getElementById("deck-a-time"),
  play: document.getElementById("deck-a-play"),
  cue: document.getElementById("deck-a-cue"),
  progress: document.getElementById("deck-a-progress"),
  jog: document.getElementById("deck-a-jog"),
  gain: document.getElementById("deck-a-gain"),
  level: document.getElementById("deck-a-level"),
  vu: document.querySelectorAll("#vu-a i"),
  index: 0
};

const deckB = {
  audio: document.getElementById("deck-b-audio"),
  select: document.getElementById("deck-b-select"),
  title: document.getElementById("deck-b-title"),
  time: document.getElementById("deck-b-time"),
  play: document.getElementById("deck-b-play"),
  cue: document.getElementById("deck-b-cue"),
  progress: document.getElementById("deck-b-progress"),
  jog: document.getElementById("deck-b-jog"),
  gain: document.getElementById("deck-b-gain"),
  level: document.getElementById("deck-b-level"),
  vu: document.querySelectorAll("#vu-b i"),
  index: 3
};

const crossfader = document.getElementById("crossfader");
const masterVolume = document.getElementById("master-volume");

const masterVuLeft = document.querySelectorAll("#master-vu-left i");
const masterVuRight = document.querySelectorAll("#master-vu-right i");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${secs}`;
}

function loadDeck(deck, index) {
  deck.index = Number(index);

  const track = djTracks[deck.index];

  deck.audio.src = encodeURI(track.src);
  deck.title.textContent = track.title;
  deck.progress.value = 0;
  deck.time.textContent = "0:00 / 0:00";
  deck.play.textContent = "PLAY";
  deck.jog.classList.remove("spinning");
}

function toggleDeck(deck) {
  if (deck.audio.paused) {
    deck.audio.play()
      .then(() => {
        deck.play.textContent = "PAUSE";
        deck.jog.classList.add("spinning");
      })
      .catch(error => {
        console.error("Audio playback error:", error);
      });
  } else {
    deck.audio.pause();
    deck.play.textContent = "PLAY";
    deck.jog.classList.remove("spinning");
  }
}

function cueDeck(deck) {
  deck.audio.pause();
  deck.audio.currentTime = 0;
  deck.progress.value = 0;
  deck.play.textContent = "PLAY";
  deck.jog.classList.remove("spinning");
}

function setupDeck(deck) {

  deck.select.addEventListener("change", () => {
    loadDeck(deck, deck.select.value);
  });

  deck.play.addEventListener("click", () => {
    toggleDeck(deck);
  });

  deck.cue.addEventListener("click", () => {
    cueDeck(deck);
  });

  deck.progress.addEventListener("input", () => {
    if (!deck.audio.duration) return;

    deck.audio.currentTime =
      (Number(deck.progress.value) / 100) *
      deck.audio.duration;
  });

  deck.audio.addEventListener("timeupdate", () => {
    if (!deck.audio.duration) return;

    deck.progress.value =
      (deck.audio.currentTime / deck.audio.duration) *
      100;

    deck.time.textContent =
      `${formatTime(deck.audio.currentTime)} / ${formatTime(deck.audio.duration)}`;
  });

  deck.audio.addEventListener("loadedmetadata", () => {
    deck.time.textContent =
      `0:00 / ${formatTime(deck.audio.duration)}`;
  });

  deck.audio.addEventListener("ended", () => {
    deck.play.textContent = "PLAY";
    deck.jog.classList.remove("spinning");
    deck.progress.value = 0;
  });
}

function calculateCrossfade() {

  const x = Number(crossfader.value);

  let leftMix = 1;
  let rightMix = 1;

  if (x < 0) {
    rightMix = 1 + x;
  }

  if (x > 0) {
    leftMix = 1 - x;
  }

  const master = Number(masterVolume.value);

  deckA.audio.volume = Math.min(
    1,
    Number(deckA.gain.value) *
    Number(deckA.level.value) *
    leftMix *
    master
  );

  deckB.audio.volume = Math.min(
    1,
    Number(deckB.gain.value) *
    Number(deckB.level.value) *
    rightMix *
    master
  );
}

[
  crossfader,
  masterVolume,
  deckA.gain,
  deckA.level,
  deckB.gain,
  deckB.level
].forEach(control => {
  control.addEventListener("input", calculateCrossfade);
});

function animateMeters(deck, meterElements, masterElements) {

  const isPlaying = !deck.audio.paused;

  const level = isPlaying
    ? Math.floor(Math.random() * 6) + 2
    : 0;

  meterElements.forEach((bar, index) => {
    bar.classList.toggle("active", index < level);
  });

  masterElements.forEach((bar, index) => {
    bar.classList.toggle("active", index < level);
  });
}

function meterLoop() {

  animateMeters(deckA, deckA.vu, masterVuLeft);
  animateMeters(deckB, deckB.vu, masterVuRight);

  requestAnimationFrame(meterLoop);
}

setupDeck(deckA);
setupDeck(deckB);

loadDeck(deckA, 0);
loadDeck(deckB, 3);

deckA.select.value = "0";
deckB.select.value = "3";

calculateCrossfade();
meterLoop();
