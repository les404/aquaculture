// Navbar UI based on auth state.
(function () {
  function safe(fn) {
    try {
      return fn();
    } catch (_) {
      return null;
    }
  }

  function setLoggedOut(navUser) {
    navUser.textContent = "User";
    navUser.href = "login.html";
  }

  function setLoggedIn(navUser, user) {
    navUser.textContent = user.email || "Account";
    navUser.href = "profile.html";

    let logout = document.querySelector(".nav-logout");
    if (!logout) {
      logout = document.createElement("a");
      logout.className = "nav-logout";
      logout.href = "#";
      logout.style.color = "inherit";
      logout.style.textDecoration = "none";
      logout.style.fontSize = "0.88rem";
      logout.textContent = "Logout";
      const right = document.querySelector(".nav-right");
      if (right) right.appendChild(logout);
    }

    logout.onclick = async function (e) {
      e.preventDefault();
      const auth = safe(() => window.AppFirebase.getAuth());
      if (!auth) return;
      await auth.signOut();
      location.href = "home.html";
    };
  }

  function boot() {
    const navUser = document.querySelector(".nav-user");
    if (!navUser) return;

    if (!window.AppFirebase || !window.AppFirebase.isConfigured()) {
      setLoggedOut(navUser);
      return;
    }

    const auth = safe(() => window.AppFirebase.getAuth());
    if (!auth) return;

    auth.onAuthStateChanged(function (user) {
      if (user) setLoggedIn(navUser, user);
      else setLoggedOut(navUser);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

