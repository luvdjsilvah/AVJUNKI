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

    requestAnimationFrame(layoutPortfolioMasonry);
  });
});
document.getElementById("year").textContent = new Date().getFullYear();
/* =========================================================
   PORTFOLIO MASONRY LAYOUT
   ========================================================= */

const portfolioGrid = document.querySelector(".portfolio-grid");

function layoutPortfolioMasonry() {
  if (!portfolioGrid) return;

  /* Leave the approved mobile layout alone */
  if (window.innerWidth <= 700) {
    portfolioItems.forEach((item) => {
      item.style.gridRowEnd = "";
    });
    return;
  }

  const rowHeight = 8;
  const itemGap = 28;

  portfolioItems.forEach((item) => {
    item.style.gridRowEnd = "";
  });

  portfolioItems.forEach((item) => {
    if (item.classList.contains("hidden")) return;

    const itemHeight = item.getBoundingClientRect().height;
    const rowSpan = Math.ceil((itemHeight + itemGap) / rowHeight);

    item.style.gridRowEnd = `span ${rowSpan}`;
  });
}

window.addEventListener("load", layoutPortfolioMasonry);
window.addEventListener("resize", layoutPortfolioMasonry);

document
  .querySelectorAll(".portfolio-item img, .portfolio-item video")
  .forEach((media) => {
    media.addEventListener("load", layoutPortfolioMasonry);
    media.addEventListener("loadedmetadata", layoutPortfolioMasonry);
  });

layoutPortfolioMasonry();
/* =========================================================
   SERVICE CARD NAVIGATION
   ========================================================= */

const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach((card) => {

  const title = card.querySelector("h3");

  if (!title) return;


  /* AUDIO PRODUCTION */

if (title.textContent.trim() === "Listen to AV Junki") {

    card.style.cursor = "pointer";

    card.addEventListener("click", () => {

      const audioFilter =
        document.querySelector(
          '.filter-button[data-filter="audio"]'
        );

      const djConsole =
        document.querySelector(".avj-dj-card");


      if (audioFilter) {
        audioFilter.click();
      }


      if (djConsole) {

        requestAnimationFrame(() => {

          const headerHeight =
            header
              ? header.offsetHeight
              : 0;

          const consolePosition =
            djConsole.getBoundingClientRect().top
            + window.scrollY
            - headerHeight
            - 24;


          window.scrollTo({
            top: consolePosition,
            behavior: "smooth"
          });

        });

      }

    });

  }

});
/* =========================================================
   AV JUNKI DJ CONSOLE ENGINE
   ========================================================= */

(() => {

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


    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;


    if (!AudioContextClass) {
        console.error("Web Audio API is not supported.");
        return;
    }


    const context =
        new AudioContextClass();


    const masterGain =
        context.createGain();


    masterGain.gain.value = 0.9;


    masterGain.connect(
        context.destination
    );


    function formatTime(seconds) {

        if (!Number.isFinite(seconds)) {
            return "0:00";
        }

        const minutes =
            Math.floor(
                seconds / 60
            );


        const secs =
            Math.floor(
                seconds % 60
            )
            .toString()
            .padStart(2, "0");


        return `${minutes}:${secs}`;

    }


    async function resumeAudioContext() {

        if (
            context.state ===
            "suspended"
        ) {
            await context.resume();
        }

    }


    function createDeck(prefix) {

        const audio =
            document.getElementById(
                `avj-${prefix}-audio`
            );


        if (!audio) {
            return null;
        }


        const source =
            context.createMediaElementSource(
                audio
            );


        /* LOW EQ */

        const low =
            context.createBiquadFilter();

        low.type = "lowshelf";
        low.frequency.value = 250;


        /* MID EQ */

        const mid =
            context.createBiquadFilter();

        mid.type = "peaking";
        mid.frequency.value = 1200;
        mid.Q.value = 1;


        /* HIGH EQ */

        const high =
            context.createBiquadFilter();

        high.type = "highshelf";
        high.frequency.value = 4000;


        /* GAIN */

        const trim =
            context.createGain();


        /* CHANNEL FADER */

        const channel =
            context.createGain();


        /* CROSSFADER */

        const cross =
            context.createGain();


        /* VU ANALYSER */

        const analyser =
            context.createAnalyser();


        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.72;


        source
            .connect(low)
            .connect(mid)
            .connect(high)
            .connect(trim)
            .connect(channel)
            .connect(cross)
            .connect(analyser)
            .connect(masterGain);


        trim.gain.value = 1;
        channel.gain.value = 0.85;
        cross.gain.value = 1;


        return {

            prefix,
            audio,
            low,
            mid,
            high,
            trim,
            channel,
            cross,
            analyser,

            title:
                document.getElementById(
                    `avj-${prefix}-title`
                ),

            current:
                document.getElementById(
                    `avj-${prefix}-current`
                ),

            duration:
                document.getElementById(
                    `avj-${prefix}-duration`
                ),

            rate:
                document.getElementById(
                    `avj-${prefix}-rate`
                ),

            select:
                document.getElementById(
                    `avj-${prefix}-select`
                ),

            play:
                document.getElementById(
                    `avj-${prefix}-play`
                ),

            cue:
                document.getElementById(
                    `avj-${prefix}-cue`
                ),

            seek:
                document.getElementById(
                    `avj-${prefix}-seek`
                ),

            tempo:
                document.getElementById(
                    `avj-${prefix}-tempo`
                ),

            pitchUp:
                document.getElementById(
                    `avj-${prefix}-pitch-up`
                ),

            pitchDown:
                document.getElementById(
                    `avj-${prefix}-pitch-down`
                ),

            platter:
                document.getElementById(
                    `avj-${prefix}-platter`
                ),

            waveform:
                document.getElementById(
                    `avj-${prefix}-wave`
                ),

            gainControl:
                document.getElementById(
                    `avj-${prefix}-gain`
                ),

            highControl:
                document.getElementById(
                    `avj-${prefix}-high`
                ),

            midControl:
                document.getElementById(
                    `avj-${prefix}-mid`
                ),

            lowControl:
                document.getElementById(
                    `avj-${prefix}-low`
                ),

            levelControl:
                document.getElementById(
                    `avj-${prefix}-level`
                ),

            meterBars:
                document.querySelectorAll(
                    `#avj-${prefix}-meter i`
                ),

            peaks: []

        };

    }


    const deckA =
        createDeck("a");


    const deckB =
        createDeck("b");


    if (!deckA || !deckB) {
        return;
    }


    /* =====================================================
       WAVEFORM
       ===================================================== */

    async function generateWaveform(
        deck,
        url
    ) {

        try {

            const response =
                await fetch(url);


            if (!response.ok) {
                throw new Error(
                    `Could not load ${url}`
                );
            }


            const arrayBuffer =
                await response.arrayBuffer();


            const decoded =
                await context.decodeAudioData(
                    arrayBuffer.slice(0)
                );


            const data =
                decoded.getChannelData(0);


            const numberOfBars = 150;


            const blockSize =
                Math.max(
                    1,
                    Math.floor(
                        data.length /
                        numberOfBars
                    )
                );


            const peaks = [];


            for (
                let bar = 0;
                bar < numberOfBars;
                bar++
            ) {

                const start =
                    bar * blockSize;


                const end =
                    Math.min(
                        start + blockSize,
                        data.length
                    );


                let peak = 0;


                for (
                    let sample = start;
                    sample < end;
                    sample += 20
                ) {

                    peak =
                        Math.max(
                            peak,
                            Math.abs(
                                data[sample]
                            )
                        );

                }


                peaks.push(
                    peak
                );

            }


            deck.peaks = peaks;


            drawWaveform(
                deck
            );

        } catch (error) {

            console.error(
                "Waveform error:",
                error
            );

        }

    }


    function drawWaveform(deck) {

        const canvas =
            deck.waveform;


        const ctx =
            canvas.getContext("2d");


        const width =
            canvas.width;


        const height =
            canvas.height;


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        if (!deck.peaks.length) {
            return;
        }


        const progress =
            deck.audio.duration
            ?
            deck.audio.currentTime /
            deck.audio.duration
            :
            0;


        const barWidth =
            width /
            deck.peaks.length;


        deck.peaks.forEach(
            (peak, index) => {

                const barHeight =
                    Math.max(
                        3,
                        peak *
                        height *
                        1.7
                    );


                const x =
                    index *
                    barWidth;


                const completed =
                    index /
                    deck.peaks.length
                    <= progress;


                ctx.fillStyle =
                    completed
                    ?
                    "#e21b23"
                    :
                    "#797979";


                ctx.fillRect(
                    x,
                    (height - barHeight) / 2,
                    Math.max(
                        1,
                        barWidth - 1
                    ),
                    barHeight
                );

            }
        );


        /* PLAYHEAD */

        const playheadX =
            progress *
            width;


        ctx.fillStyle =
            "#ffffff";


        ctx.fillRect(
            playheadX,
            0,
            2,
            height
        );

    }


    /* =====================================================
       TRACK LOADING
       ===================================================== */

    async function loadTrack(
        deck,
        index
    ) {

        const track =
            tracks[index];


        deck.audio.pause();


        deck.audio.src =
            track.src;


        deck.audio.load();


        deck.title.textContent =
            track.title;


        deck.select.value =
            String(index);


        deck.current.textContent =
            "0:00";


        deck.duration.textContent =
            "0:00";


        deck.seek.value = 0;


        deck.play.textContent =
            "▶ PLAY";


        deck.play.classList.remove(
            "avj-playing"
        );


        deck.platter.classList.remove(
            "avj-spinning"
        );


        deck.peaks = [];


        drawWaveform(
            deck
        );


        generateWaveform(
            deck,
            track.src
        );

    }


    /* =====================================================
       PLAY / PAUSE
       ===================================================== */

    async function togglePlay(deck) {

        await resumeAudioContext();


        if (deck.audio.paused) {

            try {

                await deck.audio.play();


                deck.play.textContent =
                    "❚❚ PAUSE";


                deck.play.classList.add(
                    "avj-playing"
                );


                deck.platter.classList.add(
                    "avj-spinning"
                );

            } catch (error) {

                console.error(
                    "Playback failed:",
                    error
                );

            }

        } else {

            deck.audio.pause();


            deck.play.textContent =
                "▶ PLAY";


            deck.play.classList.remove(
                "avj-playing"
            );


            deck.platter.classList.remove(
                "avj-spinning"
            );

        }

    }


    /* =====================================================
       CUE
       ===================================================== */

    function cueDeck(deck) {

        deck.audio.pause();


        deck.audio.currentTime = 0;


        deck.seek.value = 0;


        deck.play.textContent =
            "▶ PLAY";


        deck.play.classList.remove(
            "avj-playing"
        );


        deck.platter.classList.remove(
            "avj-spinning"
        );


        drawWaveform(
            deck
        );

    }


    /* =====================================================
       TEMPO
       ===================================================== */

    function setTempo(
        deck,
        value
    ) {

        const rate =
            Math.max(
                0.88,
                Math.min(
                    1.12,
                    Number(value)
                )
            );


        deck.tempo.value =
            rate;


        deck.audio.playbackRate =
            rate;


        const percentage =
            (rate - 1) *
            100;


        deck.rate.textContent =
            `${percentage >= 0 ? "+" : ""}${percentage.toFixed(1)}%`;

    }


    /* =====================================================
       DECK CONTROLS
       ===================================================== */

    function setupDeck(deck) {

        deck.play.addEventListener(
            "click",
            () => {
                togglePlay(deck);
            }
        );


        deck.cue.addEventListener(
            "click",
            () => {
                cueDeck(deck);
            }
        );


        deck.select.addEventListener(
            "change",
            () => {

                loadTrack(
                    deck,
                    Number(
                        deck.select.value
                    )
                );

            }
        );


        deck.seek.addEventListener(
            "input",
            () => {

                if (!deck.audio.duration) {
                    return;
                }


                deck.audio.currentTime =
                    Number(
                        deck.seek.value
                    )
                    / 100
                    *
                    deck.audio.duration;


                drawWaveform(
                    deck
                );

            }
        );


        deck.audio.addEventListener(
            "loadedmetadata",
            () => {

                deck.duration.textContent =
                    formatTime(
                        deck.audio.duration
                    );

            }
        );


        deck.audio.addEventListener(
            "timeupdate",
            () => {

                deck.current.textContent =
                    formatTime(
                        deck.audio.currentTime
                    );


                if (deck.audio.duration) {

                    deck.seek.value =
                        deck.audio.currentTime
                        /
                        deck.audio.duration
                        *
                        100;

                }


                drawWaveform(
                    deck
                );

            }
        );


        deck.audio.addEventListener(
            "ended",
            () => {

                deck.play.textContent =
                    "▶ PLAY";


                deck.play.classList.remove(
                    "avj-playing"
                );


                deck.platter.classList.remove(
                    "avj-spinning"
                );

            }
        );


        /* REAL GAIN */

        deck.gainControl.addEventListener(
            "input",
            () => {

                deck.trim.gain.value =
                    Number(
                        deck.gainControl.value
                    );

            }
        );


        /* REAL HIGH EQ */

        deck.highControl.addEventListener(
            "input",
            () => {

                deck.high.gain.value =
                    Number(
                        deck.highControl.value
                    );

            }
        );


        /* REAL MID EQ */

        deck.midControl.addEventListener(
            "input",
            () => {

                deck.mid.gain.value =
                    Number(
                        deck.midControl.value
                    );

            }
        );


        /* REAL LOW EQ */

        deck.lowControl.addEventListener(
            "input",
            () => {

                deck.low.gain.value =
                    Number(
                        deck.lowControl.value
                    );

            }
        );


        /* REAL CHANNEL FADER */

        deck.levelControl.addEventListener(
            "input",
            () => {

                deck.channel.gain.value =
                    Number(
                        deck.levelControl.value
                    );

            }
        );


        deck.tempo.addEventListener(
            "input",
            () => {

                setTempo(
                    deck,
                    deck.tempo.value
                );

            }
        );


        deck.pitchUp.addEventListener(
            "click",
            () => {

                setTempo(
                    deck,
                    Number(
                        deck.tempo.value
                    ) + .01
                );

            }
        );


        deck.pitchDown.addEventListener(
            "click",
            () => {

                setTempo(
                    deck,
                    Number(
                        deck.tempo.value
                    ) - .01
                );

            }
        );

    }


    /* =====================================================
       REAL CROSSFADER
       ===================================================== */

    const crossfader =
        document.getElementById(
            "avj-crossfader"
        );


    function updateCrossfader() {

        const position =
            Number(
                crossfader.value
            );


        /* CONSTANT POWER CROSSFADER */

        const gainA =
            Math.cos(
                position *
                Math.PI /
                2
            );


        const gainB =
            Math.sin(
                position *
                Math.PI /
                2
            );


        deckA.cross.gain.value =
            gainA;


        deckB.cross.gain.value =
            gainB;

    }


    crossfader.addEventListener(
        "input",
        updateCrossfader
    );


    /* =====================================================
       MASTER VOLUME
       ===================================================== */

    const masterVolume =
        document.getElementById(
            "avj-master-volume"
        );


    masterVolume.addEventListener(
        "input",
        () => {

            masterGain.gain.value =
                Number(
                    masterVolume.value
                );

        }
    );


    /* =====================================================
       REAL VU METERS
       ===================================================== */

    function getAudioLevel(
        analyser
    ) {

        const data =
            new Uint8Array(
                analyser.frequencyBinCount
            );


        analyser.getByteFrequencyData(
            data
        );


        let total = 0;


        for (
            let i = 0;
            i < data.length;
            i++
        ) {

            total += data[i];

        }


        return (
            total /
            data.length /
            255
        );

    }


    function paintMeter(
        bars,
        level
    ) {

        const active =
            Math.min(
                bars.length,
                Math.round(
                    level *
                    bars.length *
                    2.4
                )
            );


        bars.forEach(
            (bar, index) => {

                bar.classList.remove(
                    "avj-meter-green",
                    "avj-meter-yellow",
                    "avj-meter-red"
                );


                if (index >= active) {
                    return;
                }


                if (
                    index >=
                    bars.length - 2
                ) {

                    bar.classList.add(
                        "avj-meter-red"
                    );

                } else if (
                    index >=
                    bars.length - 4
                ) {

                    bar.classList.add(
                        "avj-meter-yellow"
                    );

                } else {

                    bar.classList.add(
                        "avj-meter-green"
                    );

                }

            }
        );

    }


    const masterLeft =
        document.querySelectorAll(
            "#avj-master-l i"
        );


    const masterRight =
        document.querySelectorAll(
            "#avj-master-r i"
        );


    function meterLoop() {

        const leftLevel =
            getAudioLevel(
                deckA.analyser
            );


        const rightLevel =
            getAudioLevel(
                deckB.analyser
            );


        paintMeter(
            deckA.meterBars,
            leftLevel
        );


        paintMeter(
            deckB.meterBars,
            rightLevel
        );


        paintMeter(
            masterLeft,
            leftLevel
        );


        paintMeter(
            masterRight,
            rightLevel
        );


        requestAnimationFrame(
            meterLoop
        );

    }


    /* =====================================================
       LIBRARY LOAD BUTTONS
       ===================================================== */

    document
        .querySelectorAll(
            "[data-avj-load-a]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        loadTrack(
                            deckA,
                            Number(
                                button.dataset
                                    .avjLoadA
                            )
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-avj-load-b]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        loadTrack(
                            deckB,
                            Number(
                                button.dataset
                                    .avjLoadB
                            )
                        );

                    }
                );

            }
        );


    /* =====================================================
       SEARCH
       ===================================================== */

    const search =
        document.getElementById(
            "avj-track-search"
        );


    const trackRows =
        document.querySelectorAll(
            ".avj-track-row"
        );


    if (search) {

        search.addEventListener(
            "input",
            () => {

                const term =
                    search.value
                    .toLowerCase()
                    .trim();


                trackRows.forEach(
                    row => {

                        const text =
                            row.textContent
                            .toLowerCase();


                        row.style.display =
                            text.includes(term)
                            ?
                            "grid"
                            :
                            "none";

                    }
                );

            }
        );

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    setupDeck(
        deckA
    );


    setupDeck(
        deckB
    );


    setTempo(
        deckA,
        1
    );


    setTempo(
        deckB,
        1
    );


    updateCrossfader();


    loadTrack(
        deckA,
        0
    );


    loadTrack(
        deckB,
        3
    );


    meterLoop();

})();
const mobileDjFilter = document.querySelector('.filter-button[data-filter="dj"]');

if (mobileDjFilter) {
  mobileDjFilter.addEventListener("click", (event) => {
    if (window.matchMedia("(max-width: 700px)").matches) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.href = "dj.html";
    }
  }, true);
}
/* =========================================================
   PRO AUDIO SERVICES FILM STRIP LOOP
   ========================================================= */

(() => {
  const track = document.querySelector(".audio-filmstrip-track");

  if (!track || track.dataset.loopReady === "true") return;

  track.dataset.loopReady = "true";

  const originalItems = Array.from(track.children);

  if (!originalItems.length) return;

  originalItems.forEach((item) => {
    const clone = item.cloneNode(true);

    clone.setAttribute("aria-hidden", "true");
    clone.tabIndex = -1;

    track.appendChild(clone);
  });

  const firstItem = track.children[0];
  const firstClone = track.children[originalItems.length];

  let offset = 0;
  let loopWidth = 0;
  let lastTime = 0;
  let paused = false;

  const speed = 28;

  track.style.willChange = "transform";

  function measureLoop() {
    loopWidth = firstClone.offsetLeft - firstItem.offsetLeft;

    if (loopWidth > 0 && offset >= loopWidth) {
      offset = offset % loopWidth;
    }
  }

  function animateFilmstrip(time) {
    if (!lastTime) {
      lastTime = time;
    }

    const delta = Math.min((time - lastTime) / 1000, 0.05);

    lastTime = time;

    if (
      window.innerWidth > 700 &&
      !paused &&
      loopWidth > 0 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      offset += speed * delta;

      if (offset >= loopWidth) {
        offset -= loopWidth;
      }

      track.style.transform =
        `translate3d(${-offset}px, 0, 0)`;
    }

    requestAnimationFrame(animateFilmstrip);
  }

  track.addEventListener("mouseenter", () => {
    paused = true;
  });

  track.addEventListener("mouseleave", () => {
    paused = false;
  });

  track.addEventListener("focusin", () => {
    paused = true;
  });

  track.addEventListener("focusout", () => {
    paused = false;
  });

  window.addEventListener("resize", measureLoop);

  requestAnimationFrame(() => {
    measureLoop();
    requestAnimationFrame(animateFilmstrip);
  });
})();
