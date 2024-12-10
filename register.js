  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
  import { getAuth ,GoogleAuthProvider ,signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyD2F2qw1S4sa6K0BjG9XEf72x5h-gY8JV0",
    authDomain: "neu-ojt-app-bd4c6.firebaseapp.com",
    projectId: "neu-ojt-app-bd4c6",
    storageBucket: "neu-ojt-app-bd4c6.firebasestorage.app",
    messagingSenderId: "175965892446",
    appId: "1:175965892446:web:6062d7e0739ffa4a7369cf"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  auth.languageCode = 'en'
  const  provider  = new GoogleAuthProvider();
  const googleLogin = document.getElementById("google-login-btn");
  googleLogin.addEventListener("click", function(){
  signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    console.log(user);
    window.location.href = "../logged.html";
    
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });


    
  } )
