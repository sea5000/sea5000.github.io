(function () {
    "use strict";

    var SOCIAL = {
        github: "https://github.com/sea5000",
        linkedin: "https://www.linkedin.com/in/se-anderson/",
        email: "mail@spencer-anderson.com"
    };

    var NAV_LINKS = [
        { href: "index.html",  label: "Home",     key: "home" },
        { href: "about.html",  label: "About",    key: "about" },
        { href: "projects.html", label: "Projects", key: "projects" }
    ];

    function templateString(str, data) {
        return str.replace(/\{\{\s*(\w+)\s*\}\}/g, function (m, key) {
            return data[key] !== undefined ? data[key] : m;
        });
    }

    function buildHeader(current) {
        var links = NAV_LINKS.map(function (link) {
            var active = link.key === current ? ' class="active" aria-current="page"' : "";
            return '<li><a href="' + link.href + '"' + active + '>' + link.label + "</a></li>";
        }).join("");

        return templateString(
            '<header data-injected class="site-header">' +
            '  <nav class="nav container" aria-label="Primary">' +
            '    <a class="brand" href="index.html">spencer<span class="dot">-</span>anderson</a>' +
            '    <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">' +
            '      <span></span><span></span><span></span>' +
            '    </button>' +
            '    <ul class="nav-links" id="navLinks">' +
            '      {{links}}' +
            '    </ul>' +
            '    <div class="nav-social">' +
            '      <a href="{{github}}" target="_blank" rel="noopener" title="GitHub">GitHub</a>' +
            '      <a href="{{linkedin}}" target="_blank" rel="noopener" title="LinkedIn">LinkedIn</a>' +
            '    </div>' +
            '  </nav>' +
            "</header>",
            { links: links, github: SOCIAL.github, linkedin: SOCIAL.linkedin }
        );
    }

    function buildFooter() {
        return templateString(
            '<footer data-injected class="site-footer">' +
            '  <div class="container">' +
            '    <div class="footer-grid">' +
            '      <div>' +
            '        <span class="footer-brand">spencer<span class="dot">-</span>anderson</span>' +
            '        <p class="muted" style="margin-top:.5rem;font-size:var(--type-caption)">' +
            '          Intelligence analyst & data science student.<br>' +
            '          Building toward a portfolio of analytic and programming work.' +
            '        </p>' +
            '      </div>' +
            '      <div>' +
            '        <ul class="footer-links">' +
            '          <li><a href="index.html">Home</a></li>' +
            '          <li><a href="about.html">About</a></li>' +
            '          <li><a href="projects.html">Projects</a></li>' +
            '        </ul>' +
            '        <div class="footer-social">' +
            '          <a href="{{github}}" target="_blank" rel="noopener">GitHub</a>' +
            '          <a href="{{linkedin}}" target="_blank" rel="noopener">LinkedIn</a>' +
            '          <a href="mailto:{{email}}">Email</a>' +
            '        </div>' +
            '      </div>' +
            '    </div>' +
            '    <div class="footer-bottom" style="text-align:center">' +
            '      &copy; ' + new Date().getFullYear() + " Spencer E. Anderson. Built as a portfolio site." +
            '    </div>' +
            '  </div>' +
            "</footer>",
            SOCIAL
        );
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

    function init() {
        var headerSlot = document.querySelector("[data-header]");
        var footerSlot = document.querySelector("[data-footer]");
        if (headerSlot) {
            headerSlot.innerHTML = buildHeader(headerSlot.getAttribute("data-current") || "");
        }
        if (footerSlot) {
            footerSlot.innerHTML = buildFooter();
        }
        addNavListeners();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
