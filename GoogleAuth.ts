// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

// Validate institutional email
function isInstitutionalEmail(email) {
    return email ? /@neu\.edu\.ph$/.test(email) : false;
}

// Google sign-in function
export const signInWithGoogle = async () => {
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

            return user;
        } else {
            await signOut(auth); // Sign out invalid email users
            alert("Please use your institutional email (@neu.edu.ph).");
            return null;
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        return null;
    }
};

// Logout function
export const logOutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error during logout:", error);
    }
};

// Export auth and db
export { auth, db };
