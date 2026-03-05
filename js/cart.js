// Firestore cart helpers.
(function () {
  function moneyToNumber(pesoText) {
    const s = String(pesoText || "").replace(/[^\d.]/g, "");
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }

  function waitForUserOnce(auth) {
    return new Promise(function (resolve) {
      const unsub = auth.onAuthStateChanged(function (user) {
        unsub();
        resolve(user || null);
      });
    });
  }

  async function requireLogin() {
    window.AppFirebase.ensureConfigured();
    const auth = window.AppFirebase.getAuth();
    const user = await waitForUserOnce(auth);
    if (user) return user;
    localStorage.setItem("authRedirect", location.href);
    location.href = "login.html";
    throw new Error("Not logged in");
  }

  function cartCollection(uid) {
    const db = window.AppFirebase.getDb();
    return db.collection("carts").doc(uid).collection("items");
  }

  async function addSelectedProduct(qty) {
    const user = await requireLogin();
    const raw = localStorage.getItem("selectedProduct");
    const product = raw ? JSON.parse(raw) : null;
    if (!product || !product.name) throw new Error("No selected product.");

    const id = product.folder
      ? String(product.folder).replace(/[^\w]+/g, "_").toLowerCase()
      : String(product.image || product.name).replace(/[^\w]+/g, "_").toLowerCase();

    const price = moneyToNumber(product.price);
    const image = product.image || "";
    const folder = product.folder || "";
    const name = product.name;
    const category = product.category || "";

    const ref = cartCollection(user.uid).doc(id);
    const snap = await ref.get();
    const currentQty = snap.exists ? Number(snap.data().qty || 0) : 0;

    await ref.set(
      {
        name,
        category,
        price,
        image,
        folder,
        qty: currentQty + Math.max(1, Number(qty || 1)),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }

  async function getItems() {
    const user = await requireLogin();
    const snap = await cartCollection(user.uid).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async function setQty(id, qty) {
    const user = await requireLogin();
    const ref = cartCollection(user.uid).doc(id);
    if (qty <= 0) return ref.delete();
    return ref.set({ qty }, { merge: true });
  }

  async function removeItem(id) {
    const user = await requireLogin();
    return cartCollection(user.uid).doc(id).delete();
  }

  window.AppCart = {
    addSelectedProduct,
    getItems,
    setQty,
    removeItem,
  };
})();

