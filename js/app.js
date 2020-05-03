var firebaseConfig = {
    apiKey: "AIzaSyCrWkERdcW05eDfYcmfBrAnEcHosSYprEs",
    authDomain: "chirpme-e9ee0.firebaseapp.com",
    databaseURL: "https://chirpme-e9ee0.firebaseio.com",
    projectId: "chirpme-e9ee0",
    storageBucket: "chirpme-e9ee0.appspot.com",
    messagingSenderId: "963436196218",
    appId: "1:963436196218:web:acaa1a31a05eb3789ba6c3",
    measurementId: "G-EEV5R3HN8J"
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()

document.addEventListener("DOMContentLoaded", () => {
	const signInButton = document.getElementById("login-button")
	var provider = new firebase.auth.TwitterAuthProvider()
	
	signInButton.addEventListener("click", () => {
		firebase.auth().signInWithPopup(provider).then(function(result) {
			// This gives you a the Twitter OAuth 1.0 Access Token and Secret.
			// You can use these server side with your app's credentials to access the Twitter API.
			var token = result.credential.accessToken;
			var secret = result.credential.secret;
			// The signed-in user info.
			var user = result.user;
			
			localStorage.setItem("currentUser", user)
			// ...
		}).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// The email of the user's account used.
			var email = error.email;
			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential;
			// ...
		});
	})
	
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			console.log(user)
			window.location = "dashboard.html"
		} else {
			// No user is signed in.
			console.log("No one signed in yet.")
		}
	});
})