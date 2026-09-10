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

const userName =
  document.getElementById("userName");

const userAvatar =
  document.getElementById("userAvatar");

const logoutBtn =
  document.getElementById("logoutBtn");


// =====================================
// LOAD USER
// =====================================

onAuthStateChanged(
  auth,
  async (user) => {

    // =================================
    // USER NOT LOGGED IN
    // =================================

    if (!user) {

      window.location.href =
        "index.html";

      return;
    }


    try {

      // =================================
      // GET USER PROFILE
      // =================================

      const userRef =
        doc(
          db,
          "users",
          user.uid
        );


      const userSnapshot =
        await getDoc(userRef);


      // =================================
      // PROFILE NOT FOUND
      // =================================

      if (!userSnapshot.exists()) {

        userName.textContent =
          user.email || "User";

        userAvatar.textContent =
          "U";

        return;
      }


      const userData =
        userSnapshot.data();


      // =================================
      // NAME
      // =================================

      const name =
        userData.name ||
        user.email ||
        "User";


      userName.textContent =
        name;


      // =================================
      // AVATAR
      // =================================

      const firstLetter =
        name
          .trim()
          .charAt(0)
          .toUpperCase();


      userAvatar.textContent =
        firstLetter;


      // =================================
      // ROLE
      // =================================

      const role =
        userData.role ||
        "customer";


      const roleElement =
        document.querySelector(
          ".user-role"
        );


      if (roleElement) {

        if (
          role ===
          "business_owner"
        ) {

          roleElement.textContent =
            "Business Owner";

        }

        else {

          roleElement.textContent =
            "Customer";

        }

      }


      // =================================
      // WELCOME MESSAGE
      // =================================

      const welcomeTitle =
        document.querySelector(
          ".welcome-card h2"
        );


      if (welcomeTitle) {

        welcomeTitle.textContent =
          `Welcome, ${name} 👋`;

      }


    } catch (error) {

      console.error(
        "Dashboard Error:",
        error
      );

    }

  }
);


// =====================================
// LOGOUT
// =====================================

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
