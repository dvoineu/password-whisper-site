/* ==========================================================================
   Password Whisper — Interactive Site Engine (Zero Dependencies)
   - Authentic 9-Blade Optical Diaphragm (Iris) ported from SentinelIrisRenderer.swift
   - Awakening intro choreography ported from FirstLaunchIntroView.swift
   - Theme switching synced with <meta name="color-scheme"> (Night / Dusk / Day / System)
   - Instant RU / EN switcher with localized v1.3.0 screenshots
   - Interactive Smart Redaction Studio, Security Audit Ring, E2EE Pipeline
   - Accessible Tabs (focusgroup + keyboard fallback + beforematch), Native <dialog> Lightbox,
     Accordion Expand/Collapse All, and Scroll-Driven Reveal IntersectionObserver fallback
   ========================================================================== */

(() => {
  'use strict';

  const THEME_KEY = 'pw-site-theme';
  const LANG_KEY = 'pw-site-lang';
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
      } catch (_) {
        // Ignore storage errors in restricted browsing modes
      }
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
  // 2. Bilingual RU / EN Engine + Localized v1.3.0 Screenshots
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

    // Swap localized v1.3.0 app screenshots
    document.querySelectorAll('img[data-shot-file]').forEach((img) => {
      const prefix = img.dataset.shotPrefix || 'assets/screenshots/';
      const file = img.dataset.shotFile;
      img.src = `${prefix}${normalized}/${file}`;
      const altText = normalized === 'ru' ? img.dataset.altRu : img.dataset.altEn;
      if (altText) img.alt = altText;
    });

    // Refresh dynamic widget labels
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
        ru: ['Сейф заперт', 'Лепестки сведены. Ключ затёрт в памяти; расшифровка невозможна без мастер-пароля или биометрии.'],
        en: ['Vault locked', 'Blades closed. Keys are wiped from RAM; nothing decrypts without your master password or biometrics.'],
      },
      {
        stop: 'f/16',
        ru: ['Ключ Argon2id', 'Ключ выводится локально в оперативной памяти (RFC 9106, 64 МиБ) с защитой от перебора на GPU.'],
        en: ['Argon2id key derivation', 'Derived locally in memory (RFC 9106, 64 MiB) with GPU-resistant memory hardness.'],
      },
      {
        stop: 'f/11',
        ru: ['Vision Smart Redaction', 'Apple Vision находит email, пароли и токены на скриншоте входа и необратимо запекает маски в HEIC.'],
        en: ['Vision Smart Redaction', 'Apple Vision locates emails, passwords, and tokens on login screenshots and burns masks into HEIC.'],
      },
      {
        stop: 'f/8',
        ru: ['AutoFill и Passkeys', 'Системное автозаполнение паролей, 2FA TOTP и ключей доступа Passkeys на iPhone, iPad и Mac.'],
        en: ['AutoFill & Passkeys', 'System-wide autofill for passwords, 2FA TOTP codes, and passkeys on iPhone, iPad, and Mac.'],
      },
      {
        stop: 'f/5.6',
        ru: ['Safari, Chrome и Firefox', 'Встроенное расширение Safari + локальный мост Native Messaging v1.3.1 для Chrome, Brave, Opera и Firefox.'],
        en: ['Safari, Chrome & Firefox', 'Bundled Safari Web Extension plus local Native Messaging v1.3.1 for Chrome, Brave, Opera, and Firefox.'],
      },
      {
        stop: 'f/4',
        ru: ['Личный iCloud (E2EE)', 'По-объектная синхронизация через вашу приватную зону CloudKit. Никаких сторонних серверов.'],
        en: ['Personal iCloud (E2EE)', 'Per-item sync through your private CloudKit zone. Zero developer servers.'],
      },
      {
        stop: 'f/2.8',
        ru: ['Хранилище открыто', 'Полный доступ по Face ID или встроенному Touch ID с автоблокировкой и защищённым буфером обмена.'],
        en: ['Vault unlocked', 'Instant Face ID or embedded macOS Touch ID unlock with auto-lock and local-only clipboard guard.'],
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

      // 1. Outer 96-tick lens ring & f-stop markings
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

        // Fixed top index triangle
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

      // 2. 9-blade geometry
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

      // 3. Optical multi-coating sweep (strictly on the blades)
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

      // 4. Aperture pupil + amber rim glow (Path2D keeps 9-gon path intact across specular glint)
      if (state.assembly >= 0.94 && innerR > 0.6) {
        const holePath = new Path2D();
        V.forEach((pt, idx) => (idx ? holePath.lineTo(pt[0], pt[1]) : holePath.moveTo(pt[0], pt[1])));
        holePath.closePath();

        const pGrad = ctx.createRadialGradient(
          cx - innerR * 0.18,
          cy - innerR * 0.2,
          0,
          cx,
          cy,
          Math.max(4, innerR * 1.25)
        );
        pGrad.addColorStop(0, 'rgba(26, 32, 48, 0.94)');
        pGrad.addColorStop(1, 'rgba(6, 8, 13, 0.98)');
        ctx.fillStyle = pGrad;
        ctx.fill(holePath);

        // Subtle optical specular glints inside pupil
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

    // Authentic app Awakening intro choreography (~2.65s total, settles statically at f/8)
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
        const speedTime = elapsed * 1.65; // Matches SentinelTheme.Motion.introPlaybackSpeed

        state.assembly = easeOutCubic(clamp01((speedTime - 0.35) / 1.1));
        state.ringProgress = easeOutCubic(clamp01((speedTime - 1.4) / 0.85));

        // Snap open from f/22 to f/8 as coating flashes across the blades
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
    if (replayBtn) {
      replayBtn.addEventListener('click', playAwakeningIntro);
    }

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

    return { updateReadout };
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
            ? allMasked
              ? 'Проверить под маской'
              : 'Замаскировать всё (Vision OCR)'
            : allMasked
              ? 'Peek under masks'
              : 'Mask all (Vision OCR)';
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
      const offset = circumference * (1 - score / 100);
      arc.style.strokeDashoffset = String(offset);
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
              ? 'Проверка утечек (Zero-Log HIBP): 0 утечек'
              : 'Zero-Log HIBP breach check: 0 exposures'
            : lang === 'ru'
              ? '1 запись без снимка входа и 2FA'
              : '1 entry missing login screenshot & 2FA';
        }
      }

      btn.textContent = hardened
        ? lang === 'ru'
          ? 'Сбросить демо (87 / 100)'
          : 'Reset demo (87 / 100)'
        : lang === 'ru'
          ? 'Усилить до 100 / 100'
          : 'Fix issues to 100 / 100';
    }

    btn.addEventListener('click', () => {
      hardened = !hardened;
      render();
    });

    render();
    return { render };
  }

  // =========================================================================
  // 6. Interactive E2EE Pipeline Selector
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
          'Пароль никогда не записывается на диск и не отправляется по сети. При блокировке или выходе ключ мгновенно затирается в RAM (`SecureBytes`).',
          'ТОЛЬКО НА УСТРОЙСТВЕ',
          'masterPassword -> memory only (zero disk writes)',
        ],
        en: [
          '1. Your Master Password stays only in your memory',
          'It is never written to disk or sent over the network. When you lock the vault, secrets are zeroed out in RAM via SecureBytes.',
          'ON DEVICE ONLY',
          'masterPassword -> memory only (zero disk writes)',
        ],
      },
      {
        ru: [
          '2. Argon2id (RFC 9106) выводит ключ обёртки',
          'Памятеёмкий алгоритм Argon2id (64 МиБ, 3 прохода, 4 полосы) разворачивает случайный 256-битный VaultKey из `vault.header`. Параллельно существует независимая обёртка для печатного Recovery Key.',
          'ЗАЩИТА ОТ ПЕРЕБОРА GPU',
          'Argon2id(64 MiB, t=3, p=4, salt) -> MasterKEK -> VaultKey',
        ],
        en: [
          '2. Argon2id (RFC 9106) unwraps the VaultKey',
          'Memory-hard Argon2id (64 MiB, 3 iterations, 4 lanes) unwraps your random 256-bit VaultKey from vault.header. A separate envelope supports your printable Recovery Kit.',
          'GPU-RESISTANT KDF',
          'Argon2id(64 MiB, t=3, p=4, salt) -> MasterKEK -> VaultKey',
        ],
      },
      {
        ru: [
          '3. По-объектное шифрование AES-256-GCM + AAD',
          'Каждая запись и каждый замаскированный HEIC-скриншот запечатываются отдельным одноразовым nonce и криптографической привязкой AAD к `vaultID` и `itemID` — подменить или подложить файл невозможно.',
          'АУТЕНТИФИЦИРОВАННОЕ ШИФРОВАНИЕ',
          'AES-256-GCM(VaultKey, nonce, AAD=vaultID|itemID) -> .enc',
        ],
        en: [
          '3. Per-item AES-256-GCM + AAD envelope encryption',
          'Every login, passkey, card, and redacted HEIC screenshot is sealed with a unique nonce and AAD bound to vaultID and itemID so files cannot be swapped or tampered with.',
          'AUTHENTICATED ENCRYPTION',
          'AES-256-GCM(VaultKey, nonce, AAD=vaultID|itemID) -> .enc',
        ],
      },
      {
        ru: [
          '4. Локальный пакет .whispervault без монолитной базы',
          'Каждая запись лежит отдельным файлом (`items/<uuid>.item.enc`, `blobs/<sha256>.blob.enc`). Офлайн-правки на Mac и iPhone сливаются детерминированно, сохраняя историю паролей без потерь.',
          'LOCAL-FIRST ХРАНИЛИЩЕ',
          'Primary.whispervault/{vault.header, items/*.enc, blobs/*.enc}',
        ],
        en: [
          '4. Local-first .whispervault package — no monolithic lock-in',
          'Each entry is stored as its own encrypted file (items/<uuid>.item.enc, blobs/<sha256>.blob.enc). Offline edits across Mac and iPhone merge deterministically without losing password history.',
          'LOCAL-FIRST STORAGE',
          'Primary.whispervault/{vault.header, items/*.enc, blobs/*.enc}',
        ],
      },
      {
        ru: [
          '5. Синхронизация только через ваш личный Apple iCloud',
          'Если синхронизация включена для сейфа, `CKSyncEngine` отправляет исключительно шифротекст в вашу приватную базу CloudKit (`SentinelVaultZone`). У разработчика нет серверов и доступа к вашим данным.',
          'НОЛЬ СЕРВЕРОВ РАЗРАБОТЧИКА',
          'Private CloudKit -> SentinelVaultZone (ciphertext only)',
        ],
        en: [
          '5. Optional sync strictly through your personal Apple iCloud',
          'When enabled per vault, CKSyncEngine syncs only encrypted blobs to your private CloudKit zone (SentinelVaultZone). We operate zero vault servers and cannot read your data.',
          'ZERO DEVELOPER SERVERS',
          'Private CloudKit -> SentinelVaultZone (ciphertext only)',
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
  // 7. Accessible Tabs Controller (focusgroup + keyboard fallback + beforematch)
  // =========================================================================
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach((tabsRoot) => {
      const tablist = tabsRoot.querySelector('[role="tablist"]');
      if (!tablist) return;
      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
      const panels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

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

      // Find-in-page auto-reveals hidden="until-found" panel -> sync active tab
      panels.forEach((panel, idx) => {
        panel.addEventListener('beforematch', () => {
          if (tabs[idx]) activate(tabs[idx], false);
        });
      });
    });
  }

  // =========================================================================
  // 8. Native <dialog closedby="any"> Screenshot Lightbox + Safari Fallback
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
  // 9. Mobile Navigation <dialog> Drawer
  // =========================================================================
  function initMobileDrawer() {
    const drawer = document.getElementById('mobile-nav-drawer');
    const openBtn = document.getElementById('mobile-menu-open');
    if (!drawer || !openBtn) return;

    attachDialogBackdropFallback(drawer);

    openBtn.addEventListener('click', () => drawer.showModal());
    drawer.addEventListener('click', (event) => {
      if (event.target.closest('a[href]')) {
        drawer.close();
      }
    });
  }

  // =========================================================================
  // 10. Accordion Expand/Collapse All (Invoker Commands + Fallback)
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

    if (!Object.hasOwn(HTMLButtonElement.prototype, 'commandForElement')) {
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
  // 11. Scroll Reveal Fallback (Only when native CSS view() is unsupported)
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

  window.__pwRefreshWidgets = () => {
    iris?.updateReadout();
    redaction?.updateStatus();
    audit?.render();
    pipeline?.refresh();
  };

  initTabs();
  initLightbox();
  initMobileDrawer();
  initAccordionToggleAll();
  initScrollRevealFallback();
})();
