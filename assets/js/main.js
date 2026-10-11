(function () {
    "use strict";

    /* ---------- Phase 6: cross-page transition overlay ---------- */
    var vtNextHref = null;
    try {
        vtNextHref = window.sessionStorage.getItem('vt-next');
        window.sessionStorage.removeItem('vt-next');
    } catch (err) {
        vtNextHref = null;
    }

    var vtOverlay = null;
    if (window.gsap && document.body) {
        vtOverlay = document.createElement('div');
        vtOverlay.className = 'vt-overlay';
        vtOverlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(vtOverlay);

        if (vtNextHref) {
            gsap.fromTo(vtOverlay, { yPercent: 0 }, { yPercent: -101, duration: 0.38, ease: 'power2.inOut' });
        } else {
            gsap.set(vtOverlay, { yPercent: 101 });
        }

        // Wipe in, then navigate — capture phase so the native/View-Transitions path never double-fires
        document.addEventListener('click', function (e) {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            var a = e.target && e.target.closest ? e.target.closest('a') : null;
            if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
            var raw = a.getAttribute('href') || '';
            if (!raw || raw.charAt(0) === '#') return;
            if (/^(mailto|tel|javascript):/i.test(raw)) return;
            var href = a.href;
            if (!href || href.indexOf(window.location.origin + '/') !== 0) return;
            if (!/\.html?$/i.test(href.split('#')[0].split('?')[0])) return;
            try {
                window.sessionStorage.setItem('vt-next', href);
            } catch (err2) {
                return;
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            gsap.to(vtOverlay, {
                yPercent: 0,
                duration: 0.38,
                ease: 'power2.inOut',
                onComplete: function () { window.location.href = href; }
            });
        }, true);
    }

    var SOCIAL = {
        github: "https://github.com/sea5000",
        linkedin: "https://www.linkedin.com/in/se-anderson/",
        email: "mail@spencer-anderson.com"
    };

    var NAV_LINKS = [
        { href: "index.html",     label: "Home",     key: "home" },
        { href: "about.html",     label: "About",    key: "about" },
        { href: "projects.html",  label: "Projects", key: "projects" }
    ];

    function rootPrefix() {
        var depth = parseInt(document.documentElement.getAttribute("data-depth") || "", 10);
        if (!isNaN(depth) && depth >= 0) {
            return depth === 0 ? "" : new Array(depth + 1).join("../");
        }
        var segments = (window.location.pathname || "").split("/").filter(Boolean);
        if (segments.length && /\.(html?|php)$/i.test(segments[segments.length - 1])) {
            segments.pop();
        }
        return segments.length ? segments.map(function () { return ".."; }).join("/") + "/" : "";
    }

    var ICON_PATHS = {
        github: '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
        linkedin: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
        email: '<path d="M0 3.5A2.5 2.5 0 0 1 2.5 1h19A2.5 2.5 0 0 1 24 3.5v17a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 0 20.5v-17zm3 0v.486l9 6.428 9-6.428V3.5a.5.5 0 0 0-.5-.5h-19a.5.5 0 0 0-.5.5zM2 6.487V20.5a.5.5 0 0 0 .5.5h19a.5.5 0 0 0 .5-.5V6.487l-8.592 6.137a1 1 0 0 1-1.816 0L2 6.487z"/>'
    };

    function socialIcon(type, href, label) {
        return '<a class="social-icon" href="' + href + '"' +
            (type === "email" ? "" : ' target="_blank" rel="noopener"') +
            ' title="' + label + '" aria-label="' + label + '">' +
            '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
            ICON_PATHS[type] +
            "</svg></a>";
    }

    function socialRow() {
        return socialIcon("github", SOCIAL.github, "GitHub") +
            socialIcon("linkedin", SOCIAL.linkedin, "LinkedIn") +
            socialIcon("email", "mailto:" + SOCIAL.email, "Email");
    }

    function templateString(str, data) {
        return str.replace(/\{\{\s*(\w+)\s*\}\}/g, function (m, key) {
            return data[key] !== undefined ? data[key] : m;
        });
    }

    function buildHeader(current) {
        var R = rootPrefix();
        var links = NAV_LINKS.map(function (link) {
            var active = link.key === current ? ' class="active" aria-current="page"' : "";
            return '<li><a href="' + R + link.href + '"' + active + '>' + link.label + "</a></li>";
        }).join("");

        return templateString(
            '<header data-injected class="site-header">' +
            '  <nav class="nav container" aria-label="Primary">' +
            '    <a class="brand" href="' + R + 'index.html">spencer<span class="dot">-</span>anderson</a>' +
            '    <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">' +
            '      <span></span><span></span><span></span>' +
            '    </button>' +
            '    <ul class="nav-links" id="navLinks">' +
            '      {{links}}' +
            '    </ul>' +
            '    <div class="nav-social">' +
            '      ' + socialIcon("github", SOCIAL.github, "GitHub") +
            '      ' + socialIcon("linkedin", SOCIAL.linkedin, "LinkedIn") +
            '    </div>' +
            '  </nav>' +
            "</header>",
            { links: links }
        );
    }

    function buildFooter() {
        var R = rootPrefix();
        return templateString(
            '<footer data-injected class="site-footer">' +
            '  <div class="container">' +
            '    <div class="footer-grid">' +
            '      <div>' +
            '        <span class="footer-brand">spencer<span class="dot">-</span>anderson</span>' +
            '        <p class="muted" style="margin-top:.5rem;font-size:var(--type-caption)">' +
            '          Intelligence analyst turned data scientist.<br>' +
            '          Turning complex data into decisions.' +
            '        </p>' +
            '      </div>' +
            '      <div>' +
            '        <ul class="footer-links">' +
            '          <li><a href="' + R + 'index.html">Home</a></li>' +
            '          <li><a href="' + R + 'about.html">About</a></li>' +
            '          <li><a href="' + R + 'projects.html">Projects</a></li>' +
            '        </ul>' +
            '        <div class="footer-social">' +
            '          ' + socialRow() +
            '        </div>' +
            '      </div>' +
            '    </div>' +
            '    <div class="footer-bottom" style="text-align:center">' +
            '      &copy; ' + new Date().getFullYear() + " Spencer E. Anderson. Built as a portfolio site." +
            '    </div>' +
            '  </div>' +
            "</footer>",
            {}
        );
    }

    function injectSocial() {
        var slots = document.querySelectorAll("[data-social]");
        for (var i = 0; i < slots.length; i++) {
            slots[i].innerHTML = socialRow();
        }
    }

    function addNavListeners() {
        var toggle = document.querySelector(".nav-toggle");
        var links = document.getElementById("navLinks");
        if (!toggle || !links) return;

        toggle.addEventListener("click", function () {
            var open = links.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });

        links.addEventListener("click", function (e) {
            if (e.target.tagName === "A") {
                links.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ---------- Phase 2: Hero particle field ---------- */
    function initHeroField(reduced) {
        if (reduced) return;
        var hero = document.querySelector('.hero');
        if (!hero) return;

        var canvas = document.createElement('canvas');
        canvas.className = 'hero-field';
        canvas.setAttribute('aria-hidden', 'true');
        hero.insertBefore(canvas, hero.firstChild);

        var ctx = canvas.getContext('2d');
        if (!ctx) { canvas.remove(); return; }

        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w = 0, h = 0, nodes = [], mouse = { x: -1, y: -1 };
        var LINK = 130;       // px threshold for drawing a connector
        var LINK_S = 90;      // px radius for mouse-linked connectors

        function size() {
            var r = hero.getBoundingClientRect();
            w = Math.max(1, r.width);
            h = Math.max(1, r.height);
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            // node count scales with area, capped
            var target = Math.min(64, Math.max(26, Math.round(w * h / 14000)));
            if (nodes.length !== target) {
                if (nodes.length > target) nodes.length = target;
                while (nodes.length < target) nodes.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - .5) * .35,
                    vy: (Math.random() - .5) * .35,
                    r: 1 + Math.random() * 1.6
                });
            }
        }
        size();

        hero.addEventListener('mousemove', function (e) {
            var r = hero.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        });
        hero.addEventListener('mouseleave', function () { mouse.x = -1; mouse.y = -1; });

        var visible = true;
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                var nowVisible = entries[0] ? entries[0].isIntersecting : true;
                if (nowVisible === visible) return;
                visible = nowVisible;
                if (visible) kick();
                else if (raf) { cancelAnimationFrame(raf); raf = 0; }
            }).observe(hero);
        }

        var raf = 0;

        function step() {
            ctx.clearRect(0, 0, w, h);
            var i, n, o;
            for (i = 0; i < nodes.length; i++) {
                n = nodes[i];
                n.x += n.vx; n.y += n.vy;
                if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
                if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
            }
            // faint connectors between nearby nodes
            ctx.lineWidth = 1;
            for (i = 0; i < nodes.length; i++) {
                n = nodes[i];
                for (var j = i + 1; j < nodes.length; j++) {
                    o = nodes[j];
                    var dx = n.x - o.x, dy = n.y - o.y;
                    var d2 = dx * dx + dy * dy;
                    if (d2 < LINK * LINK) {
                        var a = 1 - Math.sqrt(d2) / LINK;
                        ctx.strokeStyle = 'rgba(122,164,188,' + (a * .22).toFixed(3) + ')';
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(o.x, o.y);
                        ctx.stroke();
                    }
                }
            }
            // node-to-cursor threads
            if (mouse.x > 0) {
                for (i = 0; i < nodes.length; i++) {
                    n = nodes[i];
                    var mdx = n.x - mouse.x, mdy = n.y - mouse.y;
                    var md2 = mdx * mdx + mdy * mdy;
                    if (md2 < LINK_S * LINK_S * 4) {
                        var ma = 1 - Math.sqrt(md2) / (LINK_S * 2);
                        if (ma > 0) {
                            ctx.strokeStyle = 'rgba(94,177,197,' + (ma * .45).toFixed(3) + ')';
                            ctx.beginPath();
                            ctx.moveTo(n.x, n.y);
                            ctx.lineTo(mouse.x, mouse.y);
                            ctx.stroke();
                        }
                    }
                }
            }
            // nodes
            for (i = 0; i < nodes.length; i++) {
                n = nodes[i];
                ctx.fillStyle = 'rgba(132,177,206,.55)';
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, 6.2832);
                ctx.fill();
            }
        }

        function kick() {
            if (!visible || raf) return;
            raf = requestAnimationFrame(function loop() {
                step();
                raf = requestAnimationFrame(loop);
            });
        }
        // stop the loop cleanly when hidden
        var ro = typeof ResizeObserver === 'function' ? new ResizeObserver(size) : null;
        if (ro) ro.observe(hero);
        window.addEventListener('resize', size, { passive: true });
        kick();
    }

    /* ---------- Phase 6: magnetic cursor follower ---------- */
    function initCursorFollower(reduced) {
        if (reduced || !window.gsap) return;
        if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;

        var dot = document.createElement('div');
        dot.className = 'cursor-dot';
        dot.setAttribute('aria-hidden', 'true');
        document.body.appendChild(dot);

        gsap.set(dot, { xPercent: -50, yPercent: -50 });
        var xTo = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
        var yTo = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });

        var px = -100, py = -100, magnet = null;

        var move = function () {
            var tx = px, ty = py;
            if (magnet) {
                var r = magnet.getBoundingClientRect();
                tx = px + ((r.left + r.width / 2) - px) * 0.22;
                ty = py + ((r.top + r.height / 2) - py) * 0.22;
            }
            xTo(tx);
            yTo(ty);
        };
        var show = function () { dot.classList.add('is-on'); };
        var hide = function () { dot.classList.remove('is-on'); };

        window.addEventListener('pointermove', function (e) {
            px = e.clientX;
            py = e.clientY;
            show();
            move();
        }, { passive: true });

        window.addEventListener('pointerleave', hide);
        // pointerleave does not bubble off window in every engine — also catch the real window exit
        window.addEventListener('pointerout', function (e) {
            if (!e.relatedTarget) hide();
        });

        var magnets = document.querySelectorAll('a, button, [data-tilt]');
        Array.prototype.forEach.call(magnets, function (el) {
            el.addEventListener('pointerenter', function () {
                magnet = el;
                dot.classList.add('is-magnet');
                move();
            });
            el.addEventListener('pointerleave', function () {
                if (magnet === el) magnet = null;
                dot.classList.remove('is-magnet');
                move();
            });
        });
    }

    /* ---------- Phase 7: Lottie micro-animation on the primary CTA ---------- */
    function initLottie(reduced) {
        if (reduced || !window.lottie) return;

        var primaries = document.querySelectorAll('a.btn-primary');
        var hire = null;
        for (var i = 0; i < primaries.length; i++) {
            if (/hire me/i.test(primaries[i].textContent)) { hire = primaries[i]; break; }
        }
        if (!hire) return;

        var slot = document.createElement('span');
        slot.className = 'lottie-mini';
        slot.setAttribute('aria-hidden', 'true');
        hire.insertBefore(slot, hire.firstChild);

        var pulse = {
            v: '5.12.2', fr: 60, ip: 0, op: 30, w: 100, h: 100,
            nm: 'pulse', ddd: 0, assets: [],
            layers: [{
                ddd: 0, ind: 1, ty: 4, nm: 'dot', sr: 1,
                ks: {
                    o: { a: 0, k: 100 },
                    r: { a: 0, k: 0 },
                    p: { a: 0, k: [50, 50, 0] },
                    a: { a: 0, k: [0, 0, 0] },
                    s: {
                        a: 1,
                        k: [
                            { t: 0, s: [55, 55, 100], i: { x: [0.42], y: [1] }, o: { x: [0.58], y: [0] } },
                            { t: 30, s: [100, 100, 100] }
                        ]
                    }
                },
                ao: 0,
                shapes: [{
                    ty: 'gr', nm: 'g',
                    it: [
                        { ty: 'el', d: 1, s: { a: 0, k: [64, 64] }, p: { a: 0, k: [0, 0] }, nm: 'e' },
                        { ty: 'st', c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 14 }, lc: 2, lj: 1, nm: 's' },
                        { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: 'tr' }
                    ]
                }],
                ip: 0, op: 30, st: 0, bm: 0
            }]
        };

        var anim;
        try {
            anim = window.lottie.loadAnimation({
                container: slot,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationSpeed: 0.4,
                animationData: pulse
            });
        } catch (err) {
            slot.remove();
            return;
        }
        if (!anim) return;
        try {
            anim.setSpeed(0.4);
        } catch (err) {}

        // Proximity-reactive speed on a single rAF: 1.2 (base) far away, easing up to a 2.5 cap at
        // the button center inside a 240px radius. Outside the radius it eases back to 1.2 (~0.6s).
        var BASE_SPEED = 0.4;
        var MAX_SPEED = 0.9;
        var PROX_RADIUS = 240;
        var targetSpeed = BASE_SPEED;
        var currentSpeed = BASE_SPEED;
        var speedRaf = 0;
        var lerpSpeed = function () {
            speedRaf = 0;
            var diff = targetSpeed - currentSpeed;
            if (Math.abs(diff) < 0.005) {
                currentSpeed = targetSpeed;
            } else {
                currentSpeed += diff * (diff > 0 ? 0.12 : 0.08);
            }
            try {
                anim.setSpeed(currentSpeed);
            } catch (err) {}
            if (Math.abs(targetSpeed - currentSpeed) > 0.005) {
                speedRaf = requestAnimationFrame(lerpSpeed);
            }
        };
        window.addEventListener('pointermove', function (e) {
            var r = hire.getBoundingClientRect();
            var cx = r.left + r.width / 2;
            var cy = r.top + r.height / 2;
            var dx = e.clientX - cx;
            var dy = e.clientY - cy;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= PROX_RADIUS) {
                targetSpeed = Math.min(2.5, BASE_SPEED + (1 - dist / PROX_RADIUS) * (MAX_SPEED - BASE_SPEED));
            } else {
                targetSpeed = BASE_SPEED;
            }
            if (!speedRaf && !document.hidden) {
                speedRaf = requestAnimationFrame(lerpSpeed);
            }
        }, { passive: true });
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                if (speedRaf) {
                    cancelAnimationFrame(speedRaf);
                    speedRaf = 0;
                }
            } else if (Math.abs(targetSpeed - currentSpeed) > 0.005 && !speedRaf) {
                speedRaf = requestAnimationFrame(lerpSpeed);
            }
        });
    }


    /* ---------- Phase 8: animated shader background behind hero (Three.js) ---------- */
    function initHeroShader(reduced) {
        if (!document.querySelector('.hero')) return;
        var canvas = document.getElementById('hero-shader');
        if (!canvas) return;
        if (typeof window.THREE === 'undefined') return;
        if (reduced) {
            try {
                canvas.remove();
            } catch (err) {}
            return;
        }
        var hero = document.querySelector('.hero');
        if (!hero) return;
        var renderer, scene, camera, material, mesh;
        var uniforms, rafId = 0, running = false, visible = true;
        var resizeTimer = null;
        var ro, wh = { w: 0, h: 0 };
        function computeColor() {
            try {
                var cs = window.getComputedStyle(document.documentElement);
                var c = cs.getPropertyValue('--color-primary').trim();
                if (c) return c;
            } catch (err) {}
            return '#3b82f6';
        }
        function getAccent() {
            var c = computeColor();
            if (/^#[0-9a-fA-F]{6}$/.test(c)) return c;
            return c;
        }
        try {
            var accent = getAccent();
            renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.setClearColor(0x0A1622, 1);
            scene = new THREE.Scene();
            var w = window.innerWidth, h = window.innerHeight;
            camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            var geo = new THREE.PlaneGeometry(2, 2);
            uniforms = {
                time: { value: 0 },
                resolution: { value: new THREE.Vector2(w, h) },
                aspect: { value: w / h },
                accent: { value: new THREE.Color(accent) }
            };
            material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: 'varying vec2 vUv;\nvoid main(){\nvUv = uv;\ngl_Position = vec4(position, 1.0);\n}',
                fragmentShader: 'uniform float time;\nuniform vec2 resolution;\nuniform float aspect;\nuniform vec3 accent;\nvarying vec2 vUv;\nvoid main(){\nfloat t = time * 0.12;\nvec2 p = vUv - 0.5;\np.x *= aspect;\nfloat f = sin(p.x*1.2 + t) * 0.18 + sin(p.y*1.6 - t*0.8) * 0.14 + sin((p.x+p.y)*0.9 + t*0.5)*0.16;\nvec3 base = vec3(0.06, 0.08, 0.12);\nvec3 col = mix(base, accent, 0.25 + f*0.6);\ncol = mix(col, base*0.8, 0.35);\ngl_FragColor = vec4(col, 0.55);\n}'
            });
            mesh = new THREE.Mesh(geo, material);
            scene.add(mesh);
            function resize() {
                var rect = hero.getBoundingClientRect();
                var rw = Math.max(1, rect.width);
                var rh = Math.max(1, rect.height);
                wh.w = rw; wh.h = rh;
                renderer.setSize(rw, rh, false);
                uniforms.resolution.value.set(rw, rh);
                uniforms.aspect.value = rw / Math.max(1, rh);
            }
            resize();
            window.addEventListener('resize', function () {
                if (resizeTimer) clearTimeout(resizeTimer);
                resizeTimer = setTimeout(resize, 150);
            }, { passive: true });
            ro = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
            if (ro) ro.observe(hero);
            function step(ts) {
                if (!running) return;
                uniforms.time.value = ts * 0.001;
                renderer.render(scene, camera);
                rafId = requestAnimationFrame(step);
            }
            function start() {
                if (running) return;
                running = true;
                rafId = requestAnimationFrame(step);
            }
            function stop() {
                if (!running) return;
                running = false;
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = 0;
                }
            }
            if ('IntersectionObserver' in window) {
                new IntersectionObserver(function (entries) {
                    var now = entries[0] ? entries[0].isIntersecting : true;
                    if (now === visible) return;
                    visible = now;
                    if (visible) start();
                    else stop();
                }).observe(hero);
            }
            start();
        } catch (err) {
            try {
                var c = document.getElementById('hero-shader');
                if (c) c.remove();
            } catch (e) {}
        }
    }

        function initMotion() {
        var d = document;
        var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        d.documentElement.classList.add('js');

        // Phase 5: GSAP present → take over reveal; CSS reveal rules opt out via .gsap-ok
        if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
            document.documentElement.classList.add('gsap-ok');
        }

        var $$ = function (sel) { return Array.prototype.slice.call(d.querySelectorAll(sel)); };

        // Hero entrance (staged)
        var heroEls = $$('main [data-hero-stage]');
        var i;
        if (reduced) {
            heroEls.forEach(function (el) { el.classList.add('hero-in'); });
        } else {
            heroEls.forEach(function (el) {
                var delay = el.dataset.delay !== undefined ? parseInt(el.dataset.delay, 10) : 0;
                setTimeout(function () { el.classList.add('hero-in'); }, delay);
            });
        }

        // Count-up helper
        var fmt = function (n) {
            var parts = String(n).split('.');
            if (parts[0].length > 3) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
        };

        var countUps = $$('[data-count]').map(function (el) {
            // Match the original number's decimal places (e.g. data-count="6" -> 0 dp)
            var raw = String(el.getAttribute('data-count'));
            var dots = raw.split('.');
            var decimals = dots.length > 1 ? Math.min(dots[1].replace(/[^0-9]/g, '').length, 6) : 0;
            return {
                el: el,
                target: parseFloat(raw),
                suffix: el.getAttribute('data-suffix') || '',
                go: function () {
                    if (el.dataset.done) return;
                    el.dataset.done = '1';
                    var self = this;
                    if (reduced) {
                        self.el.textContent = fmt(self.target) + self.suffix;
                        return;
                    }
                    var t0 = performance.now();
                    var dur = 1500;
                    var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
                    var step = function (now) {
                        var t = Math.min(1, (now - t0) / dur);
                        var val = self.target * ease(t);
                        // keep to the target's own decimal places (0 here), strip trailing dots
                        self.el.textContent = fmt(decimals === 0 ? Math.round(val) : +val.toFixed(decimals)) + self.suffix;
                        if (t < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                }
            };
        });

        // Scroll reveal
        var revealEls = $$('[data-reveal]');
        var show = function (el) { el.classList.add('is-revealed'); };
        var startCountersFor = function (el) {
            countUps.forEach(function (cu) {
                if (cu.el === el || el.contains(cu.el)) {
                    try { cu.go(); } catch (err) { /* leave the counter as-is */ }
                }
            });
        };

        if (reduced || (window.gsap && !window.ScrollTrigger)) {
            // Reduced motion (skip GSAP reveal) or partial CDN: immediate render,
            // count-ups land on their final formatted value
            revealEls.forEach(show);
            countUps.forEach(function (cu) { cu.go(); });
        } else if (!window.gsap) {
            // Phase 5 guard: no GSAP (CDN outage) → original IntersectionObserver reveal
            if (revealEls.length && 'IntersectionObserver' in window && !reduced) {
                var io = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (!entry.isIntersecting) return;
                        var el = entry.target;
                        show(el);
                        el.querySelectorAll('[data-reveal]').forEach(show);
                        countUps.forEach(function (cu) {
                            if (cu.el === el || el.contains(cu.el)) cu.go();
                        });
                        io.unobserve(el);
                    });
                }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
                revealEls.forEach(function (el) { io.observe(el); });
            } else {
                revealEls.forEach(show);
                countUps.forEach(function (cu) { cu.go(); });
            }
        } else {
            // Phase 5: GSAP + ScrollTrigger reveal
            var viewH = window.innerHeight || d.documentElement.clientHeight;
            revealEls.forEach(function (el) {
                gsap.from(el, {
                    opacity: 0,
                    y: 28,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        once: true,
                        onEnter: function () { startCountersFor(el); }
                    }
                });
                // Already in view on load → start related counters right away
                var r = el.getBoundingClientRect();
                if (r.top < viewH * 0.88 && r.bottom > 0) startCountersFor(el);
            });
        }

        // Safety net: if neither IO nor GSAP/ScrollTrigger fires, never leave content invisible.
        // One-shot fallback — any [data-reveal] still hidden is force-shown. This does not touch the
        // normal IO/GSAP reveal path (under .gsap-ok the class has no CSS effect; GSAP inline styles
        // still drive the scroll reveal), so below-the-fold GSAP reveals are unaffected.
        setTimeout(function () {
            var stuck = d.querySelectorAll('[data-reveal]:not(.is-revealed)');
            for (var si = 0; si < stuck.length; si++) {
                stuck[si].classList.add('is-revealed');
            }
        }, 1500);

        // Phase 7: SVG line-draw accent under the "What I bring" heading
        // GSAP+ScrollTrigger → scrubbed, bidirectional draw (replays forwards AND backwards on scroll).
        // Fallback (no GSAP/ScrollTrigger, or reduced motion) → one-shot CSS class, fired only on the
        // element's first intersection. The ld-draw class-based one-shot is never fired while GSAP runs.
        var lineDraw = d.querySelector('.line-draw');
        if (lineDraw) {
            var ldPath = lineDraw.querySelector('.ld-path');
            var ldTrigger = lineDraw.previousElementSibling || lineDraw;
            if (ldPath && window.gsap && window.ScrollTrigger) {
                ldPath.style.transition = 'none';
                gsap.to(ldPath, {
                    strokeDashoffset: 0,
                    scrollTrigger: {
                        trigger: ldTrigger,
                        start: 'top 80%',
                        end: 'bottom 55%',
                        scrub: 0.6
                    }
                });
            } else {
                var ldDrawn = false;
                var drawLine = function () {
                    if (ldDrawn) return;
                    ldDrawn = true;
                    lineDraw.classList.add('ld-draw');
                };
                if ('IntersectionObserver' in window) {
                    var ldIO = new IntersectionObserver(function (entries) {
                        entries.forEach(function (entry) {
                            if (!entry.isIntersecting) return;
                            drawLine();
                            ldIO.unobserve(entry.target);
                        });
                    }, { rootMargin: '0px 0px -8% 0px' });
                    ldIO.observe(lineDraw);
                } else {
                    drawLine();
                }
            }
        }

        /* ---------- Phase 5: Lenis smooth scroll ---------- */
        var lenis = null;
        var coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        if (window.Lenis && !reduced && !coarsePointer) {
            lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
            // Lenis drives the scroll itself, so native window scroll events never fire.
            // Bridge every Lenis scroll frame to ScrollTrigger so its triggers actually evaluate.
            if (window.gsap && window.ScrollTrigger) {
                lenis.on('scroll', ScrollTrigger.update);
                ScrollTrigger.scrollerProxy(document.body, {
                    getBoundingClientRect: function () { return { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight, height: window.innerHeight, width: window.innerWidth }; },
                    scrollTop: function () { return lenis ? lenis.scroll : 0; },
                    setScrollTop: function (v) { if (lenis) { lenis.scrollTo(v); } }
                });
            }
            var lenisRaf = 0;
            var lenisLoop = function (t) {
                lenis.raf(t);
                lenisRaf = requestAnimationFrame(lenisLoop);
            };
            lenisRaf = requestAnimationFrame(lenisLoop);
            if (window.gsap && window.ScrollTrigger) {
                ScrollTrigger.update();
                window.addEventListener('resize', function () {
                    ScrollTrigger.update();
                });
            }
            window.addEventListener('pagehide', function () {
                if (lenisRaf) {
                    cancelAnimationFrame(lenisRaf);
                    lenisRaf = 0;
                }
            });
        }

        // Header nav links: smooth-scroll to the link's own hash target when it has one
        $$('.site-header a').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var href = a.getAttribute('href') || '';
                if (href.charAt(0) !== '#') return;
                var target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(target, { offset: -16 });
                } else {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Hero particle field + floating portrait (Phase 2)
        initHeroField(reduced);
        initHeroShader(reduced);
        var portrait = d.querySelector('.hero .portrait');
        if (portrait && !reduced) {
            portrait.classList.add('float-able');
            // The hero entrance animation (hero-rise) holds the cascade with a `both` fill,
            // which would block the float. When it finishes, drop hero-in so float takes over.
            var onHeroEnd = function (e) {
                if (e.animationName === 'hero-rise') {
                    portrait.classList.remove('hero-in');
                    portrait.classList.add('hero-done');
                    portrait.removeEventListener('animationend', onHeroEnd);
                }
            };
            portrait.addEventListener('animationend', onHeroEnd);
        }

        // Scramble-decode headline (Phase 2) — text returns to its original string
        var GLYPHS = '!<>-_\/[]{}=+*^?#%0123456789';
        function scramble(el) {
            if (el.dataset.scrambled) return;
            el.dataset.scrambled = '1';
            if (reduced) return;
            var parts = [];
            for (var i = 0; i < el.childNodes.length; i++) {
                var n = el.childNodes[i];
                if (n.nodeType === 3) parts.push({ node: n, text: n.nodeValue });
            }
            for (var k = 0; k < el.querySelectorAll('span').length; k++) {
                var sp = el.querySelectorAll('span')[k];
                parts.push({ node: sp, text: sp.textContent });
            }
            var dur = 1100, t0 = performance.now();
            var frame = function (now) {
                var t = Math.min(1, (now - t0) / dur);
                for (var p = 0; p < parts.length; p++) {
                    var orig = parts[p].text, out = '';
                    var frac = Math.max(0, Math.min(1, t * parts.length - p));
                    var nShown = Math.round(frac * orig.length);
                    out = '';
                    for (var c2 = 0; c2 < orig.length; c2++) {
                        if (orig[c2] === ' ' || c2 < nShown) out += orig[c2];
                        else out += GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
                    }
                    if (parts[p].node.nodeType === 3) parts[p].node.nodeValue = out;
                    else parts[p].node.textContent = out;
                }
                if (t < 1) requestAnimationFrame(frame);
                else {
                    for (var f = 0; f < parts.length; f++) {
                        if (parts[f].node.nodeType === 3) parts[f].node.nodeValue = parts[f].text;
                        else parts[f].node.textContent = parts[f].text;
                    }
                }
            };
            requestAnimationFrame(frame);
        }
        var h1 = d.querySelector('.hero h1');
        if (h1) scramble(h1);

        // Tilt cards with cursor sheen (Phase 3; hover-capable pointers only)
        var canHover = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (!reduced && canHover) {
            d.querySelectorAll('.card, .exp-card').forEach(function (card) {
                var raf = 0;
                var mx = 50, my = 50;
                card.setAttribute('data-tilt', '');
                card.addEventListener('pointermove', function (e) {
                    var r = card.getBoundingClientRect();
                    mx = ((e.clientX - r.left) / r.width) * 100;
                    my = ((e.clientY - r.top) / r.height) * 100;
                    var px = (e.clientX - r.left) / r.width - .5;
                    var py = (e.clientY - r.top) / r.height - .5;
                    if (!raf) raf = requestAnimationFrame(function () {
                        card.style.setProperty('--mx', mx + '%');
                        card.style.setProperty('--my', my + '%');
                        card.style.setProperty('--tx', (py * -6).toFixed(2) + 'deg');
                        card.style.setProperty('--ty', (px * 6).toFixed(2) + 'deg');
                        raf = 0;
                    });
                });
                card.addEventListener('pointerout', function () {
                    card.style.setProperty('--tx', '0deg');
                    card.style.setProperty('--ty', '0deg');
                });
            });
        }

        // Magnetic cursor follower (Phase 6; fine pointers only, after tilt marks data-tilt)
        initCursorFollower(reduced);

        // Lottie micro-animation on the primary CTA (Phase 7; skipped without CDN or with reduced motion)
        initLottie(reduced);

        // Scroll progress bar
        var bar = d.createElement('div');
        bar.className = 'scroll-progress';
        bar.setAttribute('aria-hidden', 'true');
        d.body.appendChild(bar);

        // Back to top button
        var btn = d.createElement('button');
        btn.type = 'button';
        btn.className = 'back-to-top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
        });
        d.body.appendChild(btn);

        var onScroll = function () {
            var doc = d.documentElement;
            var max = doc.scrollHeight - window.innerHeight;
            var p = max > 0 ? doc.scrollTop / max : 0;
            bar.style.transform = 'scaleX(' + p + ')';
            btn.classList.toggle('show', doc.scrollTop > 560);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // Page transitions (View Transitions API; native fallback when unsupported)
        var navigate = function (e) {
            if ('startViewTransition' in window && !reduced) {
                e.preventDefault();
                var url = e.target.href;
                try {
                    window.startViewTransition(function () {
                        history.pushState(null, '', url);
                    }).finished.then(function () { location.reload(); }, function () { location.replace(url); });
                } catch (err) {
                    location.assign(url);
                }
            }
            // else: default navigation proceeds natively
        };

        var internalA = $$('a').filter(function (a) {
            var href = a.getAttribute('href');
            if (!href || a.target === '_blank' || a.download) return false;
            if (href.charAt(0) === '#' || /^\s*(javascript|mailto|tel):/i.test(href)) return false;
            return /\.html?$/i.test(href.split('#')[0].split('?')[0]);
        });
        internalA.forEach(function (a) {
            a.addEventListener('click', navigate);
        });
    }

    function init() {
        var headerSlot = document.querySelector("[data-header]");
        var footerSlot = document.querySelector("[data-footer]");
        if (headerSlot) {
            headerSlot.innerHTML = buildHeader(headerSlot.getAttribute("data-current") || "");
        }
        if (footerSlot) {
            footerSlot.innerHTML = buildFooter();
        }
        injectSocial();
        addNavListeners();
        initMotion();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
