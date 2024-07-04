import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcqwWWhUgmYtHHyfqEfBW_PgOeEJAItsw",
  authDomain: "proiectwebfinal.firebaseapp.com",
  databaseURL: "https://proiectwebfinal-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "proiectwebfinal",
  storageBucket: "proiectwebfinal.appspot.com",
  messagingSenderId: "3152630061",
  appId: "1:3152630061:web:5172e5288a1cfd51df43a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const cars = {
  "carID1": { "name": "Ferrari Testarossa", "image": "images/fc1.png" },
  "carID2": { "name": "Lamborghini Countach", "image": "images/fc2.png" },
  "carID3": { "name": "Honda NSX", "image": "images/fc3.png" },
  "carID4": { "name": "Cadillac Eldorado", "image": "images/fc4.png" },

  "carID5": { "name": "Dodge Charger", "image": "images/fc5.png" },
  "carID6": { "name": "Aston Martin DB5", "image": "images/fc6.png" },
  "carID7": { "name": "Ford Mustang", "image": "images/fc7.png" },
  "carID8": { "name": "Rolls-Royce Phantom V", "image": "images/fc8.png" },

  "carID9": { "name": "Dacia 1310", "image": "images/fc9.png" },
  "carID10": { "name": "Porsche 911", "image": "images/fc10.png" },
  "carID11": { "name": "DeLorean DMC-12", "image": "images/fc11.png" },
  "carID12": { "name": "Mercedes-Benz 300SL", "image": "images/fc12.png" },

  "carID13": { "name": "BMW E24", "image": "images/fc13.png" },
  "carID14": { "name": "Ferrari F40", "image": "images/fc14.png" },
  "carID15": { "name": "Lamborghini Jarama", "image": "images/fc15.png" },
  "carID16": { "name": "BMW E30 M3", "image": "images/fc16.png" },

  "carID17": { "name": "Rolls-Royce Camarague", "image": "images/fc17.png" },
  "carID18": { "name": "Audi 80", "image": "images/fc18.png" },
  "carID19": { "name": "Mercedes-Benz 380SL", "image": "images/fc19.png" },
  "carID20": { "name": "Trabant", "image": "images/fc20.png" },
};

// add car fav firebase
function addCars() {
  const carsRef = ref(database, 'cars');
  set(carsRef, cars)
    .then(() => {
      console.log("Cars added successfully to Firebase");
    })
    .catch((error) => {
      console.error("Error adding cars to Firebase: ", error);
    });
}

// add cars to fav
function addToFavorites(carId) {
  const car = cars[carId];
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userId = user.uid;
      const favoriteRef = ref(database, 'favorites/' + userId + '/' + carId);
      set(favoriteRef, true)
        .then(() => {
          console.log("Car added to favorites successfully");
          alert(`${car.name} was added to favorites!`);
        })
        .catch((error) => {
          console.error("Error adding car to favorites: ", error);
        });
    } else {
      console.log("User is not logged in");
    }
  });
}

// load fav cars
function loadFavoriteCars() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userId = user.uid;
      const favoritesRef = ref(database, 'favorites/' + userId);

      get(favoritesRef).then((snapshot) => {
        if (snapshot.exists()) {
          const favoriteCars = snapshot.val();
          const carIds = Object.keys(favoriteCars);

          carIds.forEach((carId) => {
            const carRef = ref(database, 'cars/' + carId);
            get(carRef).then((carSnapshot) => {
              if (carSnapshot.exists()) {
                const car = carSnapshot.val();
                displayFavoriteCar(carId, car);
              }
            });
          });
        } else {
          console.log("No favorite cars found.");
        }
      }).catch((error) => {
        console.error("Error getting favorite cars: ", error);
      });
    } else {
      console.log("User is not logged in");
    }
  });
}

// del cars from fav
function deleteFromFavorites(carId) {
  const car = cars[carId];
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userId = user.uid;
      const favoriteRef = ref(database, 'favorites/' + userId + '/' + carId);
      set(favoriteRef, null)
        .then(() => {
          console.log("Car removed from favorites successfully");
          alert(`${car.name} was deleted from favorites!`);
          const carElement = document.querySelector(`button[data-car-id="${carId}"]`).closest('.col-lg-3');
          location.reload();
          if (carElement) {
            carElement.remove();
          }
        })
        .catch((error) => {
          console.error("Error removing car from favorites: ", error);
        });
    } else {
      console.log("User is not logged in");
    }
  });
}

// display cars in fav.html
function displayFavoriteCar(carId, car) {
  const favoriteCarsContainer = document.getElementById('favorite-cars');

  if (favoriteCarsContainer) {
    if (carCount === 0 || carCount % 4 === 0) {
      currentRow = document.createElement('div');
      currentRow.classList.add('row');
      favoriteCarsContainer.appendChild(currentRow);
    }

    const carElement = document.createElement('div');
    carElement.classList.add('col-lg-3', 'col-md-4', 'col-sm-6');
    carElement.innerHTML = `
      <div class="single-featured-cars">
        <div class="featured-img-box">
          <div class="featured-cars-img">
            <img src="${car.image}" alt="${car.name}">
          </div>
          <div class="featured-model-info"></div>
        </div>
        <div class="featured-cars-txt">
          <a href="#">${car.name}</a>
          <button class="del-favorite-btn" data-car-id="${carId}">Del Fav</button>
        </div>
      </div>
    `;

    currentRow.appendChild(carElement);
    carCount++;
  } else {
    console.error("Element with ID 'favorite-cars' not found.");
  }
}

let carCount = 0;
let currentRow;

window.onload = function() {
  addCars();

  document.querySelectorAll('.favorite-btn').forEach(button => {
    button.addEventListener('click', function() {
      const carId = this.getAttribute('data-car-id');
      addToFavorites(carId);
    });
  });

  document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('del-favorite-btn')) {
      const carId = event.target.getAttribute('data-car-id');
      deleteFromFavorites(carId);
    }
  });

  console.log('DOM fully loaded and parsed');
  loadFavoriteCars();
};
