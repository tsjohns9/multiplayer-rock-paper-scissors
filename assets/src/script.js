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

  //selects h2 that reveals waiting message
  var waitingMsg = document.querySelector('.waiting-for-opponent-h2');

  //selects choices container
  var choicesDiv = document.querySelector('.choices-container')

  //used to create click event for each choice
  var choices = document.getElementsByClassName('fa');

  //selects player circles
  var p1Circle = document.querySelector('.p1-container');
  var p2Circle = document.querySelector('.p2-container');

  //used for the click event to get the user choice
  //elem is going to be the 'this' value of element it is attached to.
  var addChoice = function(elem) {

    //clones the item we clicked to append to the user circle
    var choice = elem.cloneNode(true);

    //removes margin to keep centered in the circle
    choice.style.margin = "0";

    //queries the db
    database.ref('players').once('value')
      .then((snapshot) => {

        //sets p1 choice by checking p1.name with sessionStorage.name
        if (snapshot.child('p1').val().name === sessionStorage.name) {

          //appends the clone we made to the p1 circle
          document.querySelector('.player-container-1').appendChild(choice);

          //gets the value of the choice we picked, either rock, paper, or scissors
          p1Choice = choice.getAttribute('data-choice');

          //sets the choice to the db for p1
          database.ref('players/p1').update({ choice: p1Choice});

          //hides choices for p1.
          choicesDiv.classList.add('d-none');

          //shows waiting message
          waitingMsg.classList.remove('d-none');

          database.ref('turn').set(2);

          //if the first condition wasn't met, then it is player 2's choice
        } else {

          // database.ref('turn').set(1);

          //appends to p2 circle
          document.querySelector('.player-container-2').appendChild(choice);

          //gets the value of the choice we picked, either rock, paper, or scissors
          p2Choice = choice.getAttribute('data-choice');

          //sets the choice to the db for p2
          database.ref('players/p2').update({ choice: p2Choice })

          //hides choices for p2.
          choicesDiv.classList.add('d-none');

          //hides waiting message
          waitingMsg.classList.add('d-none');

          database.ref().child('turn').set(1)

        }
      });
  };

  database.ref('turn').on('value', function(snapshot) {
    
    // reveals both opponents, their choices, and the winner
    if (snapshot.val() === 1) {
      if (sessionStorage.name === p1Name) {
        waitingMsg.classList.add('d-none');
        p2Circle.classList.remove('d-none');
      } else {
        p1Circle.classList.remove('d-none');
      }

    }

    //reveals choices for p2 when it is their turn
    if (snapshot.val() === 2 && sessionStorage.name === p2Name) {
      console.log('hi')
      choicesDiv.classList.remove('d-none');
      
      //hides waiting message
      waitingMsg.classList.add('d-none');

    }

    
  }, function(error) {})

  //will create a click event for each choice using the function declared above
  for (i = 0; i < choices.length; i++) {
    choices[i].onclick = function () { addChoice(this) }
  }

  //sets each player name, and which user they are. either user 1 or 2
  var setName = function() {

    //stores the value of the user name
    var currentName = document.getElementById('user-name').value.trim();

    //for persistence, this will get added to the db, and will then get set with that info
    numberOfUsers++;

    //sets player 1
    if (numberOfUsers === 1) {

      //stores player 1 in the db by specifying the path. Calls set at that path to define our key/value pairs
      var playersChild1 = database.ref('players/p1');
      playersChild1.set({
        name: currentName,
        user: numberOfUsers,
      });

      // adds item to local storage to adjust p1 display
      sessionStorage.setItem('name', currentName);
      if (sessionStorage.length === 1) {
        //reveals waiting for opponent
        waitingMsg.classList.remove('d-none');
        //hides form
        document.querySelector('.form-container').classList.add('d-none');
        //reveals p1 circle
        p1Circle.classList.remove('d-none');
      }
    }

    //sets player 2
    if (numberOfUsers === 2) {
      //stores player 2 in the db by specifying the path. Calls set at that path to define our key/value pairs
      var playersChild2 = database.ref('players/p2')
      playersChild2.set({
        name: currentName,
        user: numberOfUsers,
      });

      // sets p2 display after submitting name
      sessionStorage.setItem('name', p2Name);
      if (sessionStorage.length === 1) {

        //reveals waiting for opponent
        waitingMsg.classList.remove('d-none');

        //hides form
        document.querySelector('.form-container').classList.add('d-none');

        //reveals p2 circle
        p2Circle.classList.remove('d-none');
      }
    }

    //clears user input
    document.getElementById('user-name').value = '';
  }

  //sets the names of each player by calling the function above
  document.getElementById('submit-name').onclick = function(e) { 
    e.preventDefault(); 
    setName(); 
  }

  //listens for new children on the 'players' node to set the player names
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

      //sets the opponent for each player.
      database.ref('players/p1').update({opponent: p2Name});
      database.ref('players/p2').update({opponent: p1Name});

      //removes waiting message for p1
      waitingMsg.classList.add('d-none');

      //creates a new child off root for the current turn. Once p2 enters name, it is now p1 turn
      // database.ref().child('turn').set(1)

      //reveals p1 choices somehow...
      if (sessionStorage.length === 1) {
        choicesDiv.classList.remove('d-none');
      }
    }

    }, function(error) {});

  //clears the database on disconnect
  database.ref().set(false);

}