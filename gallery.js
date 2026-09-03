/* ==================================================
   AV JUNKI PHOTOGRAPHY GALLERY
   ================================================== */

const galleryImages = [
  {
    src: "assets/images/V-pic-1.jpg",
    alt: "AV Junki professional photography portfolio image 1"
  },
  {
    src: "assets/images/V-pic-2.jpg",
    alt: "AV Junki professional photography portfolio image 2"
  },
  {
    src: "assets/images/V-pic-3.jpg",
    alt: "AV Junki professional photography portfolio image 3"
  },
  {
    src: "assets/images/V-pic-4.jpg",
    alt: "AV Junki professional photography portfolio image 4"
  },
  {
    src: "assets/images/V-pic-5.jpg",
    alt: "AV Junki professional photography portfolio image 5"
  },
  {
    src: "assets/images/V-pic-6.jpg",
    alt: "AV Junki professional photography portfolio image 6"
  },
  {
    src: "assets/images/V-pic-7.jpg",
    alt: "AV Junki professional photography portfolio image 7"
  },
  {
    src: "assets/images/V-pic-8.jpg",
    alt: "AV Junki professional photography portfolio image 8"
  },
  {
    src: "assets/images/V-pic-9.jpg",
    alt: "AV Junki professional photography portfolio image 9"
  },
  {
    src: "assets/images/V-pic-10.jpg",
    alt: "AV Junki professional photography portfolio image 10"
  },
  {
    src: "assets/images/V-pic-11.jpg",
    alt: "AV Junki professional photography portfolio image 11"
  },
  {
    src: "assets/images/V-pic-12.jpg",
    alt: "AV Junki professional photography portfolio image 12"
  },
  {
    src: "assets/images/V-pic-13.jpg",
    alt: "AV Junki professional photography portfolio image 13"
  },
  {
    src: "assets/images/V-pic-14.jpg",
    alt: "AV Junki professional photography portfolio image 14"
  },
  {
    src: "assets/images/V-pic-15.jpg",
    alt: "AV Junki professional photography portfolio image 15"
  },
  {
    src: "assets/images/V-pic-16.jpg",
    alt: "AV Junki professional photography portfolio image 16"
  },
  {
    src: "assets/images/V-pic-17.jpg",
    alt: "AV Junki professional photography portfolio image 17"
  },
  {
    src: "assets/images/V-pic-18.jpg",
    alt: "AV Junki professional photography portfolio image 18"
  },
  {
    src: "assets/images/V-pic-20.jpg",
    alt: "AV Junki professional photography portfolio image 20"
  },
  {
    src: "assets/images/V-pic-21.jpg",
    alt: "AV Junki professional photography portfolio image 21"
  },
  {
    src: "assets/images/V-pic-22.jpg",
    alt: "AV Junki professional photography portfolio image 22"
  },
  {
    src: "assets/images/V-pic-23.jpg",
    alt: "AV Junki professional photography portfolio image 23"
  },
  {
    src: "assets/images/V-pic-24.jpg",
    alt: "AV Junki professional photography portfolio image 24"
  },
  {
    src: "assets/images/V-pic-25.jpg",
    alt: "AV Junki professional photography portfolio image 25"
  },
  {
    src: "assets/images/V-pic-26.jpg",
    alt: "AV Junki professional photography portfolio image 26"
  },
  {
    src: "assets/images/V-pic-27.jpg",
    alt: "AV Junki professional photography portfolio image 27"
  }
];


/* ==================================================
   MAIN CAMERA GALLERY
   ================================================== */

const galleryPhoto =
  document.getElementById("gallery-photo");

const galleryPlayButton =
  document.getElementById("gallery-play");

const galleryHeadPlayButton =
  document.getElementById("gallery-head-play");

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


  const currentImage =
    galleryImages[currentImageIndex];


  galleryPhoto.classList.add(
    "gallery-changing"
  );


  setTimeout(() => {

    galleryPhoto.src =
      currentImage.src;

    galleryPhoto.alt =
      currentImage.alt;


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

  }, 3000);

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


  const currentImage =
    galleryImages[currentImageIndex];


  lightboxImage.src =
    currentImage.src;

  lightboxImage.alt =
    currentImage.alt;


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
    to the previous control.
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


  updateLightboxImage();


  /*
    Keep camera LCD synchronized
    behind the lightbox.
  */

  if (galleryPhoto) {

    galleryPhoto.src =
      galleryImages[currentImageIndex].src;

    galleryPhoto.alt =
      galleryImages[currentImageIndex].alt;

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


  updateLightboxImage();


  /*
    Keep camera LCD synchronized
    behind the lightbox.
  */

  if (galleryPhoto) {

    galleryPhoto.src =
      galleryImages[currentImageIndex].src;

    galleryPhoto.alt =
      galleryImages[currentImageIndex].alt;

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


if (galleryHeadPlayButton) {

  galleryHeadPlayButton.addEventListener(
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
