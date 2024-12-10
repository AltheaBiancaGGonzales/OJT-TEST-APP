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

// Helper function to navigate between pages
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

// Function to check if email is institutional
function isInstitutionalEmail(email) {
    const univDomain = /@neu\.edu\.ph$/;
    return univDomain.test(email);
}

// Function to update user profile in the UI
function updateUserProfile(user) {
    document.getElementById("userName").textContent = `Welcome, ${user.displayName}`;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userProfilePicture").src = user.photoURL || "./logo/default-profile.png";
}

// Function to handle Google sign-in
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("googleSignInButton")?.addEventListener("click", async () => {
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
                navigateTo('main-page');
            } else {
                alert("Please use your institutional email (@neu.edu.ph) to sign in.");
                signOut(auth);
            }
        } catch (error) {
            console.error("Error during sign-in:", error);
            alert("Error signing in: " + error.message);
        }
    });
});

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (user && isInstitutionalEmail(user.email)) {
        updateUserProfile(user);
        navigateTo("main-page");
    } else {
        navigateTo("login-page");
    }
});

// Logout function
function logout() {
    signOut(auth).then(() => {
        navigateTo("login-page");
    }).catch((error) => {
        console.error("Error during sign-out:", error);
        alert("Error logging out: " + error.message);
    });
}
