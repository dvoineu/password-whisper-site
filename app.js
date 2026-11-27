/* ==========================================================================
   Password Whisper — Interactive Site Engine (Zero Dependencies)
   - Authentic 9-Blade Optical Diaphragm (Iris) ported from SentinelIrisRenderer.swift
   - Awakening intro choreography ported from FirstLaunchIntroView.swift
   - Theme switching synced with <meta name="color-scheme"> (Night / Dusk / Day / System)
   - Instant RU / EN switcher with localized screenshots
   - Interactive Smart Redaction Studio, Security Audit Ring, E2EE Pipeline (32 MiB RFC 9106)
   - Who-Sees-What Observer Matrix, Verify-Yourself Checklist, Invoker Copy Buttons
   - Market Comparison Matrix Filter + 1-on-1 Duel + TCO Calculator
   - Visual Context Before/After Slider, Live Web Crypto E2EE + HIBP k-Anonymity Visualizer
   - 5-Slide Product Storyboard (with WCAG 2.2.2 Pause/Play) & 2-Minute Migration Wizard
   - Accessible Tabs (focusgroup + keyboard fallback + beforematch), Native <dialog> Lightbox
   ========================================================================== */

(() => {
  'use strict';

  const THEME_KEY = 'pw-site-theme';
  const LANG_KEY = 'pw-site-lang';
  const VERIFY_KEY = 'pw-site-verify-checks';
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;

  const getLang = () => (root.dataset.uiLang === 'ru' ? 'ru' : 'en');

  // =========================================================================
  // 1. Theme Engine (Synced with <meta name="color-scheme"> + cross-tab sync)
  // =========================================================================
  function applyTheme(choice, persist = true) {
    const meta = document.querySelector('meta[name="color-scheme"]');
    let scheme = 'light dark';

    if (choice === 'night') {
      scheme = 'dark';
      root.dataset.sentinelTheme = 'night';
    } else if (choice === 'dusk') {
      scheme = 'dark';
      root.dataset.sentinelTheme = 'dusk';
    } else if (choice === 'day') {
      scheme = 'light';
      root.dataset.sentinelTheme = 'day';
    } else {
      choice = 'system';
      scheme = 'light dark';
      delete root.dataset.sentinelTheme;
    }

    if (meta) meta.setAttribute('content', scheme);

    if (persist) {
      try {
        if (choice === 'system') {
          localStorage.removeItem(THEME_KEY);
        } else {
          localStorage.setItem(THEME_KEY, choice);
        }
      } catch (_) {}
    }

    document.querySelectorAll('[data-theme-choice]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.themeChoice === choice));
    });
  }

  function initThemes() {
    let initial = 'system';
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'night' || saved === 'dusk' || saved === 'day') {
        initial = saved;
      }
    } catch (_) {}
    applyTheme(initial, false);

    document.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-theme-choice]');
      if (!btn) return;
      applyTheme(btn.dataset.themeChoice, true);
      const pop = btn.closest('[popover]');
      if (pop && typeof pop.hidePopover === 'function') {
        try { pop.hidePopover(); } catch (_) {}
      }
    });

    window.addEventListener('storage', (event) => {
      if (event.key === THEME_KEY) {
        const val = event.newValue;
        applyTheme(val === 'night' || val === 'dusk' || val === 'day' ? val : 'system', false);
      }
    });
  }

  // =========================================================================
  // 2. Bilingual RU / EN Engine + Localized Screenshots
  // =========================================================================
  function applyLanguage(lang, persist = true) {
    const normalized = lang === 'ru' ? 'ru' : 'en';
    root.dataset.uiLang = normalized;
    root.lang = normalized;

    const titleAttr = normalized === 'ru' ? root.dataset.titleRu : root.dataset.titleEn;
    if (titleAttr) document.title = titleAttr;

    if (persist) {
      try {
        localStorage.setItem(LANG_KEY, normalized);
      } catch (_) {}
    }

    document.querySelectorAll('[data-lang-choice]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.langChoice === normalized));
    });

    document.querySelectorAll('img[data-shot-file]').forEach((img) => {
      const prefix = img.dataset.shotPrefix || 'assets/screenshots/';
      const file = img.dataset.shotFile;
      img.src = `${prefix}${normalized}/${file}`;
      const altText = normalized === 'ru' ? img.dataset.altRu : img.dataset.altEn;
      if (altText) img.alt = altText;
    });

    if (typeof window.__pwRefreshWidgets === 'function') {
      window.__pwRefreshWidgets();
    }
  }

  function initLanguage() {
    let initial = root.dataset.uiLang;
    if (initial !== 'ru' && initial !== 'en') {
      try {
        const saved = localStorage.getItem(LANG_KEY);
        if (saved === 'ru' || saved === 'en') initial = saved;
      } catch (_) {}
    }
    if (initial !== 'ru' && initial !== 'en') {
      initial = (navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en';
    }
    applyLanguage(initial, false);

    document.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-lang-choice]');
      if (!btn) return;
      applyLanguage(btn.dataset.langChoice, true);
    });

    window.addEventListener('storage', (event) => {
      if (event.key === LANG_KEY && (event.newValue === 'ru' || event.newValue === 'en')) {
        applyLanguage(event.newValue, false);
      }
    });
  }

  // =========================================================================
  // 3. Authentic 9-Blade Optical Iris Canvas (SentinelIrisRenderer.swift)
  // =========================================================================
  function initIris() {
    const canvas = document.getElementById('sentinel-iris-canvas');
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    const STOPS = ['22', '16', '11', '8', '5.6', '4', '2.8'];
    const APERTURES = [0.06, 0.18, 0.34, 0.5, 0.66, 0.82, 0.96];
    const STOP_COPY = [
      {
        stop: 'f/22',
        ru: ['Сейф заперт', 'Лепестки сведены. Ключ затёрт в RAM через memset_s; расшифровка невозможна без мастер-пароля или биометрии.'],
        en: ['Vault locked', 'Blades closed. Keys are wiped from RAM via memset_s; nothing decrypts without your master password or biometrics.'],
      },
      {
        stop: 'f/16',
        ru: ['Ключ Argon2id', 'Ключ выводится локально в памяти (RFC 9106: 32 МиБ, t=3, p=4) с защитой от перебора на GPU.'],
        en: ['Argon2id key derivation', 'Derived locally in memory (RFC 9106: 32 MiB, t=3, p=4) with GPU-resistant memory hardness.'],
      },
      {
        stop: 'f/11',
        ru: ['Vision Smart Redaction', 'Apple Vision находит email, пароли и токены на скриншоте входа и необратимо запекает маски в HEIC.'],
        en: ['Vision Smart Redaction', 'Apple Vision locates emails, passwords, and tokens on login screenshots and burns masks into HEIC.'],
      },
      {
        stop: 'f/8',
        ru: ['Локальный сейф + iCloud', 'Данные хранятся локально в .whispervault. Личный iCloud используется только как зашифрованный канал синхронизации.'],
        en: ['Local vault + personal iCloud', 'Data lives locally in .whispervault. Personal iCloud is strictly an optional encrypted sync transport.'],
      },
      {
        stop: 'f/5.6',
        ru: ['Safari, Chrome и Firefox', 'Встроенное расширение Safari + локальный мост Native Messaging для Chrome, Brave, Opera и Firefox.'],
        en: ['Safari, Chrome & Firefox', 'Bundled Safari Web Extension plus local Native Messaging for Chrome, Brave, Opera, and Firefox.'],
      },
      {
        stop: 'f/4',
        ru: ['Файлы .p8, .pem и SSH (v1.4)', 'Зашифрованные ключи и сертификаты с AES-256-GCM, автоопределением Key ID и контролем сроков действия.'],
        en: ['Encrypted .p8, .pem & SSH (v1.4)', 'Store keys and certificates with AES-256-GCM, automatic Key ID detection, and expiration alerts.'],
      },
      {
        stop: 'f/2.8',
        ru: ['Хранилище открыто', 'Мгновенный доступ по Face ID или Touch ID без отката на PIN-код и с защищённым буфером обмена.'],
        en: ['Vault unlocked', 'Instant Face ID or Touch ID unlock with no device-PIN fallback and local-only clipboard guard.'],
      },
    ];

    const state = {
      aperture: 0.5,
      ring: 3,
      stopIndex: 3,
      assembly: 1,
      ringProgress: 1,
      coating: 1,
      glow: 0.14,
      extraSpin: 0,
    };

    let rafId = null;
    let cssVars = getComputedStyle(root);
    const token = (name, fallback) => cssVars.getPropertyValue(name).trim() || fallback;

    function syncSize() {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(180, Math.round(rect.width || 280));
      const h = Math.max(180, Math.round(rect.height || 280));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      return [w, h, dpr];
    }

    function drawEmber(cx, cy, radius, intensity) {
      const clamped = Math.min(1.5, Math.max(0, intensity));
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, `rgba(255, 181, 71, ${Math.min(1, 0.72 * clamped)})`);
      grad.addColorStop(0.42, `rgba(232, 96, 143, ${Math.min(0.6, 0.24 * clamped)})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 181, 71, ${Math.min(1, clamped + 0.25)})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }

    function draw() {
      const [w, h, dpr] = syncSize();
      const T = Math.PI * 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.5 * 0.76;
      const n = 9;
      const stepRad = (22 * Math.PI) / 180;
      const ringProg = Math.min(1, Math.max(0, state.ringProgress));

      if (ringProg > 0.005) {
        ctx.strokeStyle = token('--line', '#424855');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.03, -Math.PI / 2, -Math.PI / 2 + T * ringProg);
        ctx.stroke();

        const ticks = Math.floor(96 * ringProg);
        ctx.beginPath();
        for (let i = 0; i < ticks; i += 1) {
          const ang = -Math.PI / 2 + (i / 96) * T - state.ring * stepRad;
          const r1 = R * 1.07;
          const r2 = R * (i % 8 === 0 ? 1.135 : 1.1);
          ctx.moveTo(cx + r1 * Math.cos(ang), cy + r1 * Math.sin(ang));
          ctx.lineTo(cx + r2 * Math.cos(ang), cy + r2 * Math.sin(ang));
        }
        ctx.stroke();

        if (ringProg > 0.5) {
          const alpha = Math.min(1, (ringProg - 0.5) / 0.5);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.font = `600 ${Math.max(10, Math.round(R * 0.095))}px ${token('--font-mono', 'monospace')}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          STOPS.forEach((label, idx) => {
            const ang = -Math.PI / 2 + (idx - state.ring) * stepRad;
            ctx.fillStyle = Math.abs(idx - state.ring) < 0.5 ? token('--coat-amber', '#ffb547') : token('--ink-dim', '#7b8292');
            ctx.fillText(label, cx + R * 1.22 * Math.cos(ang), cy + R * 1.22 * Math.sin(ang));
          });
          ctx.restore();
        }

        ctx.save();
        ctx.globalAlpha = ringProg;
        ctx.fillStyle = token('--coat-amber', '#ffb547');
        const idxY = cy - R * 1.04;
        ctx.beginPath();
        ctx.moveTo(cx, idxY + R * 0.055);
        ctx.lineTo(cx - R * 0.038, idxY - R * 0.02);
        ctx.lineTo(cx + R * 0.038, idxY - R * 0.02);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      const a = Math.max(0, state.aperture);
      const innerR = a <= 0.0005 ? 0 : R * (0.035 + 0.85 * Math.min(1, a));
      const th0 = -Math.PI / 2 + (1 - Math.min(1, a)) * 0.85 + state.extraSpin;

      const V = [];
      for (let i = 0; i < n; i += 1) {
        const ang = th0 + (i * T) / n;
        V.push([cx + innerR * Math.cos(ang), cy + innerR * Math.sin(ang)]);
      }

      const E = [];
      for (let i = 0; i < n; i += 1) {
        const a0 = th0 + (i * T) / n;
        const a1 = th0 + ((i + 1) * T) / n;
        const mid = 0.5 * (a0 + a1);
        const dx = -Math.sin(mid);
        const dy = Math.cos(mid);
        const q = V[(i + 1) % n];
        const ox = q[0] - cx;
        const oy = q[1] - cy;
        const b = ox * dx + oy * dy;
        const c = ox * ox + oy * oy - R * R;
        const dist = -b + Math.sqrt(Math.max(0, b * b - c));
        E.push([q[0] + dx * dist, q[1] + dy * dist]);
      }

      const bladeHi = token('--blade-hi', '#3a414e');
      const bladeLo = token('--blade-lo', '#0f1218');

      ctx.save();
      if (state.assembly >= 0.995) {
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, T);
        ctx.clip();
      }

      for (let i = 0; i < n; i += 1) {
        let pBlade = 1;
        if (state.assembly < 0.999) {
          const delay = i * 0.055;
          const span = Math.max(0.25, 1 - (n - 1) * 0.055);
          const norm = Math.min(1, Math.max(0, (state.assembly - delay) / span));
          pBlade = 1 - Math.pow(1 - norm, 3);
        }
        if (pBlade <= 0.005) continue;

        const A = V[(i + 1) % n];
        const B = E[i];
        const C = E[(i + 1) % n];
        const D = V[(i + 2) % n];

        const a1 = Math.atan2(B[1] - cy, B[0] - cx);
        let a2 = Math.atan2(C[1] - cy, C[0] - cx);
        while (a2 < a1) a2 += T;
        const mid = 0.5 * (a1 + a2);
        const light = 0.5 + 0.5 * Math.cos(mid + 2.35);

        ctx.save();
        if (pBlade < 0.999) {
          const shift = (1 - pBlade) * 0.65 * R;
          const rot = (1 - pBlade) * 1.05;
          const px = cx + 0.45 * R * Math.cos(mid);
          const py = cy + 0.45 * R * Math.sin(mid);
          ctx.translate(shift * Math.cos(mid), shift * Math.sin(mid));
          ctx.translate(px, py);
          ctx.rotate(rot);
          ctx.translate(-px, -py);
        }

        const grad = ctx.createLinearGradient(A[0], A[1], cx + R * Math.cos(mid), cy + R * Math.sin(mid));
        grad.addColorStop(0, bladeHi);
        grad.addColorStop(1, bladeLo);

        ctx.globalAlpha = (0.78 + 0.22 * light) * pBlade;
        ctx.beginPath();
        ctx.moveTo(A[0], A[1]);
        ctx.lineTo(B[0], B[1]);
        ctx.arc(cx, cy, R + 2, a1, a2, false);
        ctx.lineTo(D[0], D[1]);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.05 + 0.14 * light) * pBlade})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(A[0], A[1]);
        ctx.lineTo(B[0], B[1]);
        ctx.stroke();
        ctx.restore();
      }

      if (state.coating > 0.01 && state.assembly > 0.35 && ctx.createConicGradient) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.19 * Math.min(1.5, state.coating) * Math.min(1, state.assembly);
        const cg = ctx.createConicGradient(th0 * 0.6 + 0.4, cx, cy);
        cg.addColorStop(0, 'rgba(0,0,0,0)');
        cg.addColorStop(0.1, token('--coat-amber', '#ffb547'));
        cg.addColorStop(0.28, token('--coat-rose', '#e8608f'));
        cg.addColorStop(0.46, token('--coat-violet', '#8a7cff'));
        cg.addColorStop(0.62, token('--coat-teal', '#39d3c3'));
        cg.addColorStop(0.82, 'rgba(0,0,0,0)');
        cg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cg;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }

      if (state.assembly >= 0.94 && innerR > 0.6) {
        const holePath = new Path2D();
        V.forEach((pt, idx) => (idx ? holePath.lineTo(pt[0], pt[1]) : holePath.moveTo(pt[0], pt[1])));
        holePath.closePath();

        const pGrad = ctx.createRadialGradient(cx - innerR * 0.18, cy - innerR * 0.2, 0, cx, cy, Math.max(4, innerR * 1.25));
        pGrad.addColorStop(0, 'rgba(26, 32, 48, 0.94)');
        pGrad.addColorStop(1, 'rgba(6, 8, 13, 0.98)');
        ctx.fillStyle = pGrad;
        ctx.fill(holePath);

        if (innerR > 10) {
          ctx.save();
          ctx.clip(holePath);
          ctx.save();
          ctx.translate(cx - innerR * 0.32, cy - innerR * 0.34);
          ctx.rotate((-34 * Math.PI) / 180);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.11)';
          ctx.beginPath();
          ctx.ellipse(0, 0, innerR * 0.22, innerR * 0.12, 0, 0, T);
          ctx.fill();
          ctx.restore();

          ctx.fillStyle = 'rgba(138, 124, 255, 0.16)';
          ctx.beginPath();
          ctx.ellipse(cx + innerR * 0.22, cy + innerR * 0.24, innerR * 0.16, innerR * 0.1, 0, 0, T);
          ctx.fill();
          ctx.restore();
        }

        ctx.strokeStyle = token('--coat-amber', '#ffb547');
        ctx.lineWidth = 1.35;
        ctx.shadowColor = token('--coat-amber', '#ffb547');
        ctx.shadowBlur = 10;
        ctx.stroke(holePath);
        ctx.shadowBlur = 0;
      } else if (state.glow > 0.01) {
        drawEmber(cx, cy, R * 0.62, state.glow);
      }

      ctx.restore();
    }

    function updateReadout() {
      const item = STOP_COPY[state.stopIndex] || STOP_COPY[3];
      const lang = getLang();
      const pair = item[lang];
      const stopEl = document.getElementById('iris-stop-label');
      const titleEl = document.getElementById('iris-stop-title');
      const descEl = document.getElementById('iris-stop-desc');
      if (stopEl) stopEl.textContent = item.stop;
      if (titleEl) titleEl.textContent = pair[0];
      if (descEl) descEl.textContent = pair[1];

      document.querySelectorAll('.iris-stop-btn').forEach((btn) => {
        btn.setAttribute('aria-pressed', String(Number(btn.dataset.stop) === state.stopIndex));
      });
    }

    const easeOutBack = (t) => {
      const c1 = 1.15;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const clamp01 = (v) => Math.min(1, Math.max(0, v));

    function cancelAnim() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function goToStop(index) {
      cancelAnim();
      state.stopIndex = Math.max(0, Math.min(APERTURES.length - 1, index));
      state.assembly = 1;
      state.ringProgress = 1;
      state.coating = 1;
      state.glow = 0.14;
      updateReadout();

      if (reduceMotionQuery.matches) {
        state.aperture = APERTURES[state.stopIndex];
        state.ring = state.stopIndex;
        draw();
        return;
      }

      const startAperture = state.aperture;
      const startRing = state.ring;
      const targetAperture = APERTURES[state.stopIndex];
      const targetRing = state.stopIndex;
      const t0 = performance.now();

      const tick = (now) => {
        const p = Math.min(1, (now - t0) / 820);
        const e = easeOutBack(p);
        state.aperture = startAperture + (targetAperture - startAperture) * e;
        state.ring = startRing + (targetRing - startRing) * e;
        draw();
        if (p < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = null;
        }
      };
      rafId = requestAnimationFrame(tick);
    }

    function playAwakeningIntro() {
      cancelAnim();
      state.stopIndex = 3;
      updateReadout();

      if (reduceMotionQuery.matches) {
        state.aperture = APERTURES[3];
        state.ring = 3;
        state.assembly = 1;
        state.ringProgress = 1;
        state.coating = 1;
        state.glow = 0.14;
        draw();
        return;
      }

      const t0 = performance.now();
      const durationMs = 2650;

      const tick = (now) => {
        const elapsed = (now - t0) / 1000;
        const speedTime = elapsed * 1.65;

        state.assembly = easeOutCubic(clamp01((speedTime - 0.35) / 1.1));
        state.ringProgress = easeOutCubic(clamp01((speedTime - 1.4) / 0.85));

        const openP = easeOutBack(clamp01((speedTime - 2.15) / 1.55));
        state.aperture = 0.06 + (APERTURES[3] - 0.06) * openP;
        state.ring = 3 * openP;

        const flashIn = clamp01((speedTime - 2.2) / 0.35);
        const flashSettle = clamp01((speedTime - 2.55) / 0.45);
        state.coating = flashIn < 1 ? flashIn * 1.35 : 1.35 - 0.35 * flashSettle;

        const ember = clamp01((speedTime - 0.03) / 0.32) * 0.72;
        const flashGlow = speedTime >= 2.2 ? (1 - clamp01((speedTime - 2.2) / 0.75)) * 0.65 : 0;
        state.glow = Math.max(0.14, Math.max(ember * (1 - state.assembly * 0.7), flashGlow));

        draw();
        if (now - t0 < durationMs) {
          rafId = requestAnimationFrame(tick);
        } else {
          state.assembly = 1;
          state.ringProgress = 1;
          state.aperture = APERTURES[3];
          state.ring = 3;
          state.coating = 1;
          state.glow = 0.14;
          draw();
          rafId = null;
        }
      };

      rafId = requestAnimationFrame(tick);
    }

    document.querySelectorAll('.iris-stop-btn').forEach((btn) => {
      btn.addEventListener('click', () => goToStop(Number(btn.dataset.stop)));
    });

    canvas.addEventListener('click', () => {
      goToStop((state.stopIndex + 1) % APERTURES.length);
    });

    const replayBtn = document.getElementById('iris-replay-btn');
    if (replayBtn) replayBtn.addEventListener('click', playAwakeningIntro);

    const observer = new MutationObserver(() => {
      cssVars = getComputedStyle(root);
      draw();
    });
    observer.observe(root, { attributes: true, attributeFilter: ['data-sentinel-theme'] });

    const metaScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaScheme) {
      new MutationObserver(() => {
        cssVars = getComputedStyle(root);
        draw();
      }).observe(metaScheme, { attributes: true, attributeFilter: ['content'] });
    }

    window.addEventListener('resize', draw, { passive: true });
    playAwakeningIntro();

    return { updateReadout, goToStop };
  }

  // =========================================================================
  // 4. Interactive Smart Redaction Studio Demo
  // =========================================================================
  function initRedactionDemo() {
    const fields = Array.from(document.querySelectorAll('.redact-field'));
    if (!fields.length) return null;

    const statusEl = document.getElementById('redaction-status');
    const toggleAllBtn = document.getElementById('redaction-toggle-all');

    function updateStatus() {
      const maskedCount = fields.filter((f) => f.dataset.masked === 'true').length;
      const lang = getLang();
      if (statusEl) {
        statusEl.textContent =
          lang === 'ru'
            ? `Масок в кадре: ${maskedCount} из ${fields.length} · EXIF/GPS удалён · ~54 КБ HEIC в RAM`
            : `Masks active: ${maskedCount} of ${fields.length} · EXIF/GPS stripped · ~54 KB HEIC in RAM`;
      }
      if (toggleAllBtn) {
        const allMasked = maskedCount === fields.length;
        toggleAllBtn.textContent =
          lang === 'ru'
            ? allMasked ? 'Проверить под маской' : 'Замаскировать всё (Vision OCR)'
            : allMasked ? 'Peek under masks' : 'Mask all (Vision OCR)';
      }
    }

    fields.forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = btn.dataset.masked !== 'true';
        btn.dataset.masked = String(next);
        btn.setAttribute('aria-pressed', String(next));
        updateStatus();
      });
    });

    if (toggleAllBtn) {
      toggleAllBtn.addEventListener('click', () => {
        const allMasked = fields.every((f) => f.dataset.masked === 'true');
        fields.forEach((f) => {
          f.dataset.masked = String(!allMasked);
          f.setAttribute('aria-pressed', String(!allMasked));
        });
        updateStatus();
      });
    }

    updateStatus();
    return { updateStatus };
  }

  // =========================================================================
  // 5. Interactive Security Audit Score Ring Demo
  // =========================================================================
  function initAuditDemo() {
    const arc = document.getElementById('audit-ring-arc');
    const numEl = document.getElementById('audit-score-num');
    const btn = document.getElementById('audit-demo-btn');
    const row1 = document.getElementById('audit-row-1');
    const row2 = document.getElementById('audit-row-2');
    if (!arc || !numEl || !btn) return null;

    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    arc.style.strokeDasharray = String(circumference);

    let hardened = false;

    function render() {
      const score = hardened ? 100 : 87;
      arc.style.strokeDashoffset = String(circumference * (1 - score / 100));
      numEl.textContent = String(score);

      const lang = getLang();
      if (row1) {
        const chip = row1.querySelector('.chip');
        const label = row1.querySelector('.audit-row-text');
        if (chip) {
          chip.className = hardened ? 'chip chip--safe' : 'chip chip--risk';
          chip.textContent = hardened ? (lang === 'ru' ? 'ОК' : 'SAFE') : lang === 'ru' ? 'ВЫСОКИЙ' : 'HIGH';
        }
        if (label) {
          label.textContent = hardened
            ? lang === 'ru'
              ? 'Все пароли уникальны (24 симв. CSPRNG)'
              : 'All passwords unique (24-char CSPRNG)'
            : lang === 'ru'
              ? '2 записи с одинаковыми паролями'
              : '2 entries reuse the same password';
        }
      }
      if (row2) {
        const chip = row2.querySelector('.chip');
        const label = row2.querySelector('.audit-row-text');
        if (chip) {
          chip.className = hardened ? 'chip chip--safe' : 'chip chip--warn';
          chip.textContent = hardened ? (lang === 'ru' ? 'ОК' : 'SAFE') : lang === 'ru' ? 'СОВЕТ' : 'TIP';
        }
        if (label) {
          label.textContent = hardened
            ? lang === 'ru'
              ? 'Ключи .p8 / сертификаты и Zero-Log HIBP: 0 рисков'
              : 'Expiring .p8 / certs & Zero-Log HIBP: 0 issues'
            : lang === 'ru'
              ? '1 запись без снимка входа · 1 ключ .p8 истекает скоро'
              : '1 entry missing login screenshot · 1 .p8 key expiring soon';
        }
      }

      btn.textContent = hardened
        ? lang === 'ru' ? 'Сбросить демо (87 / 100)' : 'Reset demo (87 / 100)'
        : lang === 'ru' ? 'Усилить до 100 / 100' : 'Fix issues to 100 / 100';
    }

    btn.addEventListener('click', () => {
      hardened = !hardened;
      render();
    });

    render();
    return { render };
  }

  // =========================================================================
  // 6. Interactive E2EE Pipeline Selector (Verified 32 MiB RFC 9106 spec)
  // =========================================================================
  function initPipeline() {
    const nodes = Array.from(document.querySelectorAll('.pipeline-node'));
    if (!nodes.length) return null;

    const titleEl = document.getElementById('pipeline-detail-title');
    const bodyEl = document.getElementById('pipeline-detail-body');
    const badgeEl = document.getElementById('pipeline-detail-badge');
    const codeEl = document.getElementById('pipeline-detail-code');

    const STAGES = [
      {
        ru: [
          '1. Мастер-пароль остаётся только в вашей голове',
          'Пароль никогда не записывается на диск и не отправляется по сети. Ключевые буферы защищены mlock() от выгрузки в swap и гарантированно затираются в RAM через memset_s() (SecureBytes).',
          'ТОЛЬКО В RAM · MLOCK + MEMSET_S',
          'masterPassword -> RAM only (mlock + memset_s on lock)',
        ],
        en: [
          '1. Your Master Password stays only in your memory',
          'It is never written to disk or sent over the network. Key buffers are pinned against swap via mlock() and guaranteed zeroed in RAM via memset_s() (SecureBytes).',
          'RAM ONLY · MLOCK + MEMSET_S',
          'masterPassword -> RAM only (mlock + memset_s on lock)',
        ],
      },
      {
        ru: [
          '2. Argon2id (RFC 9106) выводит ключ обёртки',
          'Памятеёмкий алгоритм Argon2id (32 МиБ, t=3, p=4, случайная 128-битная соль; сверен с официальным вектором IETF RFC 9106 Section 5.3) разворачивает случайный 256-битный VaultKey. Отдельная обёртка поддерживает печатный Recovery Key.',
          'ЗАЩИТА ОТ ПЕРЕБОРА GPU',
          'Argon2id(32 MiB, t=3, p=4, 16B salt) -> MasterKEK -> VaultKey (DEK)',
        ],
        en: [
          '2. Argon2id (RFC 9106) unwraps the VaultKey',
          'Memory-hard Argon2id (32 MiB, t=3, p=4, random 128-bit salt; verified against IETF RFC 9106 Section 5.3) unwraps your random 256-bit VaultKey. A separate envelope supports your printable Recovery Kit.',
          'GPU-RESISTANT KDF',
          'Argon2id(32 MiB, t=3, p=4, 16B salt) -> MasterKEK -> VaultKey (DEK)',
        ],
      },
      {
        ru: [
          '3. HKDF-SHA256 + по-объектное AES-256-GCM с AAD',
          'Из VaultKey через HKDF-SHA256 выводятся отдельные подключи для записей, блобов и черновиков. Каждая карточка, HEIC-снимок и файл (.p8/.pem/SSH) запечатываются уникальным 96-битным nonce и жёсткой привязкой AAD к vaultID и objectID/SHA-256.',
          'АУТЕНТИФИЦИРОВАННОЕ ШИФРОВАНИЕ',
          'HKDF-SHA256(VaultKey) -> Subkey\nAES-256-GCM(Subkey, 96b nonce, AAD=vaultID|id) -> .enc + 128b tag',
        ],
        en: [
          '3. HKDF-SHA256 + per-item AES-256-GCM with strict AAD',
          'HKDF-SHA256 derives domain-separated subkeys for items, blobs, and drafts. Every login, HEIC screenshot, and .p8/.pem/SSH file is sealed with a unique 96-bit nonce and AAD bound to vaultID and objectID/SHA-256.',
          'AUTHENTICATED ENCRYPTION',
          'HKDF-SHA256(VaultKey) -> Subkey\nAES-256-GCM(Subkey, 96b nonce, AAD=vaultID|id) -> .enc + 128b tag',
        ],
      },
      {
        ru: [
          '4. Локальный пакет .whispervault без монолитной базы',
          'Сейф живёт прямо на вашем устройстве: каждая запись лежит отдельным файлом (items/<uuid>.item.enc, blobs/<sha256>.blob.enc). Работает полностью офлайн, а правки на Mac и iPhone сливаются детерминированно без потери истории.',
          '100% ЛОКАЛЬНОЕ ХРАНЕНИЕ',
          'Primary.whispervault/{vault.header.json, items/*.item.enc, blobs/*.blob.enc}',
        ],
        en: [
          '4. Local-first .whispervault package — no cloud lock-in',
          'Your vault lives directly on your device with per-object files (items/<uuid>.item.enc, blobs/<sha256>.blob.enc). Works 100% offline, and edits on Mac & iPhone merge deterministically without losing history.',
          '100% LOCAL STORAGE',
          'Primary.whispervault/{vault.header.json, items/*.item.enc, blobs/*.blob.enc}',
        ],
      },
      {
        ru: [
          '5. Опциональная синхронизация только через личный Apple iCloud',
          'При включении iCloud для сейфа CKSyncEngine передаёт исключительно шифротекст (SentinelEncryptedItem и CKAsset) в вашу приватную зону CloudKit. У разработчика нет серверов и технически нет доступа к вашим данным.',
          'НОЛЬ СЕРВЕРОВ РАЗРАБОТЧИКА',
          'Private CloudKit (iCloud.com.dvoineu.passwordwhisper.vault)\n-> SentinelVaultZone (ciphertext only)',
        ],
        en: [
          '5. Optional sync strictly via your personal Apple iCloud',
          'When enabled per vault, CKSyncEngine syncs only encrypted envelopes (SentinelEncryptedItem & CKAsset) to your private CloudKit zone. The developer has zero servers and no technical access to your vault.',
          'ZERO DEVELOPER SERVERS',
          'Private CloudKit (iCloud.com.dvoineu.passwordwhisper.vault)\n-> SentinelVaultZone (ciphertext only)',
        ],
      },
    ];

    let activeIdx = 0;

    function selectStage(idx) {
      activeIdx = Math.max(0, Math.min(STAGES.length - 1, idx));
      const copy = STAGES[activeIdx][getLang()];
      nodes.forEach((node, i) => {
        node.setAttribute('aria-pressed', String(i === activeIdx));
      });
      if (titleEl) titleEl.textContent = copy[0];
      if (bodyEl) bodyEl.textContent = copy[1];
      if (badgeEl) badgeEl.textContent = copy[2];
      if (codeEl) codeEl.textContent = copy[3];
    }

    nodes.forEach((node, idx) => {
      node.addEventListener('click', () => selectStage(idx));
    });

    selectStage(0);
    return { refresh: () => selectStage(activeIdx) };
  }

  // =========================================================================
  // 7. Interactive "Who Sees What" Observer Matrix (#83)
  // =========================================================================
  function initObserverMatrix() {
    const btns = Array.from(document.querySelectorAll('.observer-role-btn'));
    if (!btns.length) return null;

    const badgeEl = document.getElementById('observer-badge');
    const titleEl = document.getElementById('observer-title');
    const descEl = document.getElementById('observer-desc');
    const dumpEl = document.getElementById('observer-dump');

    const DATA = {
      you: {
        chipClass: 'chip chip--safe',
        ru: [
          'ПОЛНЫЙ ДОСТУП · ТОЛЬКО У ВАС',
          'Вы (после ввода мастер-пароля или Face ID / Touch ID)',
          'Ключ VaultKey разворачивается локально в оперативной памяти вашего устройства. Вы видите все пароли, TOTP-коды, замаскированные скриншоты и файлы .p8/.pem — даже в Авиарежиме.',
          `{\n  "title": "Cloudflare Production SSO",\n  "username": "ops@northstar.dev",\n  "password": "v9!kQ#2mP8zR$4tL0wX7",\n  "totp": "529 813 (22s)",\n  "attachment": "AuthKey_9X4K2.p8 (decrypted in RAM only)"\n}`,
        ],
        en: [
          'FULL ACCESS · YOU ONLY',
          'You (after Master Password or Face ID / Touch ID)',
          'VaultKey unwraps locally in RAM on your device. You can view every login, TOTP code, redacted screenshot, and .p8/.pem attachment — even in Airplane Mode.',
          `{\n  "title": "Cloudflare Production SSO",\n  "username": "ops@northstar.dev",\n  "password": "v9!kQ#2mP8zR$4tL0wX7",\n  "totp": "529 813 (22s)",\n  "attachment": "AuthKey_9X4K2.p8 (decrypted in RAM only)"\n}`,
        ],
      },
      dev: {
        chipClass: 'chip chip--safe',
        ru: [
          '0 БАЙТ · НЕТ СЕРВЕРОВ',
          'Разработчик Password Whisper',
          'Ноль байт. У нас нет базы аккаунтов, нет серверов хранения сейфов, нет аналитики, рекламных SDK и телеметрии. Мы не знаем ни сколько у вас паролей, ни какие сайты вы открываете.',
          `// Сервер разработчика Password Whisper:\n// НЕ СУЩЕСТВУЕТ\n\nVault contents received: 0 bytes\nUser accounts database:  none\nAnalytics / crash SDKs:  none\nNSPrivacyTracking:       false\nNSPrivacyCollectedData:  []`,
        ],
        en: [
          '0 BYTES · NO SERVERS',
          'Password Whisper Developer',
          'Zero bytes. We run no user account database, no vault storage servers, no analytics, no ad SDKs, and no crash telemetry. We cannot see your vault or browsing history.',
          `// Password Whisper developer vault server:\n// DOES NOT EXIST\n\nVault contents received: 0 bytes\nUser accounts database:  none\nAnalytics / crash SDKs:  none\nNSPrivacyTracking:       false\nNSPrivacyCollectedData:  []`,
        ],
      },
      icloud: {
        chipClass: 'chip chip--warn',
        ru: [
          'ТОЛЬКО ШИФРОТЕКСТ · ПРИВАТНАЯ ЗОНА',
          'Apple iCloud (только если вы сами включили синхронизацию)',
          'CloudKit Private DB получает только непрозрачные зашифрованные конверты SentinelEncryptedItem и бинарные CKAsset. Ни названий сайтов, ни логинов, ни паролей, ни открытых картинок в iCloud не существует.',
          `CKRecord("SentinelEncryptedItem") {\n  vaultID: "9F4A-...-D21E",\n  objectID: "4E11-...-A80C",\n  revisionNumber: 4,\n  envelopeData: <AES-256-GCM ciphertext: 842 bytes>,\n  // plaintext titles, logins, URLs, passwords: NONE\n}`,
        ],
        en: [
          'CIPHERTEXT ONLY · PRIVATE ZONE',
          'Apple iCloud (only if you enable sync)',
          'Your private CloudKit DB receives only opaque SentinelEncryptedItem envelopes and encrypted CKAsset blobs. No titles, usernames, URLs, passwords, or readable images ever reach iCloud.',
          `CKRecord("SentinelEncryptedItem") {\n  vaultID: "9F4A-...-D21E",\n  objectID: "4E11-...-A80C",\n  revisionNumber: 4,\n  envelopeData: <AES-256-GCM ciphertext: 842 bytes>,\n  // plaintext titles, logins, URLs, passwords: NONE\n}`,
        ],
      },
      network: {
        chipClass: 'chip chip--safe',
        ru: [
          '0 БАЙТ ОФЛАЙН · 5-CHAR K-ANONYMITY ПО ЗАПРОСУ',
          'Интернет-провайдер / Wi-Fi сеть',
          'В локальном режиме исходящий трафик равен 0. При ручном нажатии «Проверить утечки» уходит один HTTPS GET /range/<5-символов> без cookie и редиректов (1 из 1 048 576 диапазонов с Add-Padding).',
          `// Обычная работа без iCloud:\nOutbound packets: 0\n\n// Только по кнопке "Проверить утечки" (TLS 1.3):\nGET /range/5BAA6 HTTP/2\nCookie: (none)\nRedirects: strictly refused\n// Полный SHA-1, пароль и сайт НЕ передаются`,
        ],
        en: [
          '0 BYTES OFFLINE · OPT-IN 5-CHAR K-ANONYMITY',
          'ISP / Public Wi-Fi Network',
          'In local mode outbound traffic is 0 bytes. Only when you tap Breach Check does the app send a cookie-free HTTPS GET /range/<5-hex> (1 in 1,048,576 buckets with Add-Padding, redirects refused).',
          `// Normal offline usage:\nOutbound packets: 0\n\n// Only when tapping "Breach Check" (TLS 1.3):\nGET /range/5BAA6 HTTP/2\nCookie: (none)\nRedirects: strictly refused\n// Full SHA-1, password, and domain NEVER sent`,
        ],
      },
      attacker: {
        chipClass: 'chip chip--risk',
        ru: [
          'ЗАПЕРТО ARGON2ID + AES-256-GCM + AAD',
          'Злоумышленник, укравший файл .whispervault',
          'Даже с полным доступом к диску злоумышленник видит только случайную соль и шифротекст. Изменение любого байта ломает тег AAD, а перебор сильного мастер-пароля через Argon2id (32 МиБ, t=3, p=4) займёт столетия.',
          `{\n  "objectType": "vault_item",\n  "nonce": "rT8vN1kQ9xM2pL5w",\n  "ciphertext": "8f2a9c41e07b...91d4a7c3",\n  "tag": "kP4mV2qX8nB7sR1jW9zL3A==",\n  // Без мастер-пароля или Recovery Key: расшифровка невозможна\n}`,
        ],
        en: [
          'SEALED BY ARGON2ID + AES-256-GCM + AAD',
          'Attacker who stole your .whispervault folder',
          'Even with full disk access, an attacker sees only random salt and ciphertext. Flipping a single bit fails AAD integrity, and brute-forcing a strong passphrase against Argon2id (32 MiB, t=3, p=4) takes centuries.',
          `{\n  "objectType": "vault_item",\n  "nonce": "rT8vN1kQ9xM2pL5w",\n  "ciphertext": "8f2a9c41e07b...91d4a7c3",\n  "tag": "kP4mV2qX8nB7sR1jW9zL3A==",\n  // Without Master Password or Recovery Key: mathematically infeasible\n}`,
        ],
      },
    };

    let currentRole = 'dev';

    function renderRole(role) {
      currentRole = DATA[role] ? role : 'dev';
      const entry = DATA[currentRole];
      const copy = entry[getLang()];
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.observerRole === currentRole)));
      if (badgeEl) {
        badgeEl.className = entry.chipClass;
        badgeEl.textContent = copy[0];
      }
      if (titleEl) titleEl.textContent = copy[1];
      if (descEl) descEl.textContent = copy[2];
      if (dumpEl) dumpEl.textContent = copy[3];
    }

    btns.forEach((btn) => {
      btn.addEventListener('click', () => renderRole(btn.dataset.observerRole));
    });

    renderRole('dev');
    return { refresh: () => renderRole(currentRole) };
  }

  // =========================================================================
  // 8. Verify-Yourself Interactive Checklist (#84)
  // =========================================================================
  function initVerifyChecklist() {
    const cards = Array.from(document.querySelectorAll('.verify-card[data-verify-id]'));
    if (!cards.length) return null;

    const countEl = document.getElementById('verify-progress-text');
    const barEl = document.getElementById('verify-bar-fill');
    const resetBtn = document.getElementById('verify-reset-btn');

    let checked = new Set();
    try {
      const saved = JSON.parse(localStorage.getItem(VERIFY_KEY) || '[]');
      if (Array.isArray(saved)) checked = new Set(saved);
    } catch (_) {}

    function persist() {
      try {
        localStorage.setItem(VERIFY_KEY, JSON.stringify(Array.from(checked)));
      } catch (_) {}
    }

    function render() {
      const lang = getLang();
      let done = 0;
      cards.forEach((card) => {
        const id = card.dataset.verifyId;
        const isDone = checked.has(id);
        if (isDone) done += 1;
        card.dataset.checked = String(isDone);
        const btn = card.querySelector('.verify-check-btn');
        if (btn) {
          btn.setAttribute('aria-pressed', String(isDone));
          btn.textContent = isDone
            ? lang === 'ru' ? '✓ Проверено' : '✓ Verified'
            : lang === 'ru' ? 'Отметить' : 'Mark done';
        }
      });

      const pct = Math.round((done / cards.length) * 100);
      if (barEl) barEl.style.width = `${pct}%`;
      if (countEl) {
        countEl.textContent =
          lang === 'ru'
            ? `Пройдено проверок: ${done} из ${cards.length} (${pct}%)`
            : `Checks completed: ${done} of ${cards.length} (${pct}%)`;
      }
    }

    cards.forEach((card) => {
      const btn = card.querySelector('.verify-check-btn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const id = card.dataset.verifyId;
        if (checked.has(id)) checked.delete(id);
        else checked.add(id);
        persist();
        render();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        checked.clear();
        persist();
        render();
      });
    }

    render();
    return { refresh: render };
  }

  // =========================================================================
  // 9. Invoker Command Copy Buttons (`copy-button` modern-web-guidance)
  // =========================================================================
  function initCopyButtons() {
    const timers = new WeakMap();
    let lastMessage = '';

    function legacyCopy(text) {
      const previousFocus = document.activeElement;
      const field = Object.assign(document.createElement('textarea'), { value: text });
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;inset-block-start:0;opacity:0';
      document.body.append(field);
      field.select();
      try {
        return document.execCommand('copy');
      } finally {
        field.remove();
        previousFocus?.focus?.({ preventScroll: true });
      }
    }

    function report(button, ok) {
      const tip = button.nextElementSibling;
      clearTimeout(timers.get(button));
      button.removeAttribute('data-copied');
      button.removeAttribute('data-failed');

      const lang = getLang();
      let message = ok
        ? lang === 'ru' ? 'Скопировано' : 'Copied'
        : lang === 'ru' ? 'Не удалось скопировать' : 'Copy failed';
      if (message === lastMessage) message += '\u00A0';
      lastMessage = message;

      if (tip) tip.textContent = '';
      void button.offsetWidth;
      button.setAttribute(ok ? 'data-copied' : 'data-failed', '');
      requestAnimationFrame(() => {
        if (tip) tip.textContent = message;
      });

      timers.set(
        button,
        setTimeout(() => {
          button.removeAttribute('data-copied');
          button.removeAttribute('data-failed');
          if (tip) tip.textContent = '';
        }, 2000)
      );
    }

    async function copy(button, target) {
      const text = target.matches('input, textarea') ? target.value : target.innerText.trim();
      if (!text) return;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else if (!legacyCopy(text)) {
          throw new Error('Copy failed');
        }
        report(button, true);
      } catch {
        try {
          if (legacyCopy(text)) {
            report(button, true);
            return;
          }
        } catch (_) {}
        report(button, false);
      }
    }

    document.addEventListener(
      'command',
      (event) => {
        if (event.command === '--copy') {
          copy(event.source, event.target);
        }
      },
      true
    );

    if (!('CommandEvent' in window)) {
      document.addEventListener('click', (event) => {
        if (event.defaultPrevented) return;
        const button = event.target.closest('button[command="--copy"][commandfor]');
        if (!button) return;
        const target = document.getElementById(button.getAttribute('commandfor'));
        if (target) copy(button, target);
      });
    }
  }

  // =========================================================================
  // 10. Market Comparison Matrix Filter + Interactive TCO Calculator (#85)
  // =========================================================================
  function initComparisonMatrix() {
    const filterBtns = Array.from(document.querySelectorAll('.filter-pill-btn[data-matrix-filter]'));
    const rows = Array.from(document.querySelectorAll('.compare-table tbody tr[data-cat]'));
    if (!filterBtns.length || !rows.length) return;

    function applyFilter(cat) {
      filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.matrixFilter === cat)));
      rows.forEach((row) => {
        row.hidden = cat !== 'all' && row.dataset.cat !== cat;
      });
    }

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => applyFilter(btn.dataset.matrixFilter));
    });
  }

  function initTcoCalculator() {
    const container = document.getElementById('tco-bars');
    if (!container) return null;

    const savingsEl = document.getElementById('tco-savings-text');
    const yearBtns = Array.from(document.querySelectorAll('[data-tco-years]'));
    const modeBtns = Array.from(document.querySelectorAll('[data-tco-mode]'));

    let years = 3;
    let mode = 'individual';

    const PLANS = {
      individual: [
        { id: 'pw-life', nameEn: 'Password Whisper Lifetime', nameRu: 'Password Whisper Lifetime', subEn: 'One-time · Family Sharing incl.', subRu: 'Навсегда · Family Sharing вкл.', calc: () => 59.99, kind: 'life' },
        { id: 'pw-pro', nameEn: 'Password Whisper Pro', nameRu: 'Password Whisper Pro', subEn: '$19.99/yr · Family Sharing incl.', subRu: '$19.99/год · Family Sharing вкл.', calc: (y) => 19.99 * y, kind: 'pw' },
        { id: 'bw', nameEn: 'Bitwarden Premium', nameRu: 'Bitwarden Premium', subEn: '$19.80/yr · Electron/Web', subRu: '$19.80/год · Electron/веб', calc: (y) => 19.8 * y, kind: 'other' },
        { id: 'sb', nameEn: 'Strongbox Pro', nameRu: 'Strongbox Pro', subEn: '$24.99/yr (or $124.99 Lifetime)', subRu: '$24.99/год (или $124.99 Lifetime)', calc: (y) => Math.min(24.99 * y, 124.99), kind: 'other' },
        { id: 'pp', nameEn: 'Proton Pass Plus', nameRu: 'Proton Pass Plus', subEn: '~$35.88/yr · Cloud account', subRu: '~$35.88/год · Облачный аккаунт', calc: (y) => 35.88 * y, kind: 'other' },
        { id: '1p', nameEn: '1Password Individual', nameRu: '1Password Individual', subEn: '$35.88/yr · Cloud only, no Lifetime', subRu: '$35.88/год · Только облако', calc: (y) => 35.88 * y, kind: 'other' },
        { id: 'dl', nameEn: 'Dashlane Premium', nameRu: 'Dashlane Premium', subEn: '$59.88/yr · No Free plan', subRu: '$59.88/год · Без Free-тарифа', calc: (y) => 59.88 * y, kind: 'other' },
      ],
      family: [
        { id: 'pw-life', nameEn: 'Password Whisper Lifetime', nameRu: 'Password Whisper Lifetime', subEn: 'One-time · Up to 6 via Apple Family', subRu: 'Навсегда · До 6 чел. (Apple Family)', calc: () => 59.99, kind: 'life' },
        { id: 'pw-pro', nameEn: 'Password Whisper Pro', nameRu: 'Password Whisper Pro', subEn: '$19.99/yr · Up to 6 via Apple Family', subRu: '$19.99/год · До 6 чел. (Apple Family)', calc: (y) => 19.99 * y, kind: 'pw' },
        { id: 'sb', nameEn: 'Strongbox Pro (Family)', nameRu: 'Strongbox Pro (Семья)', subEn: '$24.99/yr (or $124.99 Lifetime)', subRu: '$24.99/год (или $124.99 Lifetime)', calc: (y) => Math.min(24.99 * y, 124.99), kind: 'other' },
        { id: 'bw', nameEn: 'Bitwarden Families', nameRu: 'Bitwarden Families', subEn: '$47.88/yr · Up to 6 users', subRu: '$47.88/год · До 6 человек', calc: (y) => 47.88 * y, kind: 'other' },
        { id: '1p', nameEn: '1Password Families', nameRu: '1Password Families', subEn: '$53.88/yr (5 users, +$1/mo extra)', subRu: '$53.88/год (5 чел., +$1/мес доп.)', calc: (y) => 53.88 * y, kind: 'other' },
        { id: 'pp', nameEn: 'Proton Pass Family', nameRu: 'Proton Pass Family', subEn: '~$59.88/yr · Up to 6 users', subRu: '~$59.88/год · До 6 человек', calc: (y) => 59.88 * y, kind: 'other' },
        { id: 'dl', nameEn: 'Dashlane Friends & Family', nameRu: 'Dashlane Friends & Family', subEn: '$89.88/yr · Cloud only', subRu: '$89.88/год · Только облако', calc: (y) => 89.88 * y, kind: 'other' },
      ],
    };

    function render() {
      const lang = getLang();
      yearBtns.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.tcoYears) === years)));
      modeBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tcoMode === mode)));

      const list = PLANS[mode].map((p) => ({ ...p, total: p.calc(years) }));
      const maxVal = Math.max(...list.map((p) => p.total), 1);

      container.innerHTML = '';
      list.forEach((item) => {
        const row = document.createElement('div');
        row.className = `tco-bar-row${item.kind === 'pw' ? ' tco-bar-row--pw' : item.kind === 'life' ? ' tco-bar-row--life' : ''}`;

        const nameEl = document.createElement('div');
        nameEl.className = 'tco-bar-name';
        nameEl.textContent = lang === 'ru' ? item.nameRu : item.nameEn;
        const small = document.createElement('small');
        small.textContent = lang === 'ru' ? item.subRu : item.subEn;
        nameEl.appendChild(small);

        const track = document.createElement('div');
        track.className = 'tco-bar-track';
        const fill = document.createElement('div');
        fill.className = 'tco-bar-fill';
        fill.style.width = `${Math.max(6, Math.round((item.total / maxVal) * 100))}%`;
        track.appendChild(fill);

        const val = document.createElement('div');
        val.className = 'tco-bar-val';
        val.textContent = `$${item.total.toFixed(0)}`;

        row.append(nameEl, track, val);
        container.appendChild(row);
      });

      const op = list.find((p) => p.id === '1p').total;
      const pwBest = Math.min(list.find((p) => p.id === 'pw-life').total, list.find((p) => p.id === 'pw-pro').total);
      const saved = Math.max(0, Math.round(op - pwBest));
      if (savingsEl) {
        if (lang === 'ru') {
          const yrWord = years === 1 ? '1 год' : years === 3 ? '3 года' : '5 лет';
          const who = mode === 'family' ? 'для семьи до 6 человек' : 'для 1 пользователя';
          savingsEl.textContent = `За ${yrWord} (${who}) Password Whisper экономит до $${saved} по сравнению с 1Password — без облачной привязки и вечной аренды.`;
        } else {
          const yrWord = years === 1 ? '1 year' : `${years} years`;
          const who = mode === 'family' ? 'family of up to 6' : 'individual';
          savingsEl.textContent = `Over ${yrWord} (${who}), Password Whisper saves up to $${saved} compared to 1Password — with local-first storage and no mandatory cloud lock-in.`;
        }
      }
    }

    yearBtns.forEach((b) => b.addEventListener('click', () => { years = Number(b.dataset.tcoYears); render(); }));
    modeBtns.forEach((b) => b.addEventListener('click', () => { mode = b.dataset.tcoMode; render(); }));

    render();
    return { refresh: render };
  }

  // =========================================================================
  // 11. Visual Context Before/After Slider (#86)
  // =========================================================================
  function initVisualBeforeAfter() {
    const stage = document.getElementById('compare-slider-stage');
    const range = document.getElementById('compare-slider-range');
    if (!stage || !range) return null;

    const caseBtns = Array.from(document.querySelectorAll('[data-visual-case]'));
    const beforeList = document.getElementById('compare-before-list');
    const afterList = document.getElementById('compare-after-list');

    const CASES = {
      cloud: [
        { title: 'Cloudflare', sub: 'admin@northstar.dev', env: 'PROD · EU', color: '#e47e6f' },
        { title: 'Cloudflare', sub: 'admin@northstar.dev', env: 'STAGING', color: '#ddba71' },
        { title: 'Cloudflare', sub: 'billing@northstar.dev', env: 'CLIENT B', color: '#95d4b4' },
      ],
      routers: [
        { title: '192.168.1.1', sub: 'admin', env: 'OFFICE WAN', color: '#ffb547' },
        { title: '192.168.1.1', sub: 'admin', env: 'HOME MESH', color: '#95d4b4' },
        { title: '192.168.88.1', sub: 'root · SSH', env: 'LAB RACK', color: '#8a7cff' },
      ],
      banks: [
        { title: 'Business Banking', sub: 'director@studio.io', env: 'LLC MAIN', color: '#95d4b4' },
        { title: 'Business Banking', sub: 'director@studio.io', env: 'TAX ESCROW', color: '#ddba71' },
        { title: 'Business Banking', sub: 'personal@mail.com', env: 'PERSONAL', color: '#7ad7df' },
      ],
    };

    let currentCase = 'cloud';

    function syncSplit() {
      stage.style.setProperty('--split', `${range.value}%`);
    }

    function renderCase(key) {
      currentCase = CASES[key] ? key : 'cloud';
      const lang = getLang();
      caseBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.visualCase === currentCase)));
      const items = CASES[currentCase];

      if (beforeList) {
        beforeList.innerHTML = items
          .map(
            (it) => `
          <div class="mock-popup-row">
            <div>
              <strong style="display:block;font-size:13.5px;color:var(--ink)">${it.title}</strong>
              <span class="mono-num" style="font-size:12px;color:var(--ink-dim)">${it.sub}</span>
            </div>
            <span class="chip chip--warn">${lang === 'ru' ? 'КАКОЙ ИЗ НИХ?' : 'WHICH ONE?'}</span>
          </div>`
          )
          .join('');
      }

      if (afterList) {
        afterList.innerHTML = items
          .map(
            (it) => `
          <div class="mock-popup-row mock-popup-row--visual">
            <div class="mock-thumb" style="border-color:${it.color}">
              <div class="mock-thumb-bar" style="width:65%;background:${it.color}"></div>
              <div class="mock-thumb-mask"></div>
              <div class="mock-thumb-bar" style="width:45%"></div>
            </div>
            <div>
              <strong style="display:block;font-size:13.5px;color:var(--ink)">${it.title} · ${it.env}</strong>
              <span class="mono-num" style="font-size:12px;color:var(--safe)">${lang === 'ru' ? 'Снимок входа + маска Vision' : 'Redacted login preview'}</span>
            </div>
            <span class="chip chip--safe">${lang === 'ru' ? 'ВСТАВИТЬ' : 'FILL'}</span>
          </div>`
          )
          .join('');
      }
    }

    range.addEventListener('input', syncSplit);
    caseBtns.forEach((b) => b.addEventListener('click', () => renderCase(b.dataset.visualCase)));

    syncSplit();
    renderCase('cloud');
    return { refresh: () => renderCase(currentCase) };
  }

  // =========================================================================
  // 12. Live Zero-Knowledge Web Crypto Visualizer (0 network requests!) (#86)
  // =========================================================================
  function initCryptoLab() {
    const siteInput = document.getElementById('lab-site');
    const userInput = document.getElementById('lab-user');
    const passInput = document.getElementById('lab-pass');
    const envOut = document.getElementById('lab-envelope-out');
    const shaPrefixEl = document.getElementById('lab-sha1-prefix');
    const shaSuffixEl = document.getElementById('lab-sha1-suffix');
    const genBtn = document.getElementById('lab-gen-btn');
    if (!siteInput || !passInput || !envOut) return null;

    const encoder = new TextEncoder();
    const toHex = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
    const toB64 = (bytes) => btoa(String.fromCharCode(...bytes));

    let cachedKey = null;
    async function getDemoKey() {
      if (cachedKey) return cachedKey;
      if (!window.crypto?.subtle) return null;
      cachedKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt']);
      return cachedKey;
    }

    async function compute() {
      const payloadObj = {
        site: siteInput.value || 'console.aws.amazon.com',
        username: userInput?.value || 'ops@northstar.dev',
        password: passInput.value || 'correct-horse-battery-staple',
      };
      const payloadBytes = encoder.encode(JSON.stringify(payloadObj));
      const vaultId = '9F4A2C10-7B3E-4D9A-B12F-0E8A44C1D21E';
      const itemId = '4E11A9C2-11B0-4F2C-8D41-9A0C77B2E80C';
      const aadText = `sentinel.item.v1|${vaultId}|${itemId}`;

      try {
        const key = await getDemoKey();
        if (key) {
          const nonce = crypto.getRandomValues(new Uint8Array(12));
          const encrypted = new Uint8Array(
            await crypto.subtle.encrypt(
              { name: 'AES-GCM', iv: nonce, additionalData: encoder.encode(aadText), tagLength: 128 },
              key,
              payloadBytes
            )
          );
          const ct = encrypted.slice(0, encrypted.length - 16);
          const tag = encrypted.slice(encrypted.length - 16);

          envOut.textContent = JSON.stringify(
            {
              vaultID: vaultId,
              objectID: itemId,
              objectType: 'vault_item',
              aad: aadText,
              nonce: toB64(nonce),
              ciphertext: toB64(ct),
              tag: toB64(tag),
            },
            null,
            2
          );

          const sha1Buf = await crypto.subtle.digest('SHA-1', encoder.encode(payloadObj.password));
          const sha1Hex = toHex(sha1Buf).toUpperCase();
          if (shaPrefixEl) shaPrefixEl.textContent = sha1Hex.slice(0, 5);
          if (shaSuffixEl) shaSuffixEl.textContent = sha1Hex.slice(5);
        }
      } catch (_) {
        envOut.textContent = '// Web Crypto API unavailable in insecure context';
      }
    }

    [siteInput, userInput, passInput].forEach((el) => {
      if (el) el.addEventListener('input', compute);
    });

    if (genBtn) {
      genBtn.addEventListener('click', () => {
        const words = ['amber', 'prism', 'cedar', 'quartz', 'orbit', 'velvet', 'cobalt', 'harbor', 'linen', 'signal'];
        const rnd = new Uint32Array(4);
        crypto.getRandomValues(rnd);
        passInput.value = Array.from(rnd, (n) => words[n % words.length]).join('-') + '-' + (10 + (rnd[0] % 89));
        compute();
      });
    }

    compute();
    return { refresh: compute };
  }

  // =========================================================================
  // 13. 5-Slide Interactive Product Storyboard with Pause/Play (#86)
  //     Follows WCAG 2.2.2 (`motion` guide): visible Pause/Play button,
  //     NO aria-pressed when label changes, static default on reduced motion.
  // =========================================================================
  function initStoryboard(irisCtrl) {
    const rootEl = document.getElementById('product-storyboard');
    if (!rootEl) return null;

    const pills = Array.from(rootEl.querySelectorAll('.storyboard-pill'));
    const titleEl = document.getElementById('sb-title');
    const bodyEl = document.getElementById('sb-body');
    const tagEl = document.getElementById('sb-tag');
    const visualEl = document.getElementById('sb-visual');
    const prevBtn = document.getElementById('sb-prev');
    const nextBtn = document.getElementById('sb-next');
    const toggleBtn = document.getElementById('sb-play-toggle');

    const SLIDES = [
      {
        stop: 2,
        tag: '01 · VISUAL CONTEXT',
        ru: [
          'Снимок окна входа + Apple Vision Smart Redaction',
          'Выберите окно на Mac (или нажмите «Поделиться → Password Whisper» на iPhone). Нейросеть Apple Vision локально найдёт email, пароли и коды и необратимо запечёт маски в пиксели перед сжатием в HEIC (~54 КБ).',
          `[SCContentSharingPicker] -> 1440×900 capture\n[Apple Vision OCR]       -> 3 sensitive regions found (on-device)\n[Pixel Burn-in]          -> masks baked permanently · EXIF/GPS = 0\n[AES-256-GCM + RAM]      -> 54 KB encrypted blob`,
        ],
        en: [
          'Login Window Snapshot + Apple Vision Smart Redaction',
          'Pick any window on Mac (or tap Share → Password Whisper on iPhone). On-device Apple Vision detects emails, passwords, and codes and burns masks permanently into pixels before HEIC compression (~54 KB).',
          `[SCContentSharingPicker] -> 1440×900 capture\n[Apple Vision OCR]       -> 3 sensitive regions found (on-device)\n[Pixel Burn-in]          -> masks baked permanently · EXIF/GPS = 0\n[AES-256-GCM + RAM]      -> 54 KB encrypted blob`,
        ],
      },
      {
        stop: 4,
        tag: '02 · AUTOFILL & HUD ⌥⌘P',
        ru: [
          'Мгновенный вход в Safari, Chrome, Brave, Opera и Firefox',
          'Нажмите ⌥⌘P или откройте расширение браузера — сверху окажутся карточки для открытого сайта с замаскированным превью и живым 6-значным 2FA TOTP. Антифишинг проверяет точный домен, порт и HTTPS.',
          `Active Tab: https://one.dash.cloudflare.com:443/northstar\nMatch:      EXACT ORIGIN (HTTPS verified · PSL pass)\nPreview:    [Redacted Login Card] · TOTP 529 813\nChannel:    Local Native Messaging (stdio · 0 cloud hops)`,
        ],
        en: [
          'Instant AutoFill across Safari, Chrome, Brave, Opera & Firefox',
          'Press ⌥⌘P or open your browser popup to see matching logins with redacted visual previews and live 6-digit 2FA TOTP codes. Anti-phishing enforces exact domain, port, and HTTPS checks.',
          `Active Tab: https://one.dash.cloudflare.com:443/northstar\nMatch:      EXACT ORIGIN (HTTPS verified · PSL pass)\nPreview:    [Redacted Login Card] · TOTP 529 813\nChannel:    Local Native Messaging (stdio · 0 cloud hops)`,
        ],
      },
      {
        stop: 3,
        tag: '03 · LOCAL-FIRST + ICLOUD',
        ru: [
          'Локальный сейф на устройстве ↔ Личный iCloud для синхронизации',
          'Ваши пароли всегда лежат локально в .whispervault и работают без интернета. Когда включён iCloud, между Mac, iPhone и iPad передаётся только шифротекст через вашу приватную зону CloudKit — минуя сторонние серверы.',
          `Mac (.whispervault)  ===[ AES-256-GCM ]===> Personal iCloud\n                                                   |\niPhone / iPad        <===[ AES-256-GCM ]===========+\nDeveloper Servers:   [ 0 BYTES · NONE ]`,
        ],
        en: [
          'Local Vault on Device ↔ Personal iCloud Sync Only',
          'Your passwords always live locally in .whispervault and work offline. When iCloud is turned on, only ciphertext travels between your Mac, iPhone, and iPad via your private CloudKit zone — bypassing third-party servers.',
          `Mac (.whispervault)  ===[ AES-256-GCM ]===> Personal iCloud\n                                                   |\niPhone / iPad        <===[ AES-256-GCM ]===========+\nDeveloper Servers:   [ 0 BYTES · NONE ]`,
        ],
      },
      {
        stop: 5,
        tag: '04 · DEVELOPER SECRETS (v1.4)',
        ru: [
          'Зашифрованные файлы .p8, .p12, .pem, .mobileprovision и SSH',
          'В версии 1.4.0 храните ключи App Store Connect / APNs, сертификаты и SSH-конфиги рядом с учётками. Автоматический парсинг Key ID, предупреждения об истечении срока в аудите и копирование SSH-команды в 1 клик.',
          `File:      AuthKey_9X4K2.p8 (AES-256-GCM CKAsset)\nParsed:    Apple API Key · Key ID: 9X4K2 · Valid 312 days\nAction:    Copy PEM / Base64 (ClipboardGuard · 25s auto-clear)\nRAM:       withDecryptedBlob() -> memset_s() after copy`,
        ],
        en: [
          'Encrypted .p8, .p12, .pem, .mobileprovision & SSH Keys (v1.4)',
          'Version 1.4.0 stores App Store Connect / APNs keys, certificates, and SSH credentials right in your vault. Automatic Key ID detection, expiring certificate alerts in Security Audit, and 1-click SSH command copy.',
          `File:      AuthKey_9X4K2.p8 (AES-256-GCM CKAsset)\nParsed:    Apple API Key · Key ID: 9X4K2 · Valid 312 days\nAction:    Copy PEM / Base64 (ClipboardGuard · 25s auto-clear)\nRAM:       withDecryptedBlob() -> memset_s() after copy`,
        ],
      },
      {
        stop: 6,
        tag: '05 · RECOVERY KIT & MERGE',
        ru: [
          'Печатный Recovery Kit PDF и слияние офлайн-правок без потерь',
          'Поскольку мы не храним ваш мастер-пароль, при создании сейфа формируется Recovery Kit PDF (PS1-XXXX-…). А если вы правили запись офлайн на Mac и iPhone одновременно, обе версии и их скриншоты сохраняются.',
          `Recovery Key:  PS1-XXXX-XXXX-XXXX-XXXX (offline paper backup)\nOffline Merge: Mac rev#4 + iPhone rev#4 -> deterministic merge\nPassword Hist: Previous secret preserved in revision history\nNo-Hostage:    Export CSV / .whispervault anytime even on Free`,
        ],
        en: [
          'Printable Recovery Kit PDF & Lossless Offline Conflict Merge',
          'Because we never store your Master Password, setup creates an offline Recovery Kit PDF (PS1-XXXX-…). And if you edit the same item offline on Mac and iPhone, deterministic merging keeps both revisions and screenshots.',
          `Recovery Key:  PS1-XXXX-XXXX-XXXX-XXXX (offline paper backup)\nOffline Merge: Mac rev#4 + iPhone rev#4 -> deterministic merge\nPassword Hist: Previous secret preserved in revision history\nNo-Hostage:    Export CSV / .whispervault anytime even on Free`,
        ],
      },
    ];

    let current = 0;
    let playing = !reduceMotionQuery.matches;
    let timer = null;

    function updateToggleLabel() {
      if (!toggleBtn) return;
      const lang = getLang();
      toggleBtn.textContent = playing
        ? lang === 'ru' ? 'Пауза' : 'Pause'
        : lang === 'ru' ? 'Воспроизвести' : 'Play';
    }

    function show(idx, syncIris = false) {
      current = (idx + SLIDES.length) % SLIDES.length;
      const slide = SLIDES[current];
      const copy = slide[getLang()];

      pills.forEach((p, i) => {
        if (i === current) p.setAttribute('aria-current', 'step');
        else p.removeAttribute('aria-current');
      });

      if (tagEl) tagEl.textContent = slide.tag;
      if (titleEl) titleEl.textContent = copy[0];
      if (bodyEl) bodyEl.textContent = copy[1];
      if (visualEl) visualEl.textContent = copy[2];
      if (syncIris && irisCtrl) irisCtrl.goToStop(slide.stop);
    }

    function stopAuto() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function startAuto() {
      stopAuto();
      if (!playing) return;
      timer = setInterval(() => show(current + 1, false), 5500);
    }

    pills.forEach((p, i) => p.addEventListener('click', () => { show(i, false); if (playing) startAuto(); }));
    if (prevBtn) prevBtn.addEventListener('click', () => { show(current - 1, false); if (playing) startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { show(current + 1, false); if (playing) startAuto(); });
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        playing = !playing;
        updateToggleLabel();
        if (playing) startAuto();
        else stopAuto();
      });
    }

    show(0, false);
    updateToggleLabel();
    startAuto();

    return {
      refresh: () => {
        show(current, false);
        updateToggleLabel();
      },
    };
  }

  // =========================================================================
  // 14. 2-Minute Migration Wizard (#87)
  // =========================================================================
  function initMigrationWizard() {
    const btns = Array.from(document.querySelectorAll('.monogram-btn[data-mig-source]'));
    const stepsEl = document.getElementById('migration-steps-out');
    if (!btns.length || !stepsEl) return null;

    const GUIDES = {
      '1p': {
        ru: [
          ['Экспорт из 1Password', 'В приложении 1Password на Mac откройте Файл → Экспорт → выберите сейф и формат CSV (или 1PUX/JSON).'],
          ['Импорт в Password Whisper', 'Откройте Настройки → Перенос данных → Импорт CSV/JSON. Выберите пресет 1Password — поля, URL и 2FA распознаются автоматически с защитой от дубликатов.'],
          ['Удалите временный CSV', 'После проверки записей безвозвратно очистите временный файл экспорта из «Корзины» — дальше всё хранится зашифрованным в .whispervault.'],
        ],
        en: [
          'Export from 1Password',
          'Import into Password Whisper',
          'Delete temporary CSV',
        ],
        enSteps: [
          ['Export from 1Password', 'In 1Password on Mac, go to File → Export → choose your vault and export as CSV (or JSON).'],
          ['Import into Password Whisper', 'Open Settings → Data Transfer → Import CSV/JSON. Pick the 1Password preset — logins, URLs, notes, and 2FA map cleanly with automatic deduplication.'],
          ['Securely delete temporary export', 'Verify your imported vault, then permanently delete the temporary plaintext CSV from Trash — everything now lives encrypted inside .whispervault.'],
        ],
      },
      ap: {
        ru: [
          ['Экспорт из Apple Passwords / Safari', 'На Mac откройте приложение «Пароли» (или Safari → Настройки → Пароли) → Файл → Экспортировать все пароли в CSV.'],
          ['Импорт в Password Whisper', 'В Password Whisper откройте Перенос данных → Импорт CSV (пресет Apple / Safari). Все логины и TOTP-коды загрузятся за секунды.'],
          ['Удалите CSV и включите AutoFill', 'Удалите временный CSV-файл и включите Password Whisper в системном AutoFill на Mac и iPhone.'],
        ],
        enSteps: [
          ['Export from Apple Passwords / Safari', 'On Mac, open the Passwords app (or Safari → Settings → Passwords) → File → Export All Passwords to CSV.'],
          ['Import into Password Whisper', 'In Password Whisper, choose Data Transfer → Import CSV (Apple / Safari preset). Logins and TOTP secrets import cleanly with deduplication.'],
          ['Remove CSV & enable AutoFill', 'Permanently delete the exported CSV and switch on Password Whisper in System AutoFill on Mac and iPhone.'],
        ],
      },
      bw: {
        ru: [
          ['Экспорт из Bitwarden', 'В веб-сейфе или приложении Bitwarden откройте Инструменты → Экспорт хранилища → выберите формат JSON или CSV.'],
          ['Импорт в Password Whisper', 'Выберите Импорт CSV/JSON → пресет Bitwarden. Сохранятся пароли, URI, заметки, TOTP и структура категорий.'],
          ['Очистите экспорт и включите iCloud', 'Удалите незашифрованный файл экспорта и при желании включите синхронизацию через личный Apple iCloud.'],
        ],
        enSteps: [
          ['Export from Bitwarden', 'In Bitwarden Web or Desktop, open Tools → Export Vault → choose JSON or CSV.'],
          ['Import into Password Whisper', 'Open Import CSV/JSON → Bitwarden preset. Passwords, URIs, notes, TOTP, and categories import cleanly.'],
          ['Delete export & enable iCloud', 'Permanently delete the plaintext export file and optionally enable personal Apple iCloud E2EE sync.'],
        ],
      },
      ch: {
        ru: [
          ['Экспорт из Google Chrome / Brave / Opera', 'Откройте Менеджер паролей Chrome → Настройки → Экспорт паролей → сохраните CSV-файл.'],
          ['Импорт и первый осмотр', 'Загрузите CSV в Password Whisper (пресет Chrome) и сразу запустите офлайн-аудит «Защита N из 100» для поиска дубликатов.'],
          ['Подключите расширение v1.3.1', 'Удалите временный CSV и установите расширение Password Whisper из Chrome Web Store для локального автозаполнения.'],
        ],
        enSteps: [
          ['Export from Chrome / Brave / Opera', 'Open Chrome Password Manager → Settings → Export passwords → save the CSV file.'],
          ['Import & run offline audit', 'Import the CSV into Password Whisper (Chrome preset) and run the instant offline Security Audit to spot reused passwords.'],
          ['Connect Extension v1.3.1', 'Delete the plaintext CSV and install the Password Whisper Chrome Web Store extension for local Native Messaging autofill.'],
        ],
      },
      ff: {
        ru: [
          ['Экспорт из Mozilla Firefox', 'В Firefox откройте Пароли (about:logins) → меню «⋯» → Экспорт логинов в CSV.'],
          ['Импорт в Password Whisper', 'Откройте Перенос данных → Импорт CSV (пресет Firefox) с автоматической очисткой дублей.'],
          ['Подключите расширение Firefox AMO', 'Удалите временный CSV и подключите расширение Password Whisper из Firefox Add-ons через Настройки → Браузеры.'],
        ],
        enSteps: [
          ['Export from Mozilla Firefox', 'In Firefox, open Passwords (about:logins) → "⋯" menu → Export Logins to CSV.'],
          ['Import into Password Whisper', 'Open Data Transfer → Import CSV (Firefox preset) with automatic deduplication.'],
          ['Connect Firefox AMO extension', 'Delete the temporary CSV and connect the Password Whisper Firefox Add-on via Settings → Browsers.'],
        ],
      },
      kp: {
        ru: [
          ['Экспорт из KeePass / Strongbox', 'В Strongbox или KeePassXC откройте База данных → Экспорт → CSV-файл.'],
          ['Импорт в Password Whisper', 'Выберите пресет KeePass CSV — записи автоматически разложатся по категориям без привязки к монолитному .kdbx.'],
          ['Переход на по-объектный .whispervault', 'Удалите временный CSV. Теперь офлайн-правки на Mac и iPhone сливаются автоматически без конфликтов целого файла.'],
        ],
        enSteps: [
          ['Export from KeePass / Strongbox', 'In Strongbox or KeePassXC, choose Database → Export → CSV file.'],
          ['Import into Password Whisper', 'Pick the KeePass CSV preset — entries map cleanly into structured categories without monolithic .kdbx files.'],
          ['Enjoy per-object .whispervault', 'Delete the temporary CSV. Offline edits across Mac and iPhone now merge deterministically without whole-file conflicts.'],
        ],
      },
    };

    let current = '1p';

    function render(source) {
      current = GUIDES[source] ? source : '1p';
      const lang = getLang();
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.migSource === current)));
      const list = lang === 'ru' ? GUIDES[current].ru : GUIDES[current].enSteps;
      stepsEl.innerHTML = list
        .map(
          ([title, desc], idx) => `
        <article class="step-card">
          <span class="step-num">${lang === 'ru' ? `ШАГ 0${idx + 1}` : `STEP 0${idx + 1}`}</span>
          <h3>${title}</h3>
          <p>${desc}</p>
        </article>`
        )
        .join('');
    }

    btns.forEach((b) => b.addEventListener('click', () => render(b.dataset.migSource)));
    render('1p');
    return { refresh: () => render(current) };
  }

  // =========================================================================
  // 15. Accessible Tabs Controller (focusgroup + keyboard fallback + beforematch)
  // =========================================================================
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach((tabsRoot) => {
      const tablist = tabsRoot.querySelector('[role="tablist"]');
      if (!tablist) return;
      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
      const panels = Array.from(tabsRoot.querySelectorAll(':scope > .tab-panels-stack > [role="tabpanel"]'));

      function activate(selectedTab, moveFocus = false) {
        tabs.forEach((tab, idx) => {
          const isSelected = tab === selectedTab;
          tab.setAttribute('aria-selected', String(isSelected));
          tab.toggleAttribute('focusgroupstart', isSelected);
          tab.tabIndex = isSelected ? 0 : -1;

          const panel = panels[idx];
          if (panel) {
            if (isSelected) {
              panel.hidden = false;
            } else {
              panel.hidden = 'until-found';
            }
          }
        });

        try {
          selectedTab.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
        } catch (_) {
          selectedTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }

        if (moveFocus) selectedTab.focus();
      }

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => activate(tab, false));
        tab.addEventListener('keydown', (event) => {
          const current = tabs.indexOf(tab);
          let next = null;
          if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          if (next !== null) {
            event.preventDefault();
            activate(tabs[next], true);
          }
        });
      });

      panels.forEach((panel, idx) => {
        panel.addEventListener('beforematch', () => {
          if (tabs[idx]) activate(tabs[idx], false);
        });
      });
    });
  }

  // =========================================================================
  // 16. Native <dialog closedby="any"> Screenshot Lightbox + Safari Fallback
  // =========================================================================
  function attachDialogBackdropFallback(dialog) {
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const inside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!inside) dialog.close();
    });
  }

  function initLightbox() {
    const dialog = document.getElementById('shot-lightbox');
    if (!dialog) return;

    attachDialogBackdropFallback(dialog);

    const imgEl = document.getElementById('lightbox-img');
    const titleEl = document.getElementById('lightbox-title');
    const descEl = document.getElementById('lightbox-desc');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let currentGroup = [];
    let currentIndex = 0;

    function showAt(idx) {
      if (!currentGroup.length) return;
      currentIndex = (idx + currentGroup.length) % currentGroup.length;
      const trigger = currentGroup[currentIndex];
      const img = trigger.querySelector('img');
      const card = trigger.closest('.shot-card');
      const lang = getLang();

      if (img && imgEl) {
        imgEl.src = img.currentSrc || img.src;
        imgEl.alt = img.alt || '';
      }

      if (titleEl) {
        const heading = card?.querySelector(`h3 [data-lang="${lang}"]`) || card?.querySelector('h3');
        titleEl.textContent = heading?.textContent?.trim() || trigger.dataset[`title${lang === 'ru' ? 'Ru' : 'En'}`] || img?.alt || 'Password Whisper';
      }

      if (descEl) {
        const sub = card?.querySelector(`p [data-lang="${lang}"]`) || card?.querySelector('p');
        descEl.textContent = sub?.textContent?.trim() || `${currentIndex + 1} / ${currentGroup.length}`;
      }

      const multi = currentGroup.length > 1;
      if (prevBtn) prevBtn.hidden = !multi;
      if (nextBtn) nextBtn.hidden = !multi;
    }

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-lightbox-group]');
      if (!trigger) return;
      const groupName = trigger.dataset.lightboxGroup;
      currentGroup = Array.from(document.querySelectorAll(`[data-lightbox-group="${CSS.escape(groupName)}"]`));
      currentIndex = Math.max(0, currentGroup.indexOf(trigger));
      showAt(currentIndex);
      dialog.showModal();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => showAt(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showAt(currentIndex + 1));

    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') showAt(currentIndex - 1);
      else if (event.key === 'ArrowRight') showAt(currentIndex + 1);
    });
  }

  // =========================================================================
  // 17. Mobile Navigation <dialog> Drawer
  // =========================================================================
  function initMobileDrawer() {
    const drawer = document.getElementById('mobile-nav-drawer');
    const openBtn = document.getElementById('mobile-menu-open');
    if (!drawer || !openBtn) return;

    attachDialogBackdropFallback(drawer);
    openBtn.addEventListener('click', () => drawer.showModal());
    drawer.addEventListener('click', (event) => {
      if (event.target.closest('a[href]')) drawer.close();
    });
  }

  // =========================================================================
  // 18. Accordion Expand/Collapse All (Invoker Commands + Fallback)
  // =========================================================================
  function initAccordionToggleAll() {
    function toggleGroup(section, btn) {
      const expand = btn.getAttribute('aria-expanded') !== 'true';
      section.querySelectorAll('details.faq-item').forEach((d) => {
        d.open = expand;
      });
      btn.setAttribute('aria-expanded', String(expand));
    }

    document.addEventListener(
      'command',
      (event) => {
        if (event.command !== '--toggle-all') return;
        toggleGroup(event.target, event.source);
      },
      { capture: true }
    );

    if (!('CommandEvent' in window)) {
      document.addEventListener('click', (event) => {
        const btn = event.target.closest('[command="--toggle-all"][commandfor]');
        if (!btn) return;
        const target = document.getElementById(btn.getAttribute('commandfor'));
        if (target) toggleGroup(target, btn);
      });
    }

    document.addEventListener(
      'toggle',
      (event) => {
        const details = event.target;
        if (!(details instanceof HTMLDetailsElement) || !details.classList.contains('faq-item')) return;
        const section = details.closest('[data-accordion-group]');
        if (!section) return;
        const btn = section.querySelector('[command="--toggle-all"]');
        if (!btn) return;
        const all = Array.from(section.querySelectorAll('details.faq-item'));
        btn.setAttribute('aria-expanded', String(all.every((d) => d.open)));
      },
      { capture: true }
    );
  }

  // =========================================================================
  // 19. Scroll Reveal Fallback (Only when native CSS view() is unsupported)
  // =========================================================================
  function initScrollRevealFallback() {
    const supportsViewTimeline =
      typeof CSS !== 'undefined' &&
      CSS.supports('(animation-timeline: view()) and (animation-range: entry)');

    if (supportsViewTimeline || reduceMotionQuery.matches) return;

    const els = document.querySelectorAll('.reveal');
    if (!els.length || !('IntersectionObserver' in window)) return;

    els.forEach((el) => el.classList.add('reveal-io-ready'));

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-io-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
  }

  // =========================================================================
  // Boot
  // =========================================================================
  initThemes();
  initLanguage();

  const iris = initIris();
  const redaction = initRedactionDemo();
  const audit = initAuditDemo();
  const pipeline = initPipeline();
  const observerMatrix = initObserverMatrix();
  const verifyChecklist = initVerifyChecklist();
  initCopyButtons();
  initComparisonMatrix();
  const tco = initTcoCalculator();
  const visualCompare = initVisualBeforeAfter();
  const cryptoLab = initCryptoLab();
  const storyboard = initStoryboard(iris);
  const migration = initMigrationWizard();

  window.__pwRefreshWidgets = () => {
    iris?.updateReadout();
    redaction?.updateStatus();
    audit?.render();
    pipeline?.refresh();
    observerMatrix?.refresh();
    verifyChecklist?.refresh();
    tco?.refresh();
    visualCompare?.refresh();
    cryptoLab?.refresh();
    storyboard?.refresh();
    migration?.refresh();
  };

  initTabs();
  initLightbox();
  initMobileDrawer();
  initAccordionToggleAll();
  initScrollRevealFallback();
})();
