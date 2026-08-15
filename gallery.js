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
  "assets/images/V-pic-25.jpg"
];

const galleryPhoto = document.getElementById("gallery-photo");

const galleryPlayButton = document.getElementById("gallery-play");
const galleryPrevButton = document.getElementById("gallery-prev");
const galleryNextButton = document.getElementById("gallery-next");

const cameraPlayButton = document.getElementById("camera-play-button");
const cameraPrevButton = document.getElementById("camera-prev-button");
const cameraNextButton = document.getElementById("camera-next-button");

const galleryStatus = document.querySelector(".gallery-status");

let currentImageIndex = 0;
let slideshowTimer = null;
let slideshowPlaying = false;

function showImage(index) {
  if (!galleryPhoto) return;

  currentImageIndex = index;

  galleryPhoto.classList.add("gallery-changing");

  setTimeout(() => {
    galleryPhoto.src = galleryImages[currentImageIndex];

    galleryPhoto.onload = () => {
      galleryPhoto.classList.remove("gallery-changing");
    };
  }, 180);
}

function showNextImage() {
  currentImageIndex++;

  if (currentImageIndex >= galleryImages.length) {
    currentImageIndex = 0;
  }

  showImage(currentImageIndex);
}

function showPreviousImage() {
  currentImageIndex--;

  if (currentImageIndex < 0) {
    currentImageIndex = galleryImages.length - 1;
  }

  showImage(currentImageIndex);
}

function startSlideshow() {
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
  }

  slideshowPlaying = true;

  if (galleryPlayButton) {
    galleryPlayButton.textContent = "❚❚";
    galleryPlayButton.setAttribute("aria-label", "Pause slideshow");
  }

  if (galleryStatus) {
    galleryStatus.textContent = "Gallery Playing";
  }

  slideshowTimer = setInterval(() => {
    showNextImage();
  }, 4000);
}

function pauseSlideshow() {
  slideshowPlaying = false;

  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
  }

  if (galleryPlayButton) {
    galleryPlayButton.textContent = "▶";
    galleryPlayButton.setAttribute("aria-label", "Play slideshow");
  }

  if (galleryStatus) {
    galleryStatus.textContent = "Gallery Paused";
  }
}

function toggleSlideshow() {
  if (slideshowPlaying) {
    pauseSlideshow();
  } else {
    startSlideshow();
  }
}

function manualNext() {
  pauseSlideshow();
  showNextImage();

  if (galleryStatus) {
    galleryStatus.textContent = "Next Photo";
  }
}

function manualPrevious() {
  pauseSlideshow();
  showPreviousImage();

  if (galleryStatus) {
    galleryStatus.textContent = "Previous Photo";
  }
}

if (galleryPlayButton) {
  galleryPlayButton.addEventListener("click", toggleSlideshow);
}

if (galleryNextButton) {
  galleryNextButton.addEventListener("click", manualNext);
}

if (galleryPrevButton) {
  galleryPrevButton.addEventListener("click", manualPrevious);
}

if (cameraPlayButton) {
  cameraPlayButton.addEventListener("click", toggleSlideshow);
}

if (cameraNextButton) {
  cameraNextButton.addEventListener("click", manualNext);
}

if (cameraPrevButton) {
  cameraPrevButton.addEventListener("click", manualPrevious);
}

showImage(0);
