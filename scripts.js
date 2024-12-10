// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsfIKXHr0AY8RneP2VWpjdR038aMNkCsw",
    authDomain: "out-of-bounds-ojt-app.firebaseapp.com",
    projectId: "out-of-bounds-ojt-app",
    storageBucket: "out-of-bounds-ojt-app.appspot.com",
    messagingSenderId: "1059978490785",
    appId: "1:1059978490785:web:d08f9e40b5b0e58efed1e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Navigation function
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

// Google sign-in function
document.getElementById("googleSignInButton").addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            await setDoc(userRef, {
                name: user.displayName,
                email: user.email,
                profilePicture: user.photoURL
            });
        }

        // Set user information
        document.getElementById('userName').innerText = `Welcome, ${user.displayName}`;
        document.getElementById('userEmail').innerText = user.email;
        document.getElementById('userProfilePicture').src = user.photoURL;

        // Navigate to main page
        navigateTo('main-page');
    } catch (error) {
        console.error(error);
        alert("Error signing in: " + error.message);
    }
});

// Logout function
function logout() {
    signOut(auth).then(() => {
        navigateTo('login-page');
    }).catch((error) => {
        console.error(error);
        alert("Error logging out: " + error.message);
    });
}

// Watch for authentication state changes
onAuthStateChanged(auth, user => {
    if (user) {
        // User is signed in
        document.getElementById('userName').innerText = `Welcome, ${user.displayName}`;
        document.getElementById('userEmail').innerText = user.email;
        document.getElementById('userProfilePicture').src = user.photoURL;
        navigateTo('main-page');
    } else {
        // No user is signed in
        navigateTo('login-page');
    }
});
