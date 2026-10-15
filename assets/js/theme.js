/* theme.js — tiny, dependency-free theme persistence + switching.
   Must be loaded in <head> before the stylesheet so the theme applies before
   first paint on every load. */
(function () {
    var KEY = 'sea5000-theme';
    var doc = document.documentElement;

    function current() {
        try {
            var saved = localStorage.getItem(KEY);
            if (saved === 'dark' || saved === 'light') return saved;
        } catch (e) {}
        return 'dark';
    }

    function apply(name) {
        doc.setAttribute('data-theme', name);
    }

    function set(name) {
        if (name !== 'light' && name !== 'dark') return;
        apply(name);
        try { localStorage.setItem(KEY, name); } catch (e) {}
        var evt = null;
        try { evt = new CustomEvent('themechange', { detail: { theme: name } }); } catch (e) {}
        if (evt) doc.dispatchEvent(evt);
    }

    /* apply before first paint */
    apply(current());

    var api = { set: set };
    try {
        Object.defineProperty(api, 'current', {
            value: current,
            writable: false,
            enumerable: true,
            configurable: false
        });
    } catch (e) {
        api.current = current;
    }
    window.SeaTheme = api;
})();
