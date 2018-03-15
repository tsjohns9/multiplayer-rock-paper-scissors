window.onload = function() {
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

  // Clear sessionStorage
  sessionStorage.clear();

  //sets our user info
  var p1Name;
  var p2Name;
  var p1Choice;
  var p2Choice;
  var numberOfUsers = 0;

  //possible choices
  var choices = document.getElementsByClassName('choices-btn');

  //sets each player name, and which user they are. either user 1 or 2
  var setName = function() {

    //for persistence, this will get added to the db, and will then get set with that info
    numberOfUsers++;

    //sets player 1
    if (numberOfUsers === 1) {

      //gets player 1 input
      p1Name = document.getElementById('user-name').value.trim();

      //stores player 1 in the db
      database.ref('players').push({
        name: p1Name,
        user: numberOfUsers
      });

      //reveals the choices once the player is set
      sessionStorage.setItem('p1CanChoose', true);
      if (sessionStorage.p1CanChoose) {
        document.querySelector('.choices').classList.remove('d-none');
      }
    }

    //sets player 2
    if (numberOfUsers === 2) {

      //gets player 2 input
      p2Name = document.getElementById('user-name').value.trim();

      //stores player 2 in the db
      database.ref('players').push({
        name: p2Name,
        user: numberOfUsers
      });

      //reveals the choices once the player is set
      sessionStorage.setItem('p2CanChoose', true);
      if (sessionStorage.p2CanChoose) {
        document.querySelector('.choices').classList.remove('d-none');
      }
    }

    //clears user input
    document.getElementById('user-name').value = '';
  }

  //sets the names of each player
  document.getElementById('submit-name').onclick = function(e) { 
    e.preventDefault(); 
    setName(); 
  }

  //will create a click event for each choice
  // for (i = 0; i < choices.length; i++) {
  //   choices[i].onclick = function() { console.log(this.textContent) }
  // }

  //listens for new children on the 'players' node
  database.ref('players').on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val())

    //sets player 1 name
    if (childSnapshot.val().user === 1) {

      //updates variables for persistance
      numberOfUsers = childSnapshot.val().user;

      //updates page with user1 name
      document.getElementById('p1').innerText = childSnapshot.val().name;
    }

    //sets player 2 name
    if (childSnapshot.val().user === 2) {

      //updates variables for persistance
      numberOfUsers = childSnapshot.val().user;

      //updates page with user1 name
      document.getElementById('p2').innerText = childSnapshot.val().name;
    }

    }, function(error) {

  });

  //clears the database on disconnect
  database.ref().set(false)
}