let stars = document.getElementById("stars");
let moon = document.getElementById("moon");
let mountains_behind = document.getElementById("mountains_behind");
let mountains_front = document.getElementById("mountains_front");
let text = document.getElementById("text");
let btn = document.getElementById("btn");
let header = document.querySelector("header");

window.addEventListener("scroll", () => {
  let value = window.scrollY;
  stars.style.left = value * 0.5 + "px";
  moon.style.top = value * 0.5 + "px";
  mountains_behind.style.top = value * 0.5 + "px";
  mountains_front.style.top = value * 0 + "px";
  text.style.marginRight = value * 3 + "px";
  text.style.marginTop = value * 0.75 + "px";
  btn.style.marginTop = value * 0.75 + "px";
  header.style.top = value * 0.5 + "px";
});

document.getElementById('btn').addEventListener('click', function(e) {
  e.preventDefault();

  const target = document.getElementById('sec');
  const targetPosition = target.getBoundingClientRect().top + window.scrollY;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 3000; // 3 seconds
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percent = Math.min(progress / duration, 1);
    window.scrollTo(0, startPosition + distance * percent);
    if (progress < duration) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
});
