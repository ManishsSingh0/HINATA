/* ============ CONFIG ============ */
const WHATSAPP_NUMBER = "919540720310";
const WHATSAPP_MESSAGE = "Yes Manish, I Love You Too ❤️";

const IMAGE_URLS = [
  "https://i.postimg.cc/sf4TKwGT/866007503-1692195138996356-5773853509503336623-n.jpg", // Slide 1
  "https://i.postimg.cc/x1MJyFcj/865098618-2219571611955834-5060169211680362755-n.jpg", // Slide 2
  "https://i.postimg.cc/pTJ0f1xd/863464660-1514047337307336-2074823657195315837-n.jpg", // Slide 3
  "https://i.postimg.cc/vHBPnzNr/865739076-39535019246144286-5781591528587842343-n.jpg", // Slide 4
  "https://i.postimg.cc/6q1fckmg/870061663-1100701819380653-5780735331891934804-n.jpg", // Slide 5
  "https://i.postimg.cc/RFg7Vr4C/870110765-942593578679022-3018874176704757330-n.jpg", // Slide 6
  "https://i.postimg.cc/cHk3GQBR/870174761-1843804199963483-942000282022363423-n.jpg", // Slide 7
  "https://i.postimg.cc/rp8Rdhh8/870862989-1422545073353898-3338187734029312856-n.jpg", // Slide 8
  "https://i.postimg.cc/9f8Pc5WZ/867652086-1612914929824526-1657456772981235140-n.jpg", // Slide 9
  "https://i.postimg.cc/FztLKhwK/868220972-2229236741274504-812061343381315191-n.jpg"   // Slide 10
];

/* Preload images */
IMAGE_URLS.forEach(url => { new Image().src = url; });

/* ============ WHATSAPP ============ */
const waBtn = document.getElementById("waBtn");
if (waBtn) {
  waBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}

/* ============ MUSIC (no button) ============ */
const bgMusic = document.getElementById("bgMusic");
let musicStarted = false;

function startMusic() {
  if (!bgMusic || musicStarted) return;
  bgMusic.volume = 0.35;
  bgMusic.play().then(() => {
    musicStarted = true;
  }).catch(() => {});
}

function firstInteraction() {
  startMusic();
  document.removeEventListener("click", firstInteraction);
  document.removeEventListener("touchstart", firstInteraction);
}
document.addEventListener("click", firstInteraction);
document.addEventListener("touchstart", firstInteraction);

/* ============ CAROUSEL ============ */
let progress = 0;
let startX = 0;
let active = 0;
let isDown = false;
let hasDragged = false;
let hintHidden = false;

const speedWheel = 0.02;
const speedDrag = -0.1;

const getZindex = (arr, idx) =>
  arr.map((_, i) => idx === i ? arr.length : arr.length - Math.abs(idx - i));

const $items = document.querySelectorAll(".carousel-item");
const $cursors = document.querySelectorAll(".cursor");
const hintEl = document.getElementById("carouselHint");

function displayItems(item, index, active) {
  const zIndex = getZindex([...$items], active)[index];
  item.style.setProperty("--zIndex", zIndex);
  item.style.setProperty("--active", (index - active) / $items.length);
}

function animate() {
  progress = Math.max(0, Math.min(progress, 100));
  active = Math.floor((progress / 100) * ($items.length - 1));
  $items.forEach((it, i) => displayItems(it, i, active));
  if (active > 0) hideHint();
}
animate();

function hideHint() {
  if (!hintEl || hintHidden) return;
  hintHidden = true;
  hintEl.classList.add("hidden");
  setTimeout(() => hintEl.style.display = "none", 500);
}
setTimeout(hideHint, 6000);

/* Click */
$items.forEach((item, i) => {
  item.addEventListener("click", () => {
    if (hasDragged) return;
    progress = (i / ($items.length - 1)) * 100;
    animate();
  });
});

/* Wheel */
function handleWheel(e) {
  if (e.target.closest(".slider-container")) return;
  progress += e.deltaY * speedWheel;
  animate();
  hideHint();
}

/* Mouse/Touch */
function handleMove(e) {
  if (e.type === "mousemove") {
    $cursors.forEach(c => {
      c.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }
  if (!isDown) return;
  if (e.target.closest(".slider-container")) return;
  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  const delta = x - startX;
  if (Math.abs(delta) > 3) hasDragged = true;
  progress += delta * speedDrag;
  startX = x;
  animate();
  hideHint();
}

function handleDown(e) {
  if (e.target.closest(".slider-container")) return;
  isDown = true;
  hasDragged = false;
  startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  hideHint();
}

function handleUp() {
  isDown = false;
  setTimeout(() => hasDragged = false, 50);
}

document.addEventListener("wheel", handleWheel, { passive: true });
document.addEventListener("mousedown", handleDown);
document.addEventListener("mousemove", handleMove);
document.addEventListener("mouseup", handleUp);
document.addEventListener("touchstart", handleDown, { passive: true });
document.addEventListener("touchmove", handleMove, { passive: true });
document.addEventListener("touchend", handleUp);

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") { progress += 5; animate(); hideHint(); }
  if (e.key === "ArrowLeft") { progress -= 5; animate(); hideHint(); }
});

/* ============ SLIDER ============ */
let proposalShown = false;

function checkSlider() {
  const slider = document.getElementById("loveSlider");
  const heart = document.querySelector(".slider-heart");
  const val = slider.value;
  heart.style.left = `calc(${val}% - 10px)`;

  if (val > 95 && !proposalShown) {
    proposalShown = true;
    if (navigator.vibrate) navigator.vibrate(30);
    const screen = document.getElementById("proposal-screen");
    screen.style.display = "flex";
    setTimeout(() => screen.style.opacity = "1", 50);
    document.querySelector(".carousel").style.pointerEvents = "none";
  }
}

/* ============ YES ============ */
function sheSaidYes() {
  document.querySelector(".content").style.display = "none";
  document.getElementById("celebration").style.display = "block";
  document.getElementById("proposal-screen").style.background =
    "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)";
  if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 50]);
  createFlowers();
}

/* ============ NO (prank) ============ */
let noCount = 0;

function moveNoButton(e) {
  if (e) e.preventDefault();
  noCount++;
  const btn = document.querySelector(".no-btn");

  if (noCount === 4) btn.textContent = "Bhaag kahan? 😂";
  else if (noCount === 7) btn.textContent = "Chhod de, YES daba 😅";
  else if (noCount === 9) btn.textContent = "Ab toh YES hi dabega 🤭";
  else if (noCount >= 11) { btn.style.display = "none"; return; }

  const maxX = window.innerWidth - btn.offsetWidth - 20;
  const maxY = window.innerHeight - btn.offsetHeight - 20;
  btn.style.position = "fixed";
  btn.style.left = Math.max(20, Math.random() * maxX) + "px";
  btn.style.top = Math.max(20, Math.random() * maxY) + "px";
}

const noBtn = document.querySelector(".no-btn");
if (noBtn) {
  noBtn.addEventListener("mouseover", moveNoButton);
  noBtn.addEventListener("touchstart", moveNoButton, { passive: false });
}

/* ============ FLOWERS ============ */
let flowerInt = null;

function createFlowers() {
  if (flowerInt) return;
  const flowers = ["🌸", "🌹", "🌺", "💖", "😍", "🦋"];
  const container = document.getElementById("proposal-screen");
  for (let i = 0; i < 15; i++) spawnFlower(flowers, container);
  flowerInt = setInterval(() => spawnFlower(flowers, container), 500);
}

function spawnFlower(flowers, container) {
  const f = document.createElement("div");
  f.classList.add("flower");
  f.innerText = flowers[Math.floor(Math.random() * flowers.length)];
  f.style.left = Math.random() * 100 + "vw";
  f.style.animationDuration = (Math.random() * 3 + 2) + "s";
  f.style.fontSize = (Math.random() * 20 + 20) + "px";
  container.appendChild(f);
  setTimeout(() => f.remove(), 5000);
}