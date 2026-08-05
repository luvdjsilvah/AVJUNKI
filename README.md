# AV Junki Website

A responsive static website for AV Junki featuring:

- Audio production
- 4K video production
- Photography
- DJ services
- Portfolio filtering
- Contact form
- Consultation booking
- Instagram, Facebook, TikTok, and YouTube links
- Mobile navigation

## 1. Add your hero image

Rename your 3840 × 2160 hero image to:

`hero.jpg`

Place it here:

`assets/images/hero.jpg`

Your logo is already baked into the hero image, so the text brand in the upper-left navigation can be changed or removed from `index.html`.

## 2. Add your photos

Replace these placeholder filenames with your real image files:

- `assets/images/photo-1.jpg`
- `assets/images/photo-2.jpg`
- `assets/images/dj-1.jpg`
- `assets/images/video-poster-1.jpg`
- `assets/images/video-poster-2.jpg`

You may add more portfolio cards by copying an existing `<article class="portfolio-item">` block in `index.html`.

## 3. Add your videos

Place your files here:

- `assets/videos/video-1.mp4`
- `assets/videos/video-2.mp4`

Your original 4K 30fps videos can be used, but large 4K files may load slowly on mobile. For the website, export additional web-friendly MP4 versions using H.264, while keeping the original 4K masters for client delivery.

Suggested web exports:

- 1920 × 1080
- H.264 MP4
- 30fps
- 8–15 Mbps video bitrate
- AAC audio

The HTML uses `preload="metadata"` so videos do not automatically download in full when the page opens.

## 4. Add your contact information

Open `index.html` and replace:

- `hello@avjunki.com`
- `(702) 555-1234`
- `+17025551234`

## 5. Add social media links

Replace `YOURUSERNAME` in the Instagram, Facebook, TikTok, and YouTube URLs.

## 6. Connect the contact form

Create a free form endpoint at Formspree, then replace:

`https://formspree.io/f/YOUR_FORM_ID`

with your real Formspree form URL.

## 7. Connect consultation booking

Replace:

`https://calendly.com/YOURUSERNAME`

with your Calendly, Square Appointments, Acuity, HoneyBook, or other booking link.

## 8. Publish with GitHub Pages

1. Create a new GitHub repository, such as `avjunki`.
2. Upload all files and folders from this package.
3. In the repository, open **Settings**.
4. Select **Pages**.
5. Under deployment source, select the main branch and root folder.
6. Save and wait for the site to publish.

Your first GitHub Pages address will usually look similar to:

`https://YOUR-GITHUB-USERNAME.github.io/avjunki/`

## 9. Connect avjunki.com from Porkbun

After GitHub Pages is publishing:

1. Add your custom domain `avjunki.com` in the GitHub Pages settings.
2. In Porkbun DNS, add the GitHub Pages DNS records shown by GitHub.
3. Add a `CNAME` record for `www` pointing to your GitHub Pages host.
4. Enable HTTPS in GitHub Pages after DNS verification finishes.

GitHub may create a `CNAME` file automatically. If not, create a file named `CNAME` in the website root containing:

`avjunki.com`

## File structure

```text
avjunki-site/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    ├── images/
    │   ├── hero.jpg
    │   ├── photo-1.jpg
    │   ├── photo-2.jpg
    │   ├── dj-1.jpg
    │   ├── video-poster-1.jpg
    │   └── video-poster-2.jpg
    └── videos/
        ├── video-1.mp4
        ├── video-2.mp4
        └── audio-sample.mp3
```
