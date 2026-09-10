import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
  firebaseConfig
} from "./firebase-config.js";


// =====================================
// FIREBASE INITIALIZATION
// =====================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

async function redirectByRole(uid, fallback = "dashboard.html") {
  const profile = await getDoc(doc(db, "users", uid));
  if (!profile.exists()) { window.location.href = fallback; return; }
  window.location.href = profile.data().role === "customer" ? "customer-dashboard.html" : fallback;
}



// =====================================
// ELEMENTS
// =====================================

const loginTab =
  document.getElementById("loginTab");

const signupTab =
  document.getElementById("signupTab");

const loginPanel =
  document.getElementById("loginPanel");

const signupPanel =
  document.getElementById("signupPanel");

const loginForm =
  document.getElementById("loginForm");

const signupForm =
  document.getElementById("signupForm");

const message =
  document.getElementById("message");


// =====================================
// MESSAGE
// =====================================

function showMessage(text, type = "") {

  message.textContent = text;

  message.className = "message";

  if (type) {
    message.classList.add(type);
  }

}


// =====================================
// LOGIN / SIGNUP TABS
// =====================================

loginTab.addEventListener("click", () => {

  loginTab.classList.add("active");

  signupTab.classList.remove("active");

  loginPanel.classList.remove("hidden");

  signupPanel.classList.add("hidden");

  showMessage("");

});


signupTab.addEventListener("click", () => {

  signupTab.classList.add("active");

  loginTab.classList.remove("active");

  signupPanel.classList.remove("hidden");

  loginPanel.classList.add("hidden");

  showMessage("");

});


// =====================================
// SIGNUP
// =====================================

signupForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    showMessage(
      "Creating your account...",
      "ok"
    );


    const accountType =
      document
        .getElementById("accountType")
        .value;


    const name =
      document
        .getElementById("name")
        .value
        .trim();


    const mobile =
      document
        .getElementById("mobile")
        .value
        .trim();


    const email =
      document
        .getElementById("email")
        .value
        .trim();


    const password =
      document
        .getElementById("password")
        .value;


    // =================================
    // MOBILE VALIDATION
    // =================================

    const cleanMobile =
      mobile.replace(/\D/g, "");


    if (cleanMobile.length !== 10) {

      showMessage(
        "Please enter a valid 10-digit mobile number.",
        "err"
      );

      return;
    }


    // =================================
    // PASSWORD VALIDATION
    // =================================

    if (password.length < 6) {

      showMessage(
        "Password must contain at least 6 characters.",
        "err"
      );

      return;
    }


    try {

      // =================================
      // CREATE AUTH ACCOUNT
      // =================================

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );


      const user =
        userCredential.user;


      // =================================
      // SAVE USER PROFILE
      // =================================

      await setDoc(
        doc(db, "users", user.uid),
        {

          uid: user.uid,

          role: accountType,

          name: name,

          mobile: cleanMobile,

          email: email,

          status: "active",

          createdAt: serverTimestamp()

        }
      );


      // =================================
      // SUCCESS
      // =================================

      showMessage(
        "Account created successfully! Opening dashboard...",
        "ok"
      );


      // Give Firebase a moment
      setTimeout(async () => {

        await redirectByRole(user.uid);

      }, 1000);


    } catch (error) {

      console.error(
        "Signup Error:",
        error
      );


      let errorMessage =
        "Something went wrong.";


      if (
        error.code ===
        "auth/email-already-in-use"
      ) {

        errorMessage =
          "This email is already registered.";

      }

      else if (
        error.code ===
        "auth/invalid-email"
      ) {

        errorMessage =
          "Please enter a valid email address.";

      }

      else if (
        error.code ===
        "auth/weak-password"
      ) {

        errorMessage =
          "Password must contain at least 6 characters.";

      }

      else if (
        error.code ===
        "auth/network-request-failed"
      ) {

        errorMessage =
          "Network error. Please try again.";

      }

      else if (
        error.code ===
        "permission-denied"
      ) {

        errorMessage =
          "Firestore permission denied.";

      }


      showMessage(
        errorMessage,
        "err"
      );

    }

  }
);


// =====================================
// LOGIN
// =====================================

loginForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    showMessage(
      "Signing in...",
      "ok"
    );


    const email =
      document
        .getElementById("loginEmail")
        .value
        .trim();


    const password =
      document
        .getElementById("loginPassword")
        .value;


    try {

      // =================================
      // FIREBASE LOGIN
      // =================================

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );


      const user =
        userCredential.user;


      // =================================
      // CHECK USER PROFILE
      // =================================

      const userDoc =
        await getDoc(
          doc(db, "users", user.uid)
        );


      if (!userDoc.exists()) {

        showMessage(
          "User profile not found.",
          "err"
        );

        await signOut(auth);

        return;
      }


      // =================================
      // LOGIN SUCCESS
      // =================================

      showMessage(
        "Login successful! Opening dashboard...",
        "ok"
      );


      setTimeout(async () => {

        await redirectByRole(user.uid);

      }, 700);


    } catch (error) {

      console.error(
        "Login Error:",
        error
      );


      let errorMessage =
        "Login failed.";


      if (
        error.code ===
        "auth/invalid-credential"
      ) {

        errorMessage =
          "Incorrect email or password.";

      }

      else if (
        error.code ===
        "auth/user-not-found"
      ) {

        errorMessage =
          "Account not found.";

      }

      else if (
        error.code ===
        "auth/wrong-password"
      ) {

        errorMessage =
          "Incorrect password.";

      }

      else if (
        error.code ===
        "auth/invalid-email"
      ) {

        errorMessage =
          "Please enter a valid email.";

      }

      else if (
        error.code ===
        "auth/network-request-failed"
      ) {

        errorMessage =
          "Network error. Please try again.";

      }

      else if (
        error.code ===
        "permission-denied"
      ) {

        errorMessage =
          "Firestore permission denied.";

      }


      showMessage(
        errorMessage,
        "err"
      );

    }

  }
);
