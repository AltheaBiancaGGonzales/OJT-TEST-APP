import { signInWithGoogle, logOutUser } from "./GoogleAuth.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const auth = getAuth();

// Navigate between pages
function navigateTo(pageId) {
    document.querySelectorAll(".page").forEach((page) => page.classList.add("hidden"));
    document.getElementById(pageId).classList.remove("hidden");
}

// Update UI with user profile
function updateUserProfile(user) {
    document.getElementById("userName").textContent = `Welcome, ${user.displayName}`;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userProfilePicture").src = user.photoURL || "./logo/default-profile.png";
    navigateTo("main-page");
}

// Event listeners
document.getElementById("googleSignInButton").addEventListener("click", async () => {
    const user = await signInWithGoogle();
    if (user) navigateTo("welcome-page");
});

document.getElementById("logoutButton").addEventListener("click", async () => {
    await logOutUser();
    navigateTo("login-page");
});

document.getElementById("nextButton").addEventListener("click", () => navigateTo("main-page"));
document.getElementById("nextChoicesButton").addEventListener("click", () => navigateTo("choices-page"));
document.getElementById("uploadRequirementsButton").addEventListener("click", () => navigateTo("upload-requirements"));
document.getElementById("studentInfoButton").addEventListener("click", () => navigateTo("student-info"));
document.getElementById("backToMainButton").addEventListener("click", () => navigateTo("main-page"));

// Authentication state observer
onAuthStateChanged(auth, (user) => {
    if (user && user.email.endsWith("@neu.edu.ph")) {
        updateUserProfile(user);
    } else {
        navigateTo("login-page");
    }
});
