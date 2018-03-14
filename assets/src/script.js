// Initialize Firebase
var config = {
  apiKey: "AIzaSyD1Bp9JkiAS1J1JutbizPWF7_ofCMWsZh8",
  authDomain: "rps-multiplayer-80838.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-80838.firebaseio.com",
  projectId: "rps-multiplayer-80838",
  storageBucket: "rps-multiplayer-80838.appspot.com",
  messagingSenderId: "177104249799"
};
firebase.initializeApp(config);

var database = firebase.database();

var p1Name;
var p2Name;
var p1Choice;
var p2Choice;
var numberOfUsers = 0;

//used for the click event on submit button to get user name
var setName = function() {

  //tracks how many players we have. Either 1 or 2
  numberOfUsers++;

  //sets player 1
  if (numberOfUsers === 1) {

    //gets player 1 input
    p1Name = document.getElementById('user-name').value.trim();
    console.log(p1Name)
    console.log(numberOfUsers)

    //stores player 1 in the db
    database.ref('players').push({
      p1Name: p1Name
    });
  }

  //sets player 2
  if (numberOfUsers === 2) {

    //gets player 2 input
    p1Name = document.getElementById('user-name').value.trim();
    console.log(p2Name)
    console.log(numberOfUsers)

    //stores player 2 in the db
    database.ref('players').push({
      p2Name: p2Name
    });

  }
  //clears user input
  document.getElementById('user-name').value = '';
}

//sets the names of each player
document.getElementById('submit-name').onclick = function (e) { 
  e.preventDefault(); 
  setName(); 
}

database.ref().on("value", function(snapshot) {

  //sets player 1 name
  document.getElementById('p1').innerText = snapshot.child("players/player1/name").val();

  //sets player 2 name
  document.getElementById('p2').innerText = snapshot.child("players/player2/name").val();

}, function(error) {

});

// database.ref().once("value")
//   .then((snapshot) => {
//     document.getElementById('p1').innerText = snapshot.child("players/player1/name").val();
//   });