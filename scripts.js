// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Import custom functions
import { signInWithGoogle } from "./GoogleAuth.js";

// Updated Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxxT0jppPPBIjKSKEk7IEuStIkRDvR3rk",
    authDomain: "ojt-test-app.firebaseapp.com",
    projectId: "ojt-test-app",
    storageBucket: "ojt-test-app.firebasestorage.app",
    messagingSenderId: "826196055249",
    appId: "1:826196055249:web:3f24f4016133afe461a1f0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to navigate between pages
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.remove('hidden');
    }
}

// Update user profile in UI
function updateUserProfile(user) {
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");
    const userProfilePictureElement = document.getElementById("userProfilePicture");

    if (userNameElement) userNameElement.textContent = `Welcome, ${user.displayName}`;
    if (userEmailElement) userEmailElement.textContent = user.email;
    if (userProfilePictureElement) userProfilePictureElement.src = user.photoURL || "./logo/default-profile.png";

    navigateTo("main-page");
}

// Attach event listener to the Google sign-in button
document.getElementById("googleSignInButton").addEventListener("click", async () => {
    try {
        const user = await signInWithGoogle();

        if (user) {
            updateUserProfile(user);
        } else {
            alert("Please use your institutional email (@neu.edu.ph) to sign in.");
        }
    } catch (error) {
        console.error("Error signing in with Google:", error);
        alert("An error occurred during sign-in. Please try again.");
    }
});

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (user && user.email.endsWith("@neu.edu.ph")) {
        updateUserProfile(user);
    } else {
        navigateTo("login-page");
    }
});
