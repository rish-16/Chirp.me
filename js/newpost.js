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
	const dashButton = document.getElementById("visit-dash")
	const addPostButton = document.getElementById("add-post")
	const logoutButton = document.getElementById("logout")
	const profPic = document.getElementById("prof-pic")
	
	logoutButton.addEventListener("click", () => {
		firebase.auth().signOut().then(function() {
			// Sign-out successful.
		}).catch(function(error) {
			// An error happened.
		});
	})
	
	function getPostID() {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < 8; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;	
	}
	
	var currentUser
	
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			currentUser = firebase.auth().currentUser
			console.log(currentUser)
			profPic.src = user.photoURL
		} else {
			// No user is signed in.
			console.log("No one signed in yet.")
			window.location = "index.html"
		}
	});
	
	dashButton.addEventListener("click", () => {
		window.location.href = "dashboard.html"
	})
	
	addPostButton.addEventListener("click", () => {
		window.location.href = "newpost.html"
	})
	
	var dbRef = firebase.database().ref()
	var postForm = document.querySelector("form")
	
	postForm.addEventListener("submit", (event) => {
		event.preventDefault()
		
		var formData = new FormData(postForm)
		var title = formData.get("title")
		var url = formData.get("url")
		
		if (title.trim() == "" || url.trim() == "") {
			window.alert("Whoops! Please fill in all fields before publishing!")
		} else {
			var postID = getPostID()
		
			var post = {
				"title": title,
				"url": url,
				"created": Date.now(),
				"postID": postID
			}
			
			console.log(post)
			
			dbRef.child("Posts").child(currentUser.uid).child(postID).set(post).then(() => {
				postForm.reset()
				window.location.href = "dashboard.html"
			})
		}
	})
})