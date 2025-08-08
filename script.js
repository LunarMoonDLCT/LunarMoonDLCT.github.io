window.onload = () => {
  const music = document.getElementById("bg-music");
  const toggleBtn = document.getElementById("toggle-sound");
  const credit = document.getElementById("music-credit");
  const volumeSlider = document.getElementById("volume-slider");
  const volumeLabel = document.getElementById("volume-label");
  const container = document.querySelector(".container");
  const intro = document.getElementById("intro-screen");
  const navBar = document.querySelector(".nav-bar");

  let isMuted = false;
  let lastVolume = 1;

  const updateVolumeDisplay = (val) => {
    const percent = Math.round(val * 100);
    volumeLabel.textContent = `${percent}%`;
  };

  volumeSlider.addEventListener("input", () => {
    const vol = parseFloat(volumeSlider.value);
    music.volume = vol;
    updateVolumeDisplay(vol);

    if (vol === 0) {
      isMuted = true;
      toggleBtn.firstChild.textContent = "🔇";
    } else {
      isMuted = false;
      lastVolume = vol;
      toggleBtn.firstChild.textContent = "🔊";
    }
  });

  toggleBtn.addEventListener("click", (event) => {
    if (event.target.closest("#sound-control")) return;

    if (isMuted) {
      music.muted = false;
      music.volume = lastVolume;
      volumeSlider.value = lastVolume;
      updateVolumeDisplay(lastVolume);
      toggleBtn.firstChild.textContent = "🔊";
      isMuted = false;
    } else {
      music.muted = true;
      lastVolume = music.volume;
      music.volume = 0;
      volumeSlider.value = 0;
      updateVolumeDisplay(0);
      toggleBtn.firstChild.textContent = "🔇";
      isMuted = true;
    }
  });

  document.addEventListener("click", () => {
    intro.classList.add("fade-out");

    setTimeout(() => {
      intro.style.display = "none";
      container.style.display = "block";
      toggleBtn.style.display = "flex";
      credit.style.display = "block";

      navBar.style.display = "flex";
      navBar.style.opacity = 0;
      navBar.style.transform = "translateY(-20px)";
      navBar.style.transition = "all 0.6s ease-out";

      setTimeout(() => {
        navBar.style.opacity = 1;
        navBar.style.transform = "translateY(0)";

        const navBtns = navBar.querySelectorAll(".nav-btn");
        navBtns.forEach((btn, index) => {
          btn.style.opacity = 0;
          btn.style.transform = "translateY(-10px)";
          btn.style.animation = `fadeInNavBtn 0.5s ease forwards`;
          btn.style.animationDelay = `${0.8 + index * 0.2}s`;
        });
      }, 50);

      music.currentTime = 0;
      const playPromise = music.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          console.warn("Autoplay bị chặn:", e);
        });
      }

      container.style.opacity = 0;
      container.style.transform = "translateY(30px)";
      setTimeout(() => {
        container.style.transition = "all 0.6s ease-out";
        container.style.opacity = 1;
        container.style.transform = "translateY(0)";
      }, 50);

      setTimeout(() => {
        credit.style.display = "block";
        credit.classList.add("show");

        const creditClose = document.getElementById("credit-close");

        let autoHide = setTimeout(() => {
          credit.classList.remove("show");
        }, 5000);

        creditClose.onclick = () => {
          clearTimeout(autoHide);
          credit.classList.remove("show");
        };
      }, 1000);
    }, 500);
  }, { once: true });

  const navButtons = document.querySelectorAll(".nav-btn");
  const aboutSection = document.getElementById("about");
  const socialsSection = document.getElementById("socials");

  aboutSection.classList.add("active");
  aboutSection.style.display = "block";
  socialsSection.style.display = "none";

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const showSection = btn.dataset.target === "about" ? aboutSection : socialsSection;
      const hideSection = btn.dataset.target === "about" ? socialsSection : aboutSection;

      showSection.style.display = "block";
      requestAnimationFrame(() => {
        showSection.classList.add("active");
      });

      hideSection.classList.remove("active");
\
      setTimeout(() => {
        hideSection.style.display = "none";
      }, 400);
    });
  });

  const canvas = document.getElementById("space-bg");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const stars = [];
  const starCount = 300;

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.4 + 0.2
    });
  }

  let offsetX = 0;
  let offsetY = 0;

  document.addEventListener("mousemove", (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const maxOffset = 30;

    offsetX = ((e.clientX - centerX) / centerX) * maxOffset;
    offsetY = ((e.clientY - centerY) / centerY) * maxOffset;
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }

      const parallaxX = star.x + offsetX * (star.radius / 2);
      const parallaxY = star.y + offsetY * (star.radius / 2);

      ctx.beginPath();
      ctx.arc(parallaxX, parallaxY, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
};

let devUnlocked = false;
const keysPressed = new Set();

document.addEventListener("keydown", (e) => {
  keysPressed.add(e.key.toLowerCase());

  const ctrlHeld = e.ctrlKey;
  const d = keysPressed.has("d");
  const eKey = keysPressed.has("e");
  const v = keysPressed.has("v");

  if (ctrlHeld && d && eKey && v) {
    devUnlocked = true;
    console.log("✅ DevTools UNLOCKED");
  }

  if (e.key === "F12" && !devUnlocked) {
    e.preventDefault();
  }

  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i" && !devUnlocked) {
    e.preventDefault();
  }
});

document.addEventListener("keyup", (e) => {
  keysPressed.delete(e.key.toLowerCase());
});

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

document.querySelectorAll("img").forEach(img => {
  img.addEventListener("dragstart", e => e.preventDefault());
});
