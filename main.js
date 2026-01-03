/* ===================================================
   1. Animated Neural Network Background
=================================================== */
const canvas = document.getElementById("bg-network");
const ctx = canvas.getContext("2d");

let w, h, particles;
let parallaxX = 0,
  parallaxY = 0;

function init() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;

  particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
  }));
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  const offsetX = parallaxX * 0.05;
  const offsetY = parallaxY * 0.05;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x + offsetX, p.y + offsetY, 1.6, 0, 2 * Math.PI);
    ctx.fillStyle = "#2c98f0";
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.strokeStyle = `rgba(102,217,232,${1 - dist / 120})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p.x + offsetX, p.y + offsetY);
        ctx.lineTo(p2.x + offsetX, p2.y + offsetY);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}

window.addEventListener("mousemove", (e) => {
  const x = e.clientX - w / 2;
  const y = e.clientY - h / 2;
  parallaxX += (x - parallaxX) * 0.02;
  parallaxY += (y - parallaxY) * 0.02;
});

window.addEventListener("resize", init);
init();
draw();

/* ===================================================
   2. Navigation & Smooth Scroll
=================================================== */
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll("ul.nav-links a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    navLinks.classList.remove("active");
    document
      .querySelector(link.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

/* ===================================================
   3. Back to Top Button
=================================================== */
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  backToTopBtn.style.display = window.pageYOffset > 300 ? "block" : "none";
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

backToTopBtn.style.display = "none";

/* ===================================================
   4. 3D Model Loader Animation
=================================================== */
const modelViewer = document.getElementById("brain-model");
const loader = document.getElementById("model-loader");
const loadingText = document.getElementById("loading-text");
const progressCircle = document.querySelector(".progress-ring-circle");

const radius = 50;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = `${circumference}`;
progressCircle.style.strokeDashoffset = `${circumference}`;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  progressCircle.style.strokeDashoffset = offset;
  loadingText.textContent = `${percent}%`;
}

// Fake loading progress (visual appeal)
let progress = 0;
const fakeProgress = setInterval(() => {
  if (progress < 90) {
    progress += Math.random() * 8;
    setProgress(Math.min(Math.round(progress), 90));
  }
}, 250);

modelViewer.addEventListener("load", () => {
  clearInterval(fakeProgress);
  let finishProgress = 90;

  const smoothFinish = setInterval(() => {
    finishProgress += 2;
    setProgress(Math.min(finishProgress, 100));
    if (finishProgress >= 100) clearInterval(smoothFinish);
  }, 80);

  modelViewer.style.display = "block";
  requestAnimationFrame(() => {
    setTimeout(() => {
      loader.style.transition = "opacity 0.6s ease";
      loader.style.opacity = 0;

      setTimeout(() => {
        loader.style.display = "none";
        modelViewer.classList.add("visible");

        const hint = document.getElementById("interaction-hint");
        setTimeout(() => {
          hint.style.animation = "fadeInHint 1s ease forwards";
        }, 800);
        // setTimeout(() => {
        //   hint.style.animation = "fadeOutHint 1s ease forwards";
        // }, 7000);
      }, 500);
    }, 300);
  });
});

// Fallback in case the model never triggers "load"
setTimeout(() => {
  if (progress < 100) {
    setProgress(100);
    loader.style.opacity = 0;
    loader.style.display = "none";
    modelViewer.style.display = "block";
    modelViewer.classList.add("visible");
  }
}, 10000);

/* ===================================================
   5. Fullscreen Panels (Education & Experience)
=================================================== */
const eduCard = document.querySelector(".journey-card.education");
const eduFullscreen = document.getElementById("education-fullscreen");
const closeEdu = document.getElementById("close-education");

const expCard = document.querySelector(".journey-card.experience");
const expFullscreen = document.getElementById("experience-fullscreen");
const closeExp = document.getElementById("close-experience");

eduCard.addEventListener("click", () => {
  eduFullscreen.style.display = "flex";
  setTimeout(() => eduFullscreen.classList.add("active"), 10);
});

closeEdu.addEventListener("click", () => {
  eduFullscreen.classList.remove("active");
  setTimeout(() => {
    eduFullscreen.style.display = "none";
  }, 400);
});

expCard.addEventListener("click", () => {
  expFullscreen.style.display = "flex";
  setTimeout(() => expFullscreen.classList.add("active"), 10);
});

closeExp.addEventListener("click", () => {
  expFullscreen.classList.remove("active");
  setTimeout(() => {
    expFullscreen.style.display = "none";
  }, 400);
});

/* ===================================================
   6. Project Fullscreen Panels
=================================================== */
const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach(card => {
  card.addEventListener("click", () => {
    const projectId = card.dataset.project;
    const panel = document.getElementById(`project-${projectId}`);

    if (!panel) return;

    panel.style.display = "flex";
    setTimeout(() => panel.classList.add("active"), 10);

    const closeBtn = panel.querySelector(".back-btn");
    closeBtn.onclick = () => {
      panel.classList.remove("active");
      setTimeout(() => {
        panel.style.display = "none";
      }, 400);
    };
  });
});

/* ===================================================
   7. Achievements Fullscreen Panel
=================================================== */
const achievementsCard = document.querySelector(".journey-card.awards");
const achievementsFullscreen = document.getElementById("achievements-fullscreen");
const closeAchievements = document.getElementById("close-achievements");

if (achievementsCard && achievementsFullscreen && closeAchievements) {
  achievementsCard.addEventListener("click", () => {
    achievementsFullscreen.style.display = "flex";
    setTimeout(() => achievementsFullscreen.classList.add("active"), 10);
  });

  closeAchievements.addEventListener("click", () => {
    achievementsFullscreen.classList.remove("active");
    setTimeout(() => {
      achievementsFullscreen.style.display = "none";
    }, 400);
  });
}

/* ===================================================
   Scroll Cue Fade Out
=================================================== */

const scrollCue = document.querySelector(".scroll-cue");

window.addEventListener("scroll", () => {
  if (window.scrollY > 120 && scrollCue) {
    scrollCue.style.opacity = "0";
  }
});

const toggleBtn = document.getElementById("toggle-other-exp");
const otherExp = document.getElementById("other-experience");

toggleBtn.addEventListener("click", () => {
  const isHidden = otherExp.style.display === "none";

  otherExp.style.display = isHidden ? "block" : "none";
  toggleBtn.textContent = isHidden
    ? "⬆ Hide Other Work Experience"
    : "👥 View Other Work Experience";
});

// ================================
// EMAILJS CONTACT FORM HANDLER
// ================================

(function () {
  emailjs.init("QAn2yE_DKgruVa590"); // <-- from EmailJS dashboard
})();

const contactForm = document.querySelector("#contact form");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // --------------------
  // Email validation
  // --------------------
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    alert("❌ Incorrect email address");
    return;
  }

  if (!name || !message) {
    alert("❌ Please fill in all fields");
    return;
  }

  // --------------------
  // Send email via EmailJS
  // --------------------
  emailjs
    .send(
      "service_rmxhyyi",
      "template_cw3f92c",
      {
        name: name,
        email: email,
        message: message,
        time: new Date().toLocaleString()
      }
    )
    .then(
      function () {
        alert("✅ Message sent successfully!");
        contactForm.reset();
      },
      function (error) {
        console.error("EmailJS error:", error);
        alert("❌ Failed to send message. Please try again later.");
      }
    );
});



// /* ===================================================
//    8. Hobbies Fullscreen Panel
// =================================================== */
// const hobbiesCard = document.querySelector(".journey-card.hobbies");
// const hobbiesFullscreen = document.getElementById("hobbies-fullscreen");
// const closeHobbies = document.getElementById("close-hobbies");

// if (hobbiesCard && hobbiesFullscreen && closeHobbies) {
//   hobbiesCard.addEventListener("click", () => {
//     hobbiesFullscreen.style.display = "flex";
//     setTimeout(() => hobbiesFullscreen.classList.add("active"), 10);
//   });

//   closeHobbies.addEventListener("click", () => {
//     hobbiesFullscreen.classList.remove("active");
//     setTimeout(() => {
//       hobbiesFullscreen.style.display = "none";
//     }, 400);
//   });
// }


/* ===================================================
   END OF SCRIPT
=================================================== */
