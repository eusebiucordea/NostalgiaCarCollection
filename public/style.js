import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyDcqwWWhUgmYtHHyfqEfBW_PgOeEJAItsw",
  authDomain: "proiectwebfinal.firebaseapp.com",
  databaseURL: "https://proiectwebfinal-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "proiectwebfinal",
  storageBucket: "proiectwebfinal.appspot.com",
  messagingSenderId: "3152630061",
  appId: "1:3152630061:web:5172e5288a1cfd51df43a4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', function() {
  const authButton = document.getElementById('loginButton');
  const greeting = document.getElementById('greeting');
  const favoritesTab = document.getElementById('favoritesTab');

  // hide fav tab
  if (favoritesTab) {
    favoritesTab.style.display = 'none';
  }

  // check user authentication state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // user is signed in
      const userRef = ref(database, 'users/' + user.uid);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          greeting.textContent = `Hello, ${userData.username}`;
        } else {
          console.error("No user data available");
        }
      }).catch((error) => {
        console.error("Error fetching user data:", error);
      });

      if (favoritesTab) {
        favoritesTab.style.display = 'block'; // show fav tab
      }

      authButton.textContent = 'Logout';
      authButton.onclick = function() {
        signOut(auth).then(() => {
          alert('You have been logged out.');
          window.location.href = 'index.html';
        }).catch((error) => {
          console.error('Error during logout:', error);
        });
      };
    } else {
      // user is not signed in
      greeting.textContent = ''; // clear hello ... message
      if (favoritesTab) {
        favoritesTab.style.display = 'none'; // hide fav tab
      }
      authButton.textContent = 'Login';
      authButton.onclick = function() {
        window.location.href = 'login.html';
      };
    }
  });
});

window.addEventListener('load', function() {
  setTimeout(function() {
    var loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    } else {
      console.error("Loading screen not found");
    }
  }, 500); // (1000ms = 1s)
});

document.addEventListener('DOMContentLoaded', function() {
  const nav = document.querySelector('nav');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 0) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
});

// function add car to user's fav
function addToFavorites(userId, carId) {
  const favoritesRef = ref(database, 'users/' + userId + '/favorites');
  push(favoritesRef, carId)
    .then(() => {
      alert('Car added to favorites!');
    })
    .catch((error) => {
      console.error('Error adding to favorites:', error);
    });
}

