const video1 = document.getElementById('projectvideo1');
const video2 = document.getElementById('projectvideo2');
const video3 = document.getElementById('projectvideo3');
const hoversing = document.querySelector(".hoversing") || document.createElement("div")


const videolist = [video1, video2, video3];


videolist.filter(Boolean).forEach(function(video){
    video.addEventListener('mouseover', function(){
      
        hoversing.classList.add("active");
    })
    video.addEventListener('mouseout', function() {
      
        hoversing.classList.remove("active");
    })
})



/* (removed: scroll listener for a .autoBlur element that does not exist - it ran on every scroll frame) */


document.addEventListener("DOMContentLoaded", () => {
  // Get elements
  const counter = document.getElementById("counter");
  const progress = document.querySelector(".progress");
  const messages = document.querySelectorAll(".message");
  const markers = document.querySelectorAll(".marker");
  const blocks = document.querySelectorAll(".block");

  // Get connector lines
  const line0to25 = document.getElementById("line-0-25");
  const line25to50 = document.getElementById("line-25-50");
  const line50to75 = document.getElementById("line-50-75");
  const line75to100 = document.getElementById("line-75-100");

  // Get grid elements
  const topRow = document.getElementById("top-row");
  const bottomRow = document.getElementById("bottom-row");
  const leftColumn = document.getElementById("left-column");
  const rightColumn = document.getElementById("right-column");

  // Create pixel grid
  createPixelGrid();

  // Split text using SplitType
  const hasContent = document.querySelector(".content h1") && document.querySelector(".content p");
  const contentTitle = hasContent ? new SplitType(".content h1", { types: "chars" }) : { chars: [] };
  const contentText = hasContent ? new SplitType(".content p", { types: "chars" }) : { chars: [] };

  // Initialize counter animation
  let currentCount = 0;
  let targetCount = 0;
  let lastMessageIndex = 0;

  // Generate pixel grid
  function createPixelGrid() {
    // Generate pixels in rows and columns if needed
    // For a more minimalist approach, we're using full lines instead
  }

  // Animation function for progress
  function animateProgress() {
    const duration = document.documentElement.classList.contains('lite') ? 2 : 4; // loading time (shorter on phones)

    gsap.to(
      {},
      {
        duration: duration,
        onUpdate: updateProgress,
        ease: "power1.inOut"
      }
    );
  }

  // Update progress function
  function updateProgress() {
    // Calculate progress based on timeline progress
    const progress = Math.floor(this.progress() * 100);

    // Update counter target
    targetCount = progress;

    // Update UI
    updateCounter();
    updateProgressBar(progress);
    updateSystemMessages(progress);
    updateConnectorLines(progress);
    updateBlocks(progress);
    updateGridLines(progress);

    // Handle completion
    if (progress >= 100) {
      setTimeout(completeLoading, 800);
    }
  }

  // Update counter with mechanical effect
  function updateCounter() {
    if (currentCount !== targetCount) {
      // Determine step size based on gap
      const gap = targetCount - currentCount;
      const step = gap > 10 ? 2 : 1;

      currentCount =
        gap > 0 ? Math.min(targetCount, currentCount + step) : targetCount;
      counter.textContent = currentCount;

      // If not at target, schedule next update
      if (currentCount !== targetCount) {
        setTimeout(updateCounter, 40);
      }
    }
  }

  // Update progress bar
  function updateProgressBar(progress) {
    document.querySelector(".progress").style.width = `${progress}%`;

    // Update marker opacity based on progress
    markers.forEach((marker) => {
      const position = parseInt(marker.getAttribute("data-position"));
      if (progress >= position) {
        marker.style.opacity = 1;
      } else {
        marker.style.opacity = 0.6;
      }
    });
  }

  // Update connector lines based on progress
  function updateConnectorLines(progress) {
    // Scale connector lines based on progress
    if (progress >= 0) {
      const scale0to25 = Math.min(1, (progress - 0) / 25);
      line0to25.style.transform = `scaleX(${scale0to25})`;
    }

    if (progress >= 25) {
      const scale25to50 = Math.min(1, (progress - 25) / 25);
      line25to50.style.transform = `scaleX(${scale25to50})`;
    }

    if (progress >= 50) {
      const scale50to75 = Math.min(1, (progress - 50) / 25);
      line50to75.style.transform = `scaleX(${scale50to75})`;
    }

    if (progress >= 75) {
      const scale75to100 = Math.min(1, (progress - 75) / 25);
      line75to100.style.transform = `scaleX(${scale75to100})`;
    }
  }

  // Update system messages based on progress
  function updateSystemMessages(progress) {
    let activeIndex = Math.min(4, Math.floor(progress / 20));

    // Only update if changed
    if (activeIndex !== lastMessageIndex) {
      // Hide all messages
      messages.forEach((message) => {
        message.classList.remove("active");
      });

      // Show current message
      messages[activeIndex].classList.add("active");

      // Simulate terminal printing effect
      if (activeIndex < messages.length) {
        simulateTyping(messages[activeIndex]);
      }

      lastMessageIndex = activeIndex;
    }
  }

  // Update blocks based on progress
  function updateBlocks(progress) {
    // Scale blocks based on progress thresholds
    if (progress >= 20) {
      blocks[0].style.transform = `scale(${Math.min(1, (progress - 20) / 20)})`;
    }

    if (progress >= 40) {
      blocks[1].style.transform = `scale(${Math.min(1, (progress - 40) / 20)})`;
    }

    if (progress >= 60) {
      blocks[2].style.transform = `scale(${Math.min(1, (progress - 60) / 20)})`;
    }

    if (progress >= 80) {
      blocks[3].style.transform = `scale(${Math.min(1, (progress - 80) / 20)})`;
    }
  }

  // Update grid lines based on progress
  function updateGridLines(progress) {
    // Extend lines based on progress
    topRow.style.width = `${progress}%`;
    bottomRow.style.width = `${progress}%`;
    leftColumn.style.height = `${progress}%`;
    rightColumn.style.height = `${progress}%`;
  }

  // Simulate typing effect for terminal-like messages
  function simulateTyping(element) {
    const text = element.textContent;
    element.textContent = "";
    element.style.display = "block";

    let i = 0;
    const typeNextChar = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeNextChar, 30);
      }
    };

    typeNextChar();
  }

  // Complete loading animation
  function completeLoading() {
    // Create minimal transition effect
    const completionTl = gsap.timeline();

    completionTl
      // Slide away loader with clean transition
      .to(".preloader", {
        y: "-100%",
        duration: 1,
        ease: "power2.inOut"
      })
      // Show content
      .set(".content", {
        visibility: "visible"
      })
      .to(".content", {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      })
      // Clean reveal of content
      .to([contentTitle.chars, contentText.chars], {
        opacity: 1,
        y: 0,
        stagger: 0.02,
        duration: 0.4,
        ease: "power1.out",
        onStart: () => {
          // Initially position all chars up
          gsap.set([contentTitle.chars, contentText.chars], {
            opacity: 0,
            y: 30
          });
        }
      })
      // Hide preloader
      .set(".preloader", {
        display: "none"
      });
  }

  // Add pixel animation for progress indication
  function animatePixels() {
    // For minimalist approach, we're using grid lines instead
    // This function is kept for potential future enhancements
  }

  // Generate random digits for counter
  function randomDigits() {
    return Math.floor(Math.random() * 100);
  }

  // Start animations
  animateProgress();

  // Handle window resize
  window.addEventListener("resize", () => {
    // Recalculate layout if needed
  });
});


// Mobile menu
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".menu-toggle");
  const nav = document.querySelector("header");
  if (!btn || !nav) return;
  const icon = btn.querySelector("i");
  const close = () => {
    nav.classList.remove("menu-open");
    btn.setAttribute("aria-expanded", "false");
    icon.className = "bx bx-menu";
  };
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("menu-open");
    btn.setAttribute("aria-expanded", open);
    icon.className = open ? "bx bx-x" : "bx bx-menu";
  });
  nav.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", close));
  window.addEventListener("resize", () => { if (window.innerWidth > 800) close(); });
});

// Fade the 3D hero models out once the hero section has been scrolled past
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  if (!hero || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(
    ([entry]) => document.body.classList.toggle("hero-passed", !entry.isIntersecting),
    { threshold: 0.1 }
  ).observe(hero);
});

// ---------- Stats count-up ----------
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".count");
  if (!counters.length || !("IntersectionObserver" in window)) return;
  const animate = (el) => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const start = performance.now(), dur = 1600;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => { c.textContent = (0).toFixed(parseInt(c.dataset.decimals || "0", 10)); io.observe(c); });
});

// ---------- Testimonials carousel ----------
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".rv-track");
  if (!track) return;
  const cards = [...track.children];
  const dotsBox = document.querySelector(".rv-dots");
  const prev = document.querySelector(".rv-prev");
  const next = document.querySelector(".rv-next");
  const gap = () => parseFloat(getComputedStyle(track).columnGap) || 20;
  const step = () => cards[0].getBoundingClientRect().width + gap();
  const perView = () => Math.max(1, Math.round((track.clientWidth + gap()) / step()));
  const pages = () => Math.max(1, cards.length - perView() + 1);
  const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

  const buildDots = () => {
    dotsBox.innerHTML = "";
    for (let i = 0; i < pages(); i++) {
      const d = document.createElement("button");
      d.className = "rv-dot";
      d.setAttribute("aria-label", "Go to review " + (i + 1));
      d.addEventListener("click", () => track.scrollTo({ left: i * step() }));
      dotsBox.appendChild(d);
    }
    update();
  };
  const update = () => {
    const idx = Math.min(pages() - 1, Math.round(track.scrollLeft / step()));
    [...dotsBox.children].forEach((d, i) => d.classList.toggle("active", i === idx));
  };
  const goNext = () => atEnd() ? track.scrollTo({ left: 0 }) : track.scrollBy({ left: step() });
  const goPrev = () => track.scrollLeft <= 4 ? track.scrollTo({ left: track.scrollWidth }) : track.scrollBy({ left: -step() });

  next.addEventListener("click", goNext);
  prev.addEventListener("click", goPrev);
  track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  window.addEventListener("resize", buildDots);
  buildDots();

  // autoplay (pauses on hover / touch / focus, off for reduced-motion users)
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let paused = false, timer = setInterval(() => { if (!paused && !document.hidden) goNext(); }, 5000);
  ["mouseenter", "touchstart", "focusin"].forEach(e => track.addEventListener(e, () => paused = true, { passive: true }));
  ["mouseleave", "touchend", "focusout"].forEach(e => track.addEventListener(e, () => paused = false, { passive: true }));
});

// ---------- Hero typing roles ----------
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("typed");
  if (!el) return;
  const roles = ["WordPress Developer", "MERN Stack Developer", "Full-Stack Developer", "Plugin & Theme Developer", "Problem Solver"];
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = roles[0]; return; }
  let r = 0, c = 0, del = false;
  const tick = () => {
    const word = roles[r];
    el.textContent = word.slice(0, c);
    let wait = del ? 40 : 85;
    if (!del && c === word.length) { del = true; wait = 1600; }
    else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
    else c += del ? -1 : 1;
    setTimeout(tick, wait);
  };
  tick();
});

// ---------- Contact form (AJAX via Formspree) ----------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".ct-form");
  if (!form) return;
  const status = form.querySelector(".ct-status");
  const btn = form.querySelector(".ct-submit");
  const label = btn.querySelector("span");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "ct-status";
    status.textContent = "";
    btn.disabled = true;
    label.textContent = "Sending...";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      status.classList.add("ok");
      status.textContent = "Thank you! Your message has been sent. I'll get back to you soon.";
    } catch (err) {
      status.classList.add("err");
      status.textContent = "Something went wrong. Please try again or email me directly.";
    } finally {
      btn.disabled = false;
      label.textContent = "Send Message";
    }
  });
});
