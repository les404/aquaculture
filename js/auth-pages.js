// Register/Login page handlers.
(function () {
  function $(sel) {
    return document.querySelector(sel);
  }

  function show(msg) {
    const el = $("#authMessage");
    if (el) {
      el.textContent = msg;
      // use visibility so the element always occupies its space
      el.style.visibility = "visible";
    } else {
      alert(msg);
    }
  }

  function hideMessage() {
    const el = $("#authMessage");
    if (el) {
      el.textContent = "";
      el.style.visibility = "hidden";
    }
  }

  function redirectAfterAuth() {
    const back = localStorage.getItem("authRedirect");
    if (back) {
      localStorage.removeItem("authRedirect");
      location.href = back;
    } else {
      location.href = "home.html";
    }
  }

  async function onRegister(e) {
    e.preventDefault();
    try {
      window.AppFirebase.ensureConfigured();
      const auth = window.AppFirebase.getAuth();
      const email = ($("#regEmail")?.value || "").trim();
      const password = $("#regPassword")?.value || "";
      const confirm = $("#regConfirm")?.value || "";
      if (!email || !password) return show("Please enter email and password.");
      if (password !== confirm) return show("Passwords do not match.");
      await auth.createUserWithEmailAndPassword(email, password);
      redirectAfterAuth();
    } catch (err) {
      show(err?.message || String(err));
    }
  }

  async function onLogin(e) {
    e.preventDefault();
    try {
      window.AppFirebase.ensureConfigured();
      const auth = window.AppFirebase.getAuth();
      const email = ($("#loginEmail")?.value || "").trim();
      const password = $("#loginPassword")?.value || "";
      if (!email || !password) return show("Please enter email and password.");
      await auth.signInWithEmailAndPassword(email, password);
      redirectAfterAuth();
    } catch (err) {
      show(err?.message || String(err));
    }
  }

  function boot() {
    const regForm = $("#registerForm");
    if (regForm) {
      regForm.addEventListener("submit", onRegister);
      regForm.addEventListener("input", hideMessage);
    }

    const loginForm = $("#loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", onLogin);
      loginForm.addEventListener("input", hideMessage);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

