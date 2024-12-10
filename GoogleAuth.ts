// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

// Function to check if email is institutional
function isInstitutionalEmail(email) {
    if (!email) return false;
    const univDomain = /@neu\.edu\.ph$/;
    return univDomain.test(email);
}

// Function to handle Google sign-in
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
            console.log("Not an institutional email");
            return null;
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        return null;
    }
};

// Export the `auth` and `db` instances
export { auth, db };
