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

  //sets each player name, and which user they are. either user 1 or 2
  var setName = function() {
    var currentName = document.getElementById('user-name').value.trim();
    //for persistence, this will get added to the db, and will then get set with that info
    numberOfUsers++;

    //sets player 1
    if (numberOfUsers === 1) {

      //stores player 1 in the db by specifying the path. Calls set at that path to define our key/value pairs
      var playersChild1 = database.ref('players/p1')
      playersChild1.set({
        name: currentName,
        user: numberOfUsers,
        opponent: ''
      });

      // adds item to local storage to adjust p1 display
      sessionStorage.setItem('name', currentName);
      if (sessionStorage.length > 0) {
        //reveals waiting for opponent
        document.querySelector('.waiting-for-opponent-h2').classList.remove('d-none');
        //hides form
        document.querySelector('.form-container').classList.add('d-none');
        //reveals p1 circle
        document.querySelector('.p1-container').classList.remove('d-none');
      }
    }

    //sets player 2
    if (numberOfUsers === 2) {

      //gets player 2 input
      // p2Name = currentName

      //stores player 2 in the db by specifying the path. Calls set at that path to define our key/value pairs
      var playersChild2 = database.ref('players/p2')
      playersChild2.set({
        name: currentName,
        user: numberOfUsers,
        opponent: ''
      });

      // sets p2 display after submitting name
      sessionStorage.setItem('name', p2Name);
      if (sessionStorage.length > 0) {
        //reveals waiting for opponent
        document.querySelector('.waiting-for-opponent-h2').classList.remove('d-none');
        //hides form
        document.querySelector('.form-container').classList.add('d-none');
        //reveals p2 circle
        document.querySelector('.p2-container').classList.remove('d-none');
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

    //sets player 1 name
    if (childSnapshot.val().user === 1) {

      //updates variables for persistance
      numberOfUsers = childSnapshot.val().user;

      //pulls name out for persistance
      p1Name = childSnapshot.val().name;

      //updates page with user1 name
      document.getElementById('p1').innerText = childSnapshot.val().name;
    }

    //sets player 2 name
    if (childSnapshot.val().user === 2) {

      //updates variables for persistance
      numberOfUsers = childSnapshot.val().user;

      //updates page with user1 name
      document.getElementById('p2').innerText = childSnapshot.val().name;

      //pulls name out for persistance
      p2Name = childSnapshot.val().name;

      //sets the opponent for each player
      database.ref('players/p1/opponent').set(p2Name);
      database.ref('players/p2/opponent').set(p1Name)
    }

    }, function(error) {

  });

  //clears the database on disconnect
  database.ref().set(false)
}