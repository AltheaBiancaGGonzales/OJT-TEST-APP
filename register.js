// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// New Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxxT0jppPPBIjKSKEk7IEuStIkRDvR3rk",
    authDomain: "ojt-test-app.firebaseapp.com",
    projectId: "ojt-test-app",
    storageBucket: "ojt-test-app.firebasestorage.app",
    messagingSenderId: "826196055249",
    appId: "1:826196055249:web:3f24f4016133afe461a1f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Function to navigate between pages
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

// Function to validate institutional email
function isInstitutionalEmail(email) {
    const univDomain = /@neu\.edu\.ph$/;
    return email ? univDomain.test(email) : false;
}

// Function to update user profile in the UI
function updateUserProfile(user) {
    document.getElementById("userName").textContent = `Welcome, ${user.displayName}`;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userProfilePicture").src = user.photoURL || "./logo/default-profile.png";
    navigateTo("main-page");
}

// Google sign-in logic
document.getElementById("googleSignInButton").addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        if (isInstitutionalEmail(user.email)) {
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    displayName: user.displayName,
                    institutional_email: user.email,
                    photoUrl: user.photoURL,
                    createdAt: new Date(),
                    role: "Student",
                });
            }

            updateUserProfile(user);
        } else {
            alert("Please use your institutional email (@neu.edu.ph) to sign in.");
            auth.signOut();
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
    }
});

// Monitor authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user && isInstitutionalEmail(user.email)) {
        updateUserProfile(user);
    } else {
        navigateTo("login-page");
    }
});
