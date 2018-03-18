window.onload = function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA16uL7SDVX7lUfOSXPNV66dxw3oYrDzRs",
    authDomain: "rps-1-e782d.firebaseapp.com",
    databaseURL: "https://rps-1-e782d.firebaseio.com",
    projectId: "rps-1-e782d",
    storageBucket: "rps-1-e782d.appspot.com",
    messagingSenderId: "962051868401"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  // Clear sessionStorage
  sessionStorage.clear();

  //used to determine where to set each user data
  var totalUsers = 0;

  //tracks turns
  var turn = 0;

  var roundIsOver = false;

  var p1Obj;
  var p2Obj;

  //selects elements from the DOM for easy access
  var waitingMsg = document.querySelector('.waiting-for-opponent-h2');
  var p1Circle = document.querySelector('.p1-container');
  var p2Circle = document.querySelector('.p2-container');
  var resultsDiv = document.querySelector('.results');
  var choicesDiv = document.querySelector('.choices-container');
  var faIcons = document.getElementsByClassName('fa');

  //sets user name, removes form on click
  document.getElementById('submit-name').onclick = function(e) {
    e.preventDefault();

    //only allows 2 users to be set
    if (totalUsers < 2) {

      //gets the value of the user name
      var name = document.getElementById('user-name').value.trim();

      //stores the name in session storage to help with unique DOM changes based on the stage of the game for the user
      sessionStorage.name = name;

      //determines where to set user data
      totalUsers++;

      //sets total users to the db to sync between sessions
      database.ref().update({users: totalUsers});

      //sets the status of the current round
      database.ref().update({roundIsOver: false})

      //sets p1 data
      if (totalUsers === 1) {
        //reveals waiting msg
        waitingMsg.classList.remove('d-none');

        //adds user data to db
        database.ref('players/p1').set({
          name: name,
          user: totalUsers
        });
      } else {
        //reveals waiting msg
        waitingMsg.classList.remove('d-none');

        //sets p2 data
        database.ref('players/p2').set({
          name: name,
          user: totalUsers
        });
      }
    }

    //hides and removes value from form
    document.getElementById('user-name').value = '';
    document.querySelector('.form-container').classList.add('d-none');
  };

  //listens for when a new child to players is created
  database.ref('players').on('child_added', function(snapshot) {

    //sets the total users for persistence. This is needed to update p2 node. Without this, when p2 tries to enter data, it would overwrite p1 data
    totalUsers = snapshot.val().user;

    //stores the p1 and p2 node locally for each session for easy reference
    if (snapshot.val().user === 1) {
      p1Obj = snapshot.val();

      //sets the name of p1
      document.getElementById('p1').innerText = snapshot.val().name;

      //reveals p1 by determining the p1 from sessionStorage
      if (sessionStorage.name === p1Obj.name) {
        p1Circle.classList.remove('d-none')
      }
    } else {
      p2Obj = snapshot.val();

      //sets the name of p2
      document.getElementById('p2').innerText = snapshot.val().name;

      //reveals p2 by determining the p2 from sessionStorage
      if (sessionStorage.name === p2Obj.name) {
        p2Circle.classList.remove('d-none')
      }

      //p1 and p2 have already been set, which means it is now p1's turn
      database.ref().update({ turn: 1 });
    }
  });

  //listens for updates to the p1 and p2 nodes to sync the data for persistence in each session
  database.ref('players').on('child_changed', function(snapshot) {

    //stores updates to the p1 and p2 node locally for each session for easy reference
    if (snapshot.val().user === 1) {
      p1Obj = snapshot.val();
    } else {
      p2Obj = snapshot.val();
    }
  });

  //listens for an update to the current turn
  database.ref('turn').on('value', function(snapshot) {

    //if the turn is 1
    if (snapshot.val() === 1 /*&& !roundIsOver*/) {
      //and the p1 name is the same as sessionStorage.name
      if (sessionStorage.name === p1Obj.name) {
        //then we adjust the screen for p1 to hide waiting msg
        waitingMsg.classList.add('d-none');
        //display the p1 circle
        p1Circle.classList.remove('d-none');
        //and display the choices
        choicesDiv.classList.remove('d-none');
      }
    } 
    //if the turn is 2
    if (snapshot.val() === 2) {
      //and the p2 name is the same as sessionStorage.name
      if (sessionStorage.name === p2Obj.name) {
        //then we adjust the screen for p2 to hide waiting msg
        waitingMsg.classList.add('d-none');
        //display the p2 circle
        p2Circle.classList.remove('d-none');
        //and display the choices
        choicesDiv.classList.remove('d-none');
      }
    }

    //stores the turn for persistence so we don't have to reference the db for the value again
    turn = snapshot.val();
  });

  //var elem = document.querySelector(`[data-choice='${userChoice}']`);

  var setChoice = function(elem) {
    
    //clones the item we clicked to append to the user circle
    var choice = elem.cloneNode(true);

    //if the turn is 1
    if (turn === 1) {
      //update the p1 choice in the db
      database.ref('players/p1').update({ choice: choice.getAttribute('data-choice') });
      //reveal waiting msg
      waitingMsg.classList.remove('d-none');
      //update the turn to 2 in the db
      database.ref('turn').set(2);
      //hide the choices from p1
      choicesDiv.classList.add('d-none');

      //if the turn is 2
    } else {
      //update p2 choice in the db
      database.ref('players/p2').update({ choice: choice.getAttribute('data-choice') });
      //hide the choices from p2
      choicesDiv.classList.add('d-none');
    }
  }

  //listens for an update to choice on the p1 and p2 node
  database.ref('players').orderByChild('choice').on('child_changed', function(snapshot) {
    //when the choice is updated for either player, get the value and select the choice by its data-choice attribute
    var elem = document.querySelector(`[data-choice='${snapshot.val().choice}']`);
    //clone the selected DOM element
    var elemClone = elem.cloneNode(true);
    //adjust the style to be centered when appended to the player circle
    elemClone.style.margin = "0";

    if (turn === 1) {
      //appends to the p1 circle for both users
      document.querySelector('.player-container-1').appendChild(elemClone);
    } else {
      //appends to the p2 circle for both users
      document.querySelector('.player-container-2').appendChild(elemClone);
    }
  });

  //Creates a click event for each fa icon 
  for (i = 0; i < faIcons.length; i++) {
    faIcons[i].onclick = function () { setChoice(this) };
  }

  //clears the database on disconnect
  database.ref().set(false);
};
