(function () {
    "use strict";

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

    function initMotion() {
        var d = document;
        var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        d.documentElement.classList.add('js');

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

        // Hero particle field + floating portrait (Phase 2)
        initHeroField(reduced);
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
