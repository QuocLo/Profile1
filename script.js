const CONFIG = {
  name: "Hoàng Anh Quốc",
  avatar: "avatar.png",
  bio: "Mai Sờ Name: Hoàng Anh Quốc — thích bú thuốc lào, xaolon, chơi game, lướt mạng và nghe nhạc, chán chán làm ván valor, buồn vì chưa giàu 😿.",
  email: "anhquoc30406@gmail.com",
  socials: {
    facebook: "https://m.facebook.com/Mr.chicken36/",
    tiktok: "https://www.tiktok.com/@bowmwp311?lang=vi-VN",
    github: "https://github.com/Quoclo"
  },
  games: [
    { key: "valorant", name: "Valorant", color1: "#ff4655", color2: "#ff8a8a", id: "Mất Tích" },
    { key: "lmht", name: "Liên Minh Huyền Thoại", color1: "#ffcc33", color2: "#ff9f00", id: "Tay2VúMồmBúLôzEm #9872" },
    { key: "pubg", name: "PUBG", color1: "#2b8cff", color2: "#1c3d7a", id: "" },
    { key: "lienquan", name: "Liên Quân", color1: "#00c6a7", color2: "#007b5f", id: "<i>ʙoωмྂ</i>" },
    { key: "delta", name: "Delta Force", color1: "#9e59ff", color2: "#5b0dd6", id: "" }
  ],
  snow: { enabled: true, count: 160 },
  glow: { enabled: true },
  musicFile: "music.mp3.m4a"
};

(function() {
  const $ = s => document.querySelector(s);
  const el = (t, a = {}, txt = "") => {
    const e = document.createElement(t);
    for (const k in a) e.setAttribute(k, a[k]);
    if (txt) e.textContent = txt;
    return e;
  };
  const showToast = msg => {
    const t = $("#toast");
    t.textContent = msg;
    t.style.display = "block";
    t.style.opacity = "1";
    clearTimeout(t._to);
    t._to = setTimeout(() => { t.style.opacity = '0'; }, 1800);
    setTimeout(() => t.style.display = 'none', 2200);
  };

  // Populate UI
  $("#displayName").innerText = CONFIG.name;
  $("#subtitle").innerText = "Profile • Mr_Chicken";
  $("#bioText").innerText = CONFIG.bio;
  $("#sideName").innerText = CONFIG.name;
  $("#sideBio").innerText = CONFIG.bio;

  // Avatar
  const avatarBox = $("#avatarBox");
  const img = new Image();
  img.src = CONFIG.avatar;
  img.alt = CONFIG.name + " avatar";
  img.onload = () => { avatarBox.innerHTML = ''; avatarBox.appendChild(img); };
  img.onerror = () => {
    avatarBox.innerHTML = '';
    const initials = CONFIG.name.split(' ').map(s => s[0]).slice(0, 2).join('');
    const f = el('div', {}, initials);
    f.style.fontWeight = '900';
    f.style.fontSize = '30px';
    f.style.color = 'white';
    f.style.width = '100%';
    f.style.textAlign = 'center';
    avatarBox.appendChild(f);
  };

  // Socials
  const socialsRoot = $("#socialsRow");
  const icons = { facebook: '📘', tiktok: '🎵', github: '🐙' };
  for (const k in CONFIG.socials) {
    const platformName = k.charAt(0).toUpperCase() + k.slice(1);
    const a = el('a', {
        href: CONFIG.socials[k] || '#',
        target: '_blank',
        class: 'social-btn',
        'aria-label': `Link tới trang ${platformName} của tôi`
    });
    a.innerHTML = `${icons[k] || '🔗'} <span style="opacity:0.9">${platformName}</span>`;
    socialsRoot.appendChild(a);
  }

  // Games
  const gamesRoot = $("#gamesList");
  CONFIG.games.forEach(g => {
    const card = el('div', { class: 'game' });
    const icon = el('div', { class: 'icon' }, '');
    icon.style.background = `linear-gradient(135deg,${g.color1},${g.color2})`;
    icon.textContent = g.name.split(' ').map(x => x[0]).slice(0, 2).join('');
    const info = document.createElement('div');
    info.className = "info";
    info.innerHTML = `<div style="font-weight:900">${g.name}</div><div class="sub">${g.id || 'ID: "Mr_Chicken"'}</div>`;
    card.appendChild(icon);
    card.appendChild(info);
    gamesRoot.appendChild(card);
  });

  // Music
  const music = new Audio(CONFIG.musicFile);
  music.loop = true;
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  // Resume AudioContext on the first user interaction
  const resumeAudio = () => {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    document.removeEventListener('click', resumeAudio);
    document.removeEventListener('keydown', resumeAudio);
  };
  document.addEventListener('click', resumeAudio);
  document.addEventListener('keydown', resumeAudio);

  const src = audioCtx.createMediaElementSource(music);
  const analyser = audioCtx.createAnalyser();
  src.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 64;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  $("#musicToggleBtn").addEventListener('click', () => {
    if (music.paused) {
      music.play().catch(e => console.error("Music play failed:", e));
      showToast("Music ON");
    } else {
      music.pause();
      showToast("Music OFF");
    }
  });

  // Copy email
  $("#copyEmailBtn").addEventListener('click', () => {
    navigator.clipboard?.writeText(CONFIG.email || "").then(() => showToast("Email copied")).catch(() => prompt("Email:", CONFIG.email));
  });
  // Share profile
  $("#hireBtn").addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({ title: CONFIG.name, text: 'Check this profile', url: location.href }).catch(() => showToast('Share cancelled'));
    } else {
      navigator.clipboard?.writeText(location.href).then(() => showToast("Profile link copied"));
    }
  });

  // Side links
  $("#linkGithub").href = CONFIG.socials.github || '#';
  $("#linkFb").href = CONFIG.socials.facebook || '#';
  $("#linkTt").href = CONFIG.socials.tiktok || '#';

  // Toggle snow/glow
  $("#toggleSnowBtn").addEventListener('click', () => { CONFIG.snow.enabled = !CONFIG.snow.enabled; $("#toggleSnowBtn").innerText = `Snow: ${CONFIG.snow.enabled ? 'ON' : 'OFF'}`; });
  $("#toggleGlowBtn").addEventListener('click', () => { CONFIG.glow.enabled = !CONFIG.glow.enabled; $("#toggleGlowBtn").innerText = `Glow: ${CONFIG.glow.enabled ? 'ON' : 'OFF'}`; });

  // Canvas setup
  const canvases = {
    snow: $("#snowCanvas"),
    particles: $("#particlesCanvas"),
    visualizer: $("#visualizerCanvas"),
    parallax: $("#parallaxCanvas")
  };
  const ctx = {
    snow: canvases.snow.getContext('2d'),
    particles: canvases.particles.getContext('2d'),
    visualizer: canvases.visualizer.getContext('2d'),
    parallax: canvases.parallax.getContext('2d')
  };

  function resizeAllCanvases() {
    for (const key in canvases) {
      canvases[key].width = window.innerWidth;
      canvases[key].height = window.innerHeight;
    }
    initSnow();
    initParticles();
    initParallax();
  }
  window.addEventListener('resize', resizeAllCanvases);

  // Snow
  let flakes = [];
  function initSnow() {
    flakes = [];
    const n = Math.max(60, Math.min(420, CONFIG.snow.count || 160));
    for (let i = 0; i < n; i++) {
      flakes.push({ x: Math.random() * canvases.snow.width, y: Math.random() * canvases.snow.height, r: Math.random() * 2.8 + 0.8, d: (Math.random() * 0.9) + 0.1, swayOffset: Math.random() * 1000 });
    }
  }
  function drawSnow(t) {
    ctx.snow.clearRect(0, 0, canvases.snow.width, canvases.snow.height);
    if (!CONFIG.snow.enabled) return;
    ctx.snow.fillStyle = "rgba(255,255,255,0.95)";
    ctx.snow.beginPath();
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      const sway = Math.sin((t / 900) + f.swayOffset) * 18 * (f.r / 3);
      ctx.snow.moveTo(f.x + sway, f.y);
      ctx.snow.arc(f.x + sway, f.y, f.r, 0, Math.PI * 2);
      f.y += 0.6 + Math.pow(f.d, 1.5) + f.r * 0.02;
      f.x += Math.sin((t / 1000) + f.swayOffset) * 0.3;
      if (f.y > canvases.snow.height + 30) {
        flakes[i] = { x: Math.random() * canvases.snow.width, y: -20, r: f.r, d: f.d, swayOffset: Math.random() * 1000 };
      }
    }
    ctx.snow.fill();
  }

  // Particles
  let particles = [];
  function initParticles() {
    particles = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      particles.push({ x: canvases.particles.width * 0.7 + (Math.random() - 0.5) * 160, y: canvases.particles.height * 0.55 + (Math.random() - 0.5) * 220, r: Math.random() * 2 + 0.8, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2, alpha: 0.2 + Math.random() * 0.8, phase: Math.random() * Math.PI * 2 });
    }
  }
  function drawParticles(t) {
    ctx.particles.clearRect(0, 0, canvases.particles.width, canvases.particles.height);
    if (!CONFIG.glow.enabled) return;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.02;
      const a = 0.2 + (Math.sin(p.phase) + 1) / 2 * 0.8;
      ctx.particles.beginPath();
      const g = ctx.particles.createRadialGradient(p.x, p.y, p.r * 0.1, p.x, p.y, p.r * 8);
      g.addColorStop(0, `rgba(255,230,140,${a})`);
      g.addColorStop(0.4, `rgba(255,180,90,${a * 0.6})`);
      g.addColorStop(1, `rgba(0,0,0,0)`);
      ctx.particles.fillStyle = g;
      ctx.particles.fillRect(p.x - 16, p.y - 16, 32, 32);
      if (p.x < 0 || p.x > canvases.particles.width || p.y < 0 || p.y > canvases.particles.height) {
        p.x = canvases.snow.width * 0.65 + (Math.random() - 0.5) * 180;
        p.y = canvases.snow.height * 0.55 + (Math.random() - 0.5) * 260;
      }
    }
  }
    
  // Parallax
  let parallaxLayers = [];
  function initParallax() {
      parallaxLayers = [];
      const layers = 4;
      for (let l = 0; l < layers; l++) {
          const pts = [];
          for (let x = 0; x <= canvases.parallax.width + 200; x += 200) {
              pts.push({ x: x, y: canvases.parallax.height * 0.55 + l * 40 + (Math.random() * 20), of: Math.random() * 100, sway: 20 });
          }
          parallaxLayers.push({ scale: 1 - l * 0.1, pts });
      }
  }
  function drawParallax(t) {
      ctx.parallax.clearRect(0, 0, canvases.parallax.width, canvases.parallax.height);
      for (let li = 0; li < parallaxLayers.length; li++) {
          const layer = parallaxLayers[li];
          ctx.parallax.beginPath();
          ctx.parallax.moveTo(-100, canvases.parallax.height);
          for (let i = 0; i < layer.pts.length; i++) {
              const p = layer.pts[i];
              const sway = Math.sin(t / 800 + p.of) * p.sway;
              const nx = p.x + Math.cos(t / 1400 + p.of) * p.sway;
              const ny = p.y + sway * layer.scale;
              ctx.parallax.lineTo(nx, ny);
          }
          ctx.parallax.lineTo(canvases.parallax.width + 100, canvases.parallax.height);
          ctx.parallax.closePath();
          ctx.parallax.fillStyle = `rgba(3,6,8,${0.35 + li * 0.08})`;
          ctx.parallax.fill();
      }
  }

  // Visualizer
  function drawVisualizer() {
    if (music.paused) return;
    analyser.getByteFrequencyData(dataArray);
    ctx.visualizer.clearRect(0, 0, canvases.visualizer.width, canvases.visualizer.height);
    dataArray.forEach((v, i) => {
      const barHeight = v / 2;
      ctx.visualizer.fillStyle = `hsl(${i * 10}, 100%, 50%)`;
      ctx.visualizer.fillRect(i * 12, canvases.visualizer.height - barHeight, 8, barHeight);
    });
  }

  // Animation loop
  function animate(now) {
    drawSnow(now);
    drawParticles(now);
    drawParallax(now);
    drawVisualizer();
    requestAnimationFrame(animate);
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'g') { window.open(CONFIG.socials.github, '_blank'); }
    if (e.key === 's') { navigator.clipboard.writeText(location.href).then(() => showToast('Profile copied')); }
    if (e.key === 'm') { $("#musicToggleBtn").click(); }
  });

  // Typed effect
  const text = "Xin chào — Welcome to my profile!";
  let idx = 0;
  function typeAnim() {
    if (idx <= text.length) {
      $("#typedLine").textContent = text.slice(0, idx++);
      setTimeout(typeAnim, 90);
    }
  }
  
  // Start everything
  resizeAllCanvases();
  requestAnimationFrame(animate);
  typeAnim();
})();
