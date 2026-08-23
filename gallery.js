const galleryImages = [
  "assets/images/V-pic-1.jpg",
  "assets/images/V-pic-2.jpg",
  "assets/images/V-pic-3.jpg",
  "assets/images/V-pic-4.jpg",
  "assets/images/V-pic-5.jpg",
  "assets/images/V-pic-6.jpg",
  "assets/images/V-pic-7.jpg",
  "assets/images/V-pic-8.jpg",
  "assets/images/V-pic-9.jpg",
  "assets/images/V-pic-10.jpg",
  "assets/images/V-pic-11.jpg",
  "assets/images/V-pic-12.jpg",
  "assets/images/V-pic-13.jpg",
  "assets/images/V-pic-14.jpg",
  "assets/images/V-pic-15.jpg",
  "assets/images/V-pic-16.jpg",
  "assets/images/V-pic-17.jpg",
  "assets/images/V-pic-18.jpg",
  "assets/images/V-pic-20.jpg",
  "assets/images/V-pic-21.jpg",
  "assets/images/V-pic-22.jpg",
  "assets/images/V-pic-23.jpg",
  "assets/images/V-pic-24.jpg",
  "assets/images/V-pic-25.jpg",
  "assets/images/V-pic-26.jpg",
  "assets/images/V-pic-27.jpg"
];


/* ==================================================
   MAIN CAMERA GALLERY
   ================================================== */

const galleryPhoto =
  document.getElementById("gallery-photo");

const galleryPlayButton =
  document.getElementById("gallery-play");

const galleryPrevButton =
  document.getElementById("gallery-prev");

const galleryNextButton =
  document.getElementById("gallery-next");

const cameraPlayButton =
  document.getElementById("camera-play-button");

const cameraPrevButton =
  document.getElementById("camera-prev-button");

const cameraNextButton =
  document.getElementById("camera-next-button");

const galleryStatus =
  document.querySelector(".gallery-status");


let currentImageIndex = 0;

let slideshowTimer = null;

let slideshowPlaying = false;


/* ==================================================
   LIGHTBOX ELEMENTS
   ================================================== */

const galleryEnlarge =
  document.getElementById("gallery-enlarge");

const galleryLightbox =
  document.getElementById("gallery-lightbox");

const lightboxImage =
  document.getElementById("lightbox-image");

const lightboxClose =
  document.getElementById("lightbox-close");

const lightboxBackground =
  document.getElementById("lightbox-background");

const lightboxPrev =
  document.getElementById("lightbox-prev");

const lightboxNext =
  document.getElementById("lightbox-next");

const lightboxCounter =
  document.getElementById("lightbox-counter");


let lightboxOpen = false;

let resumeSlideshowAfterLightbox = false;

let lastFocusedElement = null;


/* ==================================================
   SHOW CAMERA IMAGE
   ================================================== */

function showImage(index) {

  if (!galleryPhoto) return;


  currentImageIndex = index;


  /*
    Keep index safely inside
    the image array.
  */

  if (currentImageIndex < 0) {
    currentImageIndex =
      galleryImages.length - 1;
  }

  if (
    currentImageIndex >=
    galleryImages.length
  ) {
    currentImageIndex = 0;
  }


  galleryPhoto.classList.add(
    "gallery-changing"
  );


  setTimeout(() => {

    galleryPhoto.src =
      galleryImages[currentImageIndex];


    galleryPhoto.onload = () => {

      galleryPhoto.classList.remove(
        "gallery-changing"
      );

    };

  }, 180);


  /*
    If lightbox is open,
    keep full image synchronized.
  */

  if (lightboxOpen) {
    updateLightboxImage();
  }

}


/* ==================================================
   NEXT / PREVIOUS
   ================================================== */

function showNextImage() {

  currentImageIndex++;


  if (
    currentImageIndex >=
    galleryImages.length
  ) {
    currentImageIndex = 0;
  }


  showImage(currentImageIndex);

}


function showPreviousImage() {

  currentImageIndex--;


  if (currentImageIndex < 0) {
    currentImageIndex =
      galleryImages.length - 1;
  }


  showImage(currentImageIndex);

}


/* ==================================================
   SLIDESHOW
   ================================================== */

function startSlideshow() {

  if (slideshowTimer) {
    clearInterval(slideshowTimer);
  }


  slideshowPlaying = true;


  if (galleryPlayButton) {

    galleryPlayButton.textContent = "❚❚";

    galleryPlayButton.setAttribute(
      "aria-label",
      "Pause slideshow"
    );

  }


  if (galleryStatus) {
    galleryStatus.textContent =
      "Gallery Playing";
  }


  slideshowTimer = setInterval(() => {

    showNextImage();

  }, 4000);

}


function pauseSlideshow(
  statusText = "Gallery Paused"
) {

  slideshowPlaying = false;


  if (slideshowTimer) {

    clearInterval(slideshowTimer);

    slideshowTimer = null;

  }


  if (galleryPlayButton) {

    galleryPlayButton.textContent = "▶";

    galleryPlayButton.setAttribute(
      "aria-label",
      "Play slideshow"
    );

  }


  if (galleryStatus) {
    galleryStatus.textContent =
      statusText;
  }

}


function toggleSlideshow() {

  if (slideshowPlaying) {

    pauseSlideshow();

  } else {

    startSlideshow();

  }

}


/* ==================================================
   MANUAL CAMERA CONTROLS
   ================================================== */

function manualNext() {

  pauseSlideshow();

  showNextImage();


  if (galleryStatus) {
    galleryStatus.textContent =
      "Next Photo";
  }

}


function manualPrevious() {

  pauseSlideshow();

  showPreviousImage();


  if (galleryStatus) {
    galleryStatus.textContent =
      "Previous Photo";
  }

}


/* ==================================================
   UPDATE FULL IMAGE
   ================================================== */

function updateLightboxImage() {

  if (!lightboxImage) return;


  lightboxImage.src =
    galleryImages[currentImageIndex];


  lightboxImage.alt =
    `AV Junki photograph ${
      currentImageIndex + 1
    } of ${galleryImages.length}`;


  if (lightboxCounter) {

    lightboxCounter.textContent =
      `${currentImageIndex + 1} / ${galleryImages.length}`;

  }

}


/* ==================================================
   OPEN LIGHTBOX
   ================================================== */

function openLightbox() {

  if (!galleryLightbox) return;


  /*
    Remember whether slideshow
    was already running.
  */

  resumeSlideshowAfterLightbox =
    slideshowPlaying;


  /*
    Pause slideshow while visitor
    views full photograph.
  */

  if (slideshowPlaying) {

    pauseSlideshow(
      "Viewing Full Photo"
    );

  }


  lastFocusedElement =
    document.activeElement;


  updateLightboxImage();


  galleryLightbox.hidden = false;

  lightboxOpen = true;


  document.body.classList.add(
    "lightbox-open"
  );


  if (lightboxClose) {

    setTimeout(() => {

      lightboxClose.focus();

    }, 50);

  }

}


/* ==================================================
   CLOSE LIGHTBOX
   ================================================== */

function closeLightbox() {

  if (!galleryLightbox) return;


  galleryLightbox.hidden = true;

  lightboxOpen = false;


  document.body.classList.remove(
    "lightbox-open"
  );


  /*
    Return keyboard focus
    to the LCD.
  */

  if (
    lastFocusedElement &&
    typeof lastFocusedElement.focus ===
      "function"
  ) {

    lastFocusedElement.focus();

  }


  /*
    Resume only if slideshow
    was playing before lightbox opened.
  */

  if (
    resumeSlideshowAfterLightbox
  ) {

    startSlideshow();

  } else {

    if (galleryStatus) {
      galleryStatus.textContent =
        "Gallery Paused";
    }

  }


  resumeSlideshowAfterLightbox =
    false;

}


/* ==================================================
   LIGHTBOX PREVIOUS
   ================================================== */

function lightboxPreviousImage() {

  currentImageIndex--;


  if (currentImageIndex < 0) {

    currentImageIndex =
      galleryImages.length - 1;

  }


  /*
    Update full image immediately.
  */

  updateLightboxImage();


  /*
    Keep camera LCD synchronized
    behind the lightbox.
  */

  if (galleryPhoto) {

    galleryPhoto.src =
      galleryImages[currentImageIndex];

  }

}


/* ==================================================
   LIGHTBOX NEXT
   ================================================== */

function lightboxNextImage() {

  currentImageIndex++;


  if (
    currentImageIndex >=
    galleryImages.length
  ) {

    currentImageIndex = 0;

  }


  /*
    Update full image immediately.
  */

  updateLightboxImage();


  /*
    Keep camera LCD synchronized.
  */

  if (galleryPhoto) {

    galleryPhoto.src =
      galleryImages[currentImageIndex];

  }

}


/* ==================================================
   MAIN GALLERY EVENT LISTENERS
   ================================================== */

if (galleryPlayButton) {

  galleryPlayButton.addEventListener(
    "click",
    toggleSlideshow
  );

}


if (galleryNextButton) {

  galleryNextButton.addEventListener(
    "click",
    manualNext
  );

}


if (galleryPrevButton) {

  galleryPrevButton.addEventListener(
    "click",
    manualPrevious
  );

}


if (cameraPlayButton) {

  cameraPlayButton.addEventListener(
    "click",
    toggleSlideshow
  );

}


if (cameraNextButton) {

  cameraNextButton.addEventListener(
    "click",
    manualNext
  );

}


if (cameraPrevButton) {

  cameraPrevButton.addEventListener(
    "click",
    manualPrevious
  );

}


/* ==================================================
   OPEN FULL PHOTO
   ================================================== */

if (galleryEnlarge) {

  galleryEnlarge.addEventListener(
    "click",
    openLightbox
  );

}


/* ==================================================
   LIGHTBOX CONTROLS
   ================================================== */

if (lightboxClose) {

  lightboxClose.addEventListener(
    "click",
    closeLightbox
  );

}


if (lightboxBackground) {

  lightboxBackground.addEventListener(
    "click",
    closeLightbox
  );

}


if (lightboxPrev) {

  lightboxPrev.addEventListener(
    "click",
    lightboxPreviousImage
  );

}


if (lightboxNext) {

  lightboxNext.addEventListener(
    "click",
    lightboxNextImage
  );

}


/* ==================================================
   KEYBOARD CONTROLS
   ================================================== */

document.addEventListener(
  "keydown",
  function (event) {

    if (!lightboxOpen) return;


    /*
      ESCAPE
    */

    if (event.key === "Escape") {

      event.preventDefault();

      closeLightbox();

    }


    /*
      LEFT ARROW
    */

    if (event.key === "ArrowLeft") {

      event.preventDefault();

      lightboxPreviousImage();

    }


    /*
      RIGHT ARROW
    */

    if (event.key === "ArrowRight") {

      event.preventDefault();

      lightboxNextImage();

    }

  }
);


/* ==================================================
   INITIAL IMAGE
   ================================================== */

showImage(0);
