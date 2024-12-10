// Import necessary Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { signInWithGoogle } from "./GoogleAuth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxxT0jppPPBIjKSKEk7IEuStIkRDvR3rk",
    authDomain: "ojt-test-app.firebaseapp.com",
    projectId: "ojt-test-app",
    storageBucket: "ojt-test-app.appspot.com",
    messagingSenderId: "826196055249",
    appId: "1:826196055249:web:3f24f4016133afe461a1f0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Helper function to navigate between pages
function navigateTo(pageId) {
    document.querySelectorAll(".page").forEach((page) => page.classList.add("hidden"));
    document.getElementById(pageId).classList.remove("hidden");
}

// Update user profile in the main page
function updateUserProfile(user) {
    document.getElementById("userName").textContent = `Welcome, ${user.displayName}`;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userProfilePicture").src = user.photoURL || "./logo/default-profile.png";
    navigateTo("main-page");
}

// Event listeners
document.getElementById("googleSignInButton").addEventListener("click", async () => {
    const user = await signInWithGoogle();
    if (user) {
        navigateTo("welcome-page");
    } else {
        alert("Please use your institutional email (@neu.edu.ph) to sign in.");
    }
});

document.getElementById("nextButton").addEventListener("click", () => navigateTo("main-page"));

document.getElementById("logoutButton").addEventListener("click", () => {
    signOut(auth)
        .then(() => navigateTo("login-page"))
        .catch((error) => console.error("Error logging out:", error));
});

document.getElementById("nextChoicesButton").addEventListener("click", () => navigateTo("choices-page"));
document.getElementById("uploadRequirementsButton").addEventListener("click", () => navigateTo("upload-requirements"));
document.getElementById("studentInfoButton").addEventListener("click", () => navigateTo("student-info"));
document.getElementById("backToMainButton").addEventListener("click", () => navigateTo("main-page"));

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (user && user.email.endsWith("@neu.edu.ph")) {
        updateUserProfile(user);
    } else {
        navigateTo("login-page");
    }
});
