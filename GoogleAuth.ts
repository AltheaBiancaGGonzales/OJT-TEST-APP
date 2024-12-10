import { GoogleAuthProvider, signInWithPopup, getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsfIKXHr0AY8RneP2VWpjdR038aMNkCsw",
    authDomain: "out-of-bounds-ojt-app.firebaseapp.com",
    projectId: "out-of-bounds-ojt-app",
    storageBucket: "out-of-bounds-ojt-app.appspot.com",
    messagingSenderId: "1059978490785",
    appId: "1:1059978490785:web:d08f9e40b5b0e58efed1e0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

// Function to check if email is institutional
function isInstitutionalEmail(email: string | null): boolean {
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
        console.error("Error during sign-in", error);
        return null;
    }
};

export { auth, db };
