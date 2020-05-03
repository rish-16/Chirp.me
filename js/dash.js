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

function PostCard(childData, authorID) {
	this.title = childData.title
	this.url = childData.url
	this.created = childData.created
	this.ID = childData.postID
	this.authorID = authorID
	
	console.log(this.title, this.url, this.created, this.ID, this.authorID)
}

PostCard.prototype.display = function(parentContainer) {
	var card = document.createElement("div")
	card.className = "post-card"
	
	var cardTitle = document.createElement("p")
	cardTitle.className = "post-title"
	cardTitle.textContent = this.title
	
	var cardOptions = document.createElement("div")
	cardOptions.className = "post-options"
	
	var postDate = document.createElement("p")
	postDate.className = "post-date"
	
	var date = new Date(this.created)
	var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
	var formattedDate = months_arr[(date.getUTCMonth())] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear()

	postDate.textContent = formattedDate
	
	var postVisit = document.createElement("p")
	postVisit.innerHTML = `<i class="fas fa-external-link-alt"></i>`
	postVisit.className = "visit-button"
	
	postVisit.addEventListener("click", this.visitPost)
	
	var postDelete = document.createElement("p")
	postDelete.innerHTML = `<i class="fas fa-trash-alt"></i>`
	postDelete.className = "delete-button"
	
	postDelete.addEventListener("click", this.deletePost)
	
	cardOptions.appendChild(postDate)
	cardOptions.appendChild(postVisit)
	cardOptions.appendChild(postDelete)
	
	card.appendChild(cardTitle)
	card.appendChild(cardOptions)
	
	parentContainer.appendChild(card)
}

PostCard.prototype.visitPost = function() {
	window.location.assign(this.url)
}

PostCard.prototype.deletePost = function() {
	var dbRef = firebase.database().ref().child("Posts").child(this.authorID).child(this.ID).remove().then(() => {
		console.log("Deleted post")
	})
}

document.addEventListener("DOMContentLoaded", () => {
	const dashButton = document.getElementById("visit-dash")
	const addPostButton = document.getElementById("add-post")
	const logoutButton = document.getElementById("logout")
	const profPic = document.getElementById("prof-pic")
	
	const usernameText = document.getElementById("account-name")
	const postContainer = document.getElementById("post-container")
	
	logoutButton.addEventListener("click", () => {
		firebase.auth().signOut().then(function() {}).catch(function(error) {
			console.log(error)
		});
	})
	
	var currentUser
	
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			currentUser = firebase.auth().currentUser
			profPic.src = user.photoURL
			usernameText.textContent = user.displayName
			
			// loading posts from DB
			var dbRef = firebase.database().ref().child("Posts").child(currentUser.uid)
			dbRef.orderByChild("created").on("value", snapshot => {
				snapshot.forEach(child => {
					var childData = child.val()
					var card = new PostCard(childData, user.uid)
					card.display(postContainer)
				})
			})			
		} else {
			// No user is signed in.
			console.log("No one signed in yet.")
			window.location = "index.html"
		}
	})
	
	dashButton.addEventListener("click", () => {
		window.location.href = "dashboard.html"
	})
	
	addPostButton.addEventListener("click", () => {
		window.location.href = "newpost.html"
	})
})