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
/* ==================================
   AV JUNKI DJ CONSOLE V2
   ================================== */

const avjTracks = [

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

const djAudioContext =
    new AudioContextClass();


function formatDJTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${secs}`;
}


/* =============================
   AUDIO GRAPH
   ============================= */

function createDJDeck(prefix) {

    const audio =
        document.getElementById(
            `audio-${prefix}`
        );

    const source =
        djAudioContext
        .createMediaElementSource(audio);

    const low =
        djAudioContext
        .createBiquadFilter();

    low.type = "lowshelf";
    low.frequency.value = 250;


    const mid =
        djAudioContext
        .createBiquadFilter();

    mid.type = "peaking";
    mid.frequency.value = 1200;
    mid.Q.value = 1;


    const high =
        djAudioContext
        .createBiquadFilter();

    high.type = "highshelf";
    high.frequency.value = 4000;


    const gain =
        djAudioContext
        .createGain();


    const level =
        djAudioContext
        .createGain();


    const crossfadeGain =
        djAudioContext
        .createGain();


    const analyser =
        djAudioContext
        .createAnalyser();

    analyser.fftSize = 256;


    source
        .connect(low)
        .connect(mid)
        .connect(high)
        .connect(gain)
        .connect(level)
        .connect(crossfadeGain)
        .connect(analyser);


    return {

        audio,

        low,

        mid,

        high,

        gain,

        level,

        crossfadeGain,

        analyser,

        title:
            document.getElementById(
                `${prefix}-title`
            ),

        current:
            document.getElementById(
                `${prefix}-current`
            ),

        duration:
            document.getElementById(
                `${prefix}-duration`
            ),

        select:
            document.getElementById(
                `${prefix}-track-select`
            ),

        play:
            document.getElementById(
                `${prefix}-play`
            ),

        cue:
            document.getElementById(
                `${prefix}-cue`
            ),

        platter:
            document.getElementById(
                `${prefix}-platter`
            ),

        waveform:
            document.getElementById(
                `${prefix}-waveform`
            ),

        tempo:
            document.getElementById(
                `${prefix}-tempo`
            ),

        tempoValue:
            document.getElementById(
                `${prefix}-tempo-value`
            ),

        gainControl:
            document.getElementById(
                `${prefix}-gain`
            ),

        highControl:
            document.getElementById(
                `${prefix}-high`
            ),

        midControl:
            document.getElementById(
                `${prefix}-mid`
            ),

        lowControl:
            document.getElementById(
                `${prefix}-low`
            ),

        levelControl:
            document.getElementById(
                `${prefix}-level`
            ),

        vuBars:
            document.querySelectorAll(
                `#${prefix}-vu i`
            ),

        waveformPeaks: []

    };

}


const deckA =
    createDJDeck("a");

const deckB =
    createDJDeck("b");


const masterGain =
    djAudioContext
    .createGain();


const masterAnalyser =
    djAudioContext
    .createAnalyser();


masterAnalyser.fftSize = 256;


deckA.analyser
    .connect(masterGain);

deckB.analyser
    .connect(masterGain);


masterGain
    .connect(masterAnalyser)
    .connect(djAudioContext.destination);


/* =============================
   TRACK LOADING
   ============================= */

async function loadDJTrack(
    deck,
    trackIndex
) {

    const track =
        avjTracks[trackIndex];

    deck.audio.pause();

    deck.audio.src =
        track.src;

    deck.title.textContent =
        track.title;

    deck.select.value =
        String(trackIndex);

    deck.play.textContent =
        "▶ PLAY";

    deck.play.classList
        .remove("active");

    deck.platter.classList
        .remove("playing");

    deck.current.textContent =
        "0:00";

    deck.duration.textContent =
        "0:00";

    deck.audio.load();

    await generateWaveform(
        deck,
        track.src
    );

}


/* =============================
   PLAY / CUE
   ============================= */

async function toggleDJDeck(deck) {

    if (
        djAudioContext.state ===
        "suspended"
    ) {

        await
            djAudioContext.resume();

    }


    if (deck.audio.paused) {

        await deck.audio.play();

        deck.play.textContent =
            "❚❚ PAUSE";

        deck.play.classList
            .add("active");

        deck.platter.classList
            .add("playing");

    } else {

        deck.audio.pause();

        deck.play.textContent =
            "▶ PLAY";

        deck.play.classList
            .remove("active");

        deck.platter.classList
            .remove("playing");

    }

}


function cueDJDeck(deck) {

    deck.audio.pause();

    deck.audio.currentTime = 0;

    deck.play.textContent =
        "▶ PLAY";

    deck.play.classList
        .remove("active");

    deck.platter.classList
        .remove("playing");

}


/* =============================
   EQ / LEVEL
   ============================= */

function setupMixerControls(deck) {

    deck.gainControl
        .addEventListener(
            "input",
            () => {

                deck.gain.gain.value =
                    Number(
                        deck.gainControl.value
                    );

            }
        );


    deck.highControl
        .addEventListener(
            "input",
            () => {

                deck.high.gain.value =
                    Number(
                        deck.highControl.value
                    );

            }
        );


    deck.midControl
        .addEventListener(
            "input",
            () => {

                deck.mid.gain.value =
                    Number(
                        deck.midControl.value
                    );

            }
        );


    deck.lowControl
        .addEventListener(
            "input",
            () => {

                deck.low.gain.value =
                    Number(
                        deck.lowControl.value
                    );

            }
        );


    deck.levelControl
        .addEventListener(
            "input",
            () => {

                deck.level.gain.value =
                    Number(
                        deck.levelControl.value
                    );

            }
        );


    deck.tempo
        .addEventListener(
            "input",
            () => {

                const rate =
                    Number(
                        deck.tempo.value
                    );

                deck.audio.playbackRate =
                    rate;

                const percent =
                    Math.round(
                        (rate - 1) * 100
                    );

                deck.tempoValue
                    .textContent =
                    `${percent > 0 ? "+" : ""}${percent}%`;

            }
        );

}


/* =============================
   CROSSFADER
   ============================= */

const djCrossfader =
    document.getElementById(
        "dj-crossfader"
    );


function updateCrossfader() {

    const position =
        Number(
            djCrossfader.value
        );


    const gainA =
        Math.cos(
            position *
            0.5 *
            Math.PI
        );


    const gainB =
        Math.cos(
            (1 - position) *
            0.5 *
            Math.PI
        );


    deckA.crossfadeGain
        .gain.value =
        gainA;


    deckB.crossfadeGain
        .gain.value =
        gainB;

}


djCrossfader
    .addEventListener(
        "input",
        updateCrossfader
    );


/* =============================
   MASTER VOLUME
   ============================= */

const masterVolume =
    document.getElementById(
        "master-volume"
    );


masterVolume
    .addEventListener(
        "input",
        () => {

            masterGain
                .gain.value =
                Number(
                    masterVolume.value
                );

        }
    );


/* =============================
   TIME / PROGRESS
   ============================= */

function setupPlayback(deck) {

    deck.play.addEventListener(
        "click",
        () =>
            toggleDJDeck(deck)
    );


    deck.cue.addEventListener(
        "click",
        () =>
            cueDJDeck(deck)
    );


    deck.select.addEventListener(
        "change",
        () =>
            loadDJTrack(
                deck,
                Number(
                    deck.select.value
                )
            )
    );


    deck.audio.addEventListener(
        "loadedmetadata",
        () => {

            deck.duration
                .textContent =
                formatDJTime(
                    deck.audio.duration
                );

        }
    );


    deck.audio.addEventListener(
        "timeupdate",
        () => {

            deck.current
                .textContent =
                formatDJTime(
                    deck.audio.currentTime
                );

            drawWaveform(deck);

        }
    );


    deck.audio.addEventListener(
        "ended",
        () => {

            deck.play.textContent =
                "▶ PLAY";

            deck.play.classList
                .remove("active");

            deck.platter.classList
                .remove("playing");

        }
    );

}


/* =============================
   REAL WAVEFORM
   ============================= */

async function generateWaveform(
    deck,
    url
) {

    try {

        const response =
            await fetch(url);

        const arrayBuffer =
            await response
            .arrayBuffer();

        const decoded =
            await djAudioContext
            .decodeAudioData(
                arrayBuffer
            );

        const data =
            decoded
            .getChannelData(0);

        const bars = 100;

        const block =
            Math.floor(
                data.length /
                bars
            );

        const peaks = [];


        for (
            let i = 0;
            i < bars;
            i++
        ) {

            let peak = 0;

            const start =
                i * block;

            const end =
                start + block;


            for (
                let j = start;
                j < end;
                j++
            ) {

                const value =
                    Math.abs(
                        data[j]
                    );

                if (
                    value >
                    peak
                ) {

                    peak =
                        value;

                }

            }

            peaks.push(
                peak
            );

        }


        deck.waveformPeaks =
            peaks;

        drawWaveform(deck);

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
        canvas
        .getContext("2d");

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


    if (
        !deck.waveformPeaks.length
    ) {

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
        deck.waveformPeaks.length;


    deck.waveformPeaks
        .forEach(
            (peak, index) => {

                const h =
                    Math.max(
                        3,
                        peak *
                        height *
                        1.8
                    );

                const x =
                    index *
                    barWidth;


                ctx.fillStyle =
                    index /
                    deck.waveformPeaks.length
                    <= progress
                    ?
                    "#e21b23"
                    :
                    "#777";


                ctx.fillRect(
                    x,
                    (height - h) / 2,
                    Math.max(
                        1,
                        barWidth - 1
                    ),
                    h
                );

            }
        );

}


/* =============================
   VU METERS
   ============================= */

const masterL =
    document.querySelectorAll(
        "#master-vu-l i"
    );

const masterR =
    document.querySelectorAll(
        "#master-vu-r i"
    );


function getAnalyserLevel(
    analyser
) {

    const data =
        new Uint8Array(
            analyser
            .frequencyBinCount
        );


    analyser
        .getByteFrequencyData(
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

    const activeBars =
        Math.round(
            level *
            bars.length *
            2
        );


    bars.forEach(
        (bar, index) => {

            bar.classList
                .remove(
                    "active",
                    "warning",
                    "peak"
                );


            if (
                index <
                activeBars
            ) {

                if (
                    index >=
                    bars.length - 2
                ) {

                    bar.classList
                        .add("peak");

                } else if (
                    index >=
                    bars.length - 4
                ) {

                    bar.classList
                        .add("warning");

                } else {

                    bar.classList
                        .add("active");

                }

            }

        }
    );

}


function runMeters() {

    const levelA =
        getAnalyserLevel(
            deckA.analyser
        );


    const levelB =
        getAnalyserLevel(
            deckB.analyser
        );


    paintMeter(
        deckA.vuBars,
        levelA
    );


    paintMeter(
        deckB.vuBars,
        levelB
    );


    paintMeter(
        masterL,
        levelA
    );


    paintMeter(
        masterR,
        levelB
    );


    requestAnimationFrame(
        runMeters
    );

}


/* =============================
   TRACK LIBRARY
   ============================= */

document
    .querySelectorAll(
        "[data-load-a]"
    )
    .forEach(
        button => {

            button
                .addEventListener(
                    "click",
                    () => {

                        loadDJTrack(
                            deckA,
                            Number(
                                button.dataset
                                    .loadA
                            )
                        );

                    }
                );

        }
    );


document
    .querySelectorAll(
        "[data-load-b]"
    )
    .forEach(
        button => {

            button
                .addEventListener(
                    "click",
                    () => {

                        loadDJTrack(
                            deckB,
                            Number(
                                button.dataset
                                    .loadB
                            )
                        );

                    }
                );

        }
    );


/* =============================
   STARTUP
   ============================= */

setupMixerControls(
    deckA
);

setupMixerControls(
    deckB
);

setupPlayback(
    deckA
);

setupPlayback(
    deckB
);


loadDJTrack(
    deckA,
    0
);

loadDJTrack(
    deckB,
    3
);


masterGain.gain.value =
    0.9;


deckA.level.gain.value =
    0.85;

deckB.level.gain.value =
    0.85;


updateCrossfader();

runMeters();
