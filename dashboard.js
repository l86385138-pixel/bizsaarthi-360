import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
  firebaseConfig
} from "./firebase-config.js";


// =====================================
// FIREBASE
// =====================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// =====================================
// ELEMENTS
// =====================================

const loadingScreen =
  document.getElementById("loadingScreen");

const userName =
  document.getElementById("userName");

const userAvatar =
  document.getElementById("userAvatar");

const logoutBtn =
  document.getElementById("logoutBtn");


// =====================================
// HIDE LOADING
// =====================================

function hideLoading() {
  if (loadingScreen) {
    loadingScreen.style.display = "none";
  }
}


// =====================================
// SHOW ERROR
// =====================================

function showDashboardError(message) {

  hideLoading();

  console.error(message);

  const welcomeTitle =
    document.querySelector(".welcome-card h2");

  if (welcomeTitle) {
    welcomeTitle.textContent = "Welcome 👋";
  }

}


// =====================================
// AUTH STATE
// =====================================

onAuthStateChanged(
  auth,
  async (user) => {

    // ================================
    // NOT LOGGED IN
    // ================================

    if (!user) {

      window.location.href = "index.html";

      return;
    }


    // ================================
    // USER LOGGED IN
    // ================================

    try {

      const userRef =
        doc(
          db,
          "users",
          user.uid
        );


      const userSnapshot =
        await getDoc(userRef);


      // ================================
      // PROFILE NOT FOUND
      // ================================

      if (!userSnapshot.exists()) {

        const fallbackName =
          user.displayName ||
          user.email ||
          "User";

        if (userName) {
          userName.textContent =
            fallbackName;
        }

        if (userAvatar) {
          userAvatar.textContent =
            fallbackName
              .trim()
              .charAt(0)
              .toUpperCase();
        }

        hideLoading();

        return;
      }


      // ================================
      // USER DATA
      // ================================

      const userData =
        userSnapshot.data();


      const name =
        userData.name ||
        user.displayName ||
        user.email ||
        "User";


      // ================================
      // NAME
      // ================================

      if (userName) {
        userName.textContent = name;
      }


      // ================================
      // AVATAR
      // ================================

      if (userAvatar) {

        userAvatar.textContent =
          name
            .trim()
            .charAt(0)
            .toUpperCase();

      }


      // ================================
      // ROLE
      // ================================

      const role =
        userData.role ||
        "customer";


      const roleElement =
        document.querySelector(
          ".user-role"
        );


      if (roleElement) {

        roleElement.textContent =
          role === "business_owner"
            ? "Business Owner"
            : "Customer";

      }


      // ================================
      // WELCOME
      // ================================

      const welcomeTitle =
        document.querySelector(
          ".welcome-card h2"
        );


      if (welcomeTitle) {

        welcomeTitle.textContent =
          `Welcome, ${name} 👋`;

      }


      // ================================
      // IMPORTANT
      // ================================

      hideLoading();


    } catch (error) {

      console.error(
        "Dashboard Error:",
        error
      );

      showDashboardError(
        "Unable to load profile"
      );

    }

  }
);


// =====================================
// LOGOUT
// =====================================

if (logoutBtn) {

  logoutBtn.addEventListener(
    "click",
    async () => {

      try {

        await signOut(auth);

        window.location.href =
          "index.html";

      } catch (error) {

        console.error(
          "Logout Error:",
          error
        );

        alert(
          "Logout failed. Please try again."
        );

      }

    }
  );

}
