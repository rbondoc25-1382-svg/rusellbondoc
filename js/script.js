const startBtn = document.getElementById("start-btn");

if (startBtn) {
  startBtn.addEventListener("click", () => {
    const loaderContainer = document.getElementById("loader-container");
    const loaderBar = document.getElementById("loader-bar");
    const splash = document.getElementById("splash-screen");
    const main = document.getElementById("main-website");

    startBtn.style.display = "none";
    if (loaderContainer) loaderContainer.style.display = "block";
    if (loaderBar) loaderBar.classList.add("animate");

    setTimeout(() => {
      if (splash) {
        splash.style.opacity = "0";
        splash.style.transition = "opacity 0.6s ease";
      }

      setTimeout(() => {
        if (splash) splash.style.display = "none";
        if (main) main.style.display = "block";
      }, 600);

    }, 2200);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const badgeStage = document.querySelector(".badge-stage");
  if (!badgeStage) return;

  let isDragging = false;
  let startX, startY;
  
  let currentRotX = 12;
  let currentRotY = -18;
  let targetRotX = 12;
  let targetRotY = -18;
  let time = 0;
  let hasDroppedIn = false;

  setTimeout(() => {
    hasDroppedIn = true;
    badgeStage.style.animation = "none"; 
  }, 1200);

  function animate() {
    time += 0.04;

    if (hasDroppedIn && !isDragging) {
      const autoSwayX = Math.sin(time * 0.9) * 2.5;
      const autoSwayY = Math.cos(time * 0.6) * 4;
      const autoSwayZ = Math.sin(time * 0.7) * 1.5;

      currentRotX += (targetRotX + autoSwayX - currentRotX) * 0.1;
      currentRotY += (targetRotY + autoSwayY - currentRotY) * 0.1;

      badgeStage.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg) rotateZ(${autoSwayZ}deg)`;
    }

    requestAnimationFrame(animate);
  }

  animate();

  document.addEventListener("mousemove", (e) => {
    if (!hasDroppedIn || isDragging) return;

    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    targetRotY = mouseX * 22;
    targetRotX = -mouseY * 22;
  });

  badgeStage.addEventListener("mousedown", (e) => {
    if (!hasDroppedIn) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    badgeStage.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    currentRotY += deltaX * 0.4;
    currentRotX -= deltaY * 0.4;

    currentRotX = Math.max(-35, Math.min(35, currentRotX));
    currentRotY = Math.max(-45, Math.min(45, currentRotY));

    targetRotX = currentRotX;
    targetRotY = currentRotY;

    badgeStage.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;

    startX = e.clientX;
    startY = e.clientY;
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      badgeStage.style.cursor = "grab";
    }
  });
});

let spacePaused = false; // true while the video modal is open
const canvas = document.getElementById('space-bg');
const ctx = canvas ? canvas.getContext('2d') : null;

let width, height;
let stars = [];
let meteors = [];

function resizeCanvas() {
  if (!canvas) return;
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// STAR CREATION 
class Star {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random();
    this.speed = Math.random() * 0.02 + 0.005;
  }

  update() {
    this.alpha += this.speed;
    if (this.alpha > 1 || this.alpha < 0) {
      this.speed = -this.speed;
    }
  }

  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(this.alpha)})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 150; i++) {
  stars.push(new Star());
}

//  METEOR PART
class Meteor {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width + 200;
    this.y = -50;
    this.length = Math.random() * 80 + 50;
    this.speed = Math.random() * 8 + 4;
    this.size = Math.random() * 1 + 1;
    this.alpha = 1;
  }

  update() {
    this.x -= this.speed;
    this.y += this.speed;

    if (this.x < -100 || this.y > height + 100) {
      this.reset();
    }
  }

  draw() {
    const headX = this.x;
    const headY = this.y;
    const tailX = this.x + this.length;
    const tailY = this.y - this.length;

    const gradient = ctx.createLinearGradient(headX, headY, tailX, tailY);
    gradient.addColorStop(0, 'rgba(0, 183, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(0, 183, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 183, 255, 0)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = this.size;
    ctx.beginPath();
    ctx.moveTo(headX, headY);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();
  }
}

for (let i = 0; i < 3; i++) {
  meteors.push(new Meteor());
}

//  ANIMATION LOOP 
function animateSpace() {
  if (!spacePaused && !document.hidden) {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      star.update();
      star.draw();
    });

    meteors.forEach(meteor => {
      meteor.update();
      meteor.draw();
    });
  }

  requestAnimationFrame(animateSpace);
}

if (canvas) animateSpace();

const slides = document.querySelectorAll('.photo-slider .slide');
let currentSlide = 0;

function nextSlide() {
  if (slides.length > 0) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }
}

if (slides.length > 0) {
  setInterval(nextSlide, 3000);
}

//  LOOPING TYPEWRITER 
const words = ["Information System - Student", "Full Time Lazy", "Aspiring Sleeper"];
let i = 0;
let timer;

function typingEffect() {
  const typedElement = document.getElementById('typed-subtitle');
  if (!typedElement) return;

  const currentWord = words[i];
  let charIndex = 0;

  function type() {
    if (charIndex <= currentWord.length) {
      typedElement.textContent = currentWord.substring(0, charIndex);
      charIndex++;
      timer = setTimeout(type, 100);
    } else {
      timer = setTimeout(erase, 2000);
    }
  }

  function erase() {
    if (charIndex >= 0) {
      typedElement.textContent = currentWord.substring(0, charIndex);
      charIndex--;
      timer = setTimeout(erase, 50);
    } else {
      i = (i + 1) % words.length;
      timer = setTimeout(typingEffect, 500);
    }
  }

  type();
}

window.addEventListener('DOMContentLoaded', () => {
  typingEffect();
});

// BACKGROUND HOVER & VIDEO MODAL
const gridCards = document.querySelectorAll('.grid-card');
const dynamicBg = document.getElementById('dynamic-bg');
const previewTitle = document.getElementById('hobby-title');
const previewDesc = document.getElementById('hobby-desc');

const videoModal = document.getElementById('video-modal');
const modalVideoPlayer = document.getElementById('modal-video-player');
const closeModalBtn = document.getElementById('close-modal');

gridCards.forEach(card => {
  // Change Background Image & Text details
  card.addEventListener('mouseenter', () => {
    const bgUrl = card.getAttribute('data-bg');
    const title = card.getAttribute('data-title');
    const desc = card.getAttribute('data-desc');

    if (bgUrl && dynamicBg) {
      dynamicBg.style.backgroundImage = `url('${bgUrl}')`;
      dynamicBg.classList.add('active');
    }

    if (title && previewTitle) previewTitle.textContent = title;
    if (desc && previewDesc) previewDesc.textContent = desc;
  });

  card.addEventListener('mouseleave', () => {
    if (dynamicBg) dynamicBg.classList.remove('active');
  });

  //  Open Video Player Model
  card.addEventListener('click', () => {
    const videoUrl = card.getAttribute('data-video');

    if (videoUrl && modalVideoPlayer && videoModal) {
      // set src on <video> itself
      modalVideoPlayer.src = videoUrl;
      videoModal.classList.add('open');
      spacePaused = true;
      modalVideoPlayer.play().catch(err => console.log("Playback error:", err));
    }
  });
});

// CLOSE VIDEO MODEL 
function closeVideo() {
  if (videoModal) {
    videoModal.classList.remove('open');
  }
  spacePaused = false;
  if (modalVideoPlayer) {
    modalVideoPlayer.pause();
    modalVideoPlayer.removeAttribute('src');
    modalVideoPlayer.load(); // releases the file
  }
}

if (modalVideoPlayer) {
  modalVideoPlayer.addEventListener('error', () => {
    if (modalVideoPlayer.getAttribute('src')) {
      console.log('Video failed:', modalVideoPlayer.src, 'error code:', modalVideoPlayer.error && modalVideoPlayer.error.code);
    }
  });
}

// Connect the Close Button
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeVideo);
}

//  Close when clicking outside the video box
if (videoModal) {
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      closeVideo();
    }
  });
}

// Press the 'Escape' key to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoModal && videoModal.classList.contains('open')) {
    closeVideo();
  }
});