import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";


// ===============================
// FIREBASE INITIALIZATION
// ===============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ===============================
// ELEMENTS
// ===============================

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginPanel = document.getElementById("loginPanel");
const signupPanel = document.getElementById("signupPanel");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const message = document.getElementById("message");


// ===============================
// MESSAGE FUNCTION
// ===============================

function showMessage(text, type = "") {

  message.textContent = text;

  message.className = "message";

  if (type) {
    message.classList.add(type);
  }

}


// ===============================
// LOGIN / SIGNUP TAB
// ===============================

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


// ===============================
// BUSINESS / CUSTOMER SIGNUP
// ===============================

signupForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  showMessage("Creating your account...", "ok");


  const accountType =
    document.getElementById("accountType").value;

  const name =
    document.getElementById("name").value.trim();

  const mobile =
    document.getElementById("mobile").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value;


  // ===============================
  // MOBILE VALIDATION
  // ===============================

  const cleanMobile =
    mobile.replace(/\D/g, "");


  if (cleanMobile.length !== 10) {

    showMessage(
      "Please enter a valid 10-digit mobile number.",
      "err"
    );

    return;
  }


  // ===============================
  // PASSWORD VALIDATION
  // ===============================

  if (password.length < 6) {

    showMessage(
      "Password must contain at least 6 characters.",
      "err"
    );

    return;
  }


  try {

    // ===============================
    // CREATE FIREBASE ACCOUNT
    // ===============================

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );


    const user =
      userCredential.user;


    // ===============================
    // SAVE USER PROFILE
    // ===============================

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


    // ===============================
    // SUCCESS
    // ===============================

    showMessage(
      "Account created successfully!",
      "ok"
    );


    signupForm.reset();


  } catch (error) {

    console.error(error);


    let errorMessage =
      error.message || "Something went wrong.";


    // Friendly Firebase messages

    if (error.code === "auth/email-already-in-use") {

      errorMessage =
        "This email is already registered.";

    }

    else if (error.code === "auth/invalid-email") {

      errorMessage =
        "Please enter a valid email address.";

    }

    else if (error.code === "auth/weak-password") {

      errorMessage =
        "Password is too weak.";

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

});


// ===============================
// LOGIN
// ===============================

loginForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  showMessage("Signing in...", "ok");


  const email =
    document.getElementById("loginEmail")
      .value
      .trim();

  const password =
    document.getElementById("loginPassword")
      .value;


  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );


    showMessage(
      "Login successful!",
      "ok"
    );


    /*
      Dashboard will be connected
      in the next development step.
    */


  } catch (error) {

    console.error(error);


    let errorMessage =
      error.message ||
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


    showMessage(
      errorMessage,
      "err"
    );

  }

});
