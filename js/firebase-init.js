// Firebase init (Auth + Firestore).
// Fill in your Firebase config from Firebase Console → Project settings → SDK setup.
(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDOt8BQi1VQsDNOgavsPXOw3JxP_jGuomM",
    authDomain: "aquaculturedb-eeff3.firebaseapp.com",
    projectId: "aquaculturedb-eeff3",
    appId: "1:935540257211:web:2df9c1c1e12670143d549e",
  };

  function isConfigured(cfg) {
    return (
      cfg &&
      typeof cfg.apiKey === "string" &&
      !cfg.apiKey.includes("PASTE_") &&
      typeof cfg.authDomain === "string" &&
      !cfg.authDomain.includes("PASTE_") &&
      typeof cfg.projectId === "string" &&
      !cfg.projectId.includes("PASTE_") &&
      typeof cfg.appId === "string" &&
      !cfg.appId.includes("PASTE_")
    );
  }

  function ensureConfigured() {
    if (!window.firebase) {
      throw new Error("Firebase SDK not loaded.");
    }
    if (!isConfigured(firebaseConfig)) {
      throw new Error("Firebase config not set in js/firebase-init.js");
    }
  }

  function getApp() {
    ensureConfigured();
    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
      // Ensure auth state is stored persistently (survives page reloads)
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .catch(function (err) {
          console.error("Failed to set auth persistence", err);
        });
    }
    return firebase.app();
  }

  function getAuth() {
    getApp();
    return firebase.auth();
  }

  function getDb() {
    getApp();
    return firebase.firestore();
  }

  window.AppFirebase = {
    isConfigured: function () {
      try {
        return isConfigured(firebaseConfig);
      } catch (_) {
        return false;
      }
    },
    ensureConfigured,
    getAuth,
    getDb,
  };
})();

