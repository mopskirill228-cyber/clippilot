/* Language switch EN/RU. Without JavaScript the page stays in English.
   Choice order: ?lang=ru|en in the URL, then saved choice, then the browser language. */
(function () {
  var KEY = "clippilot-lang";
  var root = document.documentElement;

  function detect() {
    var m = /[?&]lang=(ru|en)\b/.exec(location.search);
    if (m) return m[1];
    try {
      var saved = localStorage.getItem(KEY);
      if (saved === "ru" || saved === "en") return saved;
    } catch (e) {}
    return /^ru\b/i.test(navigator.language || "") ? "ru" : "en";
  }

  function apply(lang) {
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
  }

  function decorate(lang) {
    var title = document.querySelector("title[data-" + lang + "]");
    if (title) document.title = title.getAttribute("data-" + lang);
    var desc = document.querySelector('meta[name="description"]');
    if (desc && desc.hasAttribute("data-" + lang)) desc.setAttribute("content", desc.getAttribute("data-" + lang));
    var buttons = document.querySelectorAll("[data-set-lang]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-pressed", buttons[i].getAttribute("data-set-lang") === lang ? "true" : "false");
    }
  }

  var current = detect();
  apply(current);

  document.addEventListener("DOMContentLoaded", function () {
    decorate(current);
    var buttons = document.querySelectorAll("[data-set-lang]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        current = this.getAttribute("data-set-lang");
        try { localStorage.setItem(KEY, current); } catch (e) {}
        apply(current);
        decorate(current);
      });
    }
  });
})();
