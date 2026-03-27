(function () {
  function getCurrentPage() {
    try {
      var path = window.location.pathname.replace(/\\/g, "/");
      return path.split("/").pop() || "";
    } catch (_) {
      return "";
    }
  }

  function markActive() {
    var page = getCurrentPage();
    if (!page) return;

    document.querySelectorAll(".admin-nav-item").forEach(function (el) {
      el.classList.remove("is-active");
    });

    var active = document.querySelector(
      '.admin-nav-item[href="' + page + '"]'
    );
    if (active) active.classList.add("is-active");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markActive);
  } else {
    markActive();
  }
})();

