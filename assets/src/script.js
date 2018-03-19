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

  var totalUsers = 0;
  var turn = 0;

  //there will be a listener to check for updates to each player object in firebase, and will update these variables each time there is a change for easy access
  var p1Obj;
  var p2Obj;

  //results
  var p1Wins = 0;
  var p1Losses = 0;
  var p2Wins = 0;
  var p2Losses = 0;

  //selects elements from the DOM for easy access
  var waitingMsg = document.querySelector('.waiting-for-opponent-h2');
  var p1Circle = document.querySelector('.p1-container');
  var p2Circle = document.querySelector('.p2-container');
  var p1Container = document.querySelector('.player-container-1');
  var p2Container = document.querySelector('.player-container-2');
  var resultsDiv = document.querySelector('.results');
  var choicesDiv = document.querySelector('.choices-container');
  var faIcons = document.getElementsByClassName('fa');
  var displayResultsDiv = document.querySelector('.display-results');
  var sendMsgBtn = document.getElementById('submit-msg');

  //determines results of the round. styles each player circle based on results
  function rps(p1Choice, p2Choice) {
    if ((p1Choice === "rock") && (p2Choice === "scissors")) {
      console.log(p1Wins, p1Losses, p2Wins, p2Losses)
      p1Wins++;
      p2Losses++;
      console.log(p1Wins, p1Losses, p2Wins, p2Losses)
      database.ref('players/p1/wins').set(p1Wins);
      database.ref('players/p2/losses').set(p2Losses);
      p1Container.setAttribute('style', "box-shadow: rgb(62, 201, 167) 0px 0px 25px 10px;");
      p2Container.setAttribute('style', 'box-shadow: rgb(227, 43, 9) 0px 0px 25px 10px;');
      displayResultsDiv.innerText = `${p1Obj.name} Won!`;
    } else if ((p1Choice === "rock") && (p2Choice === "paper")) {
      p1Losses++;
      p2Wins++;
      console.log(p1Wins, p1Losses, p2Wins, p2Losses)
      database.ref('players/p1/losses').set(p1Losses);
      database.ref('players/p2/wins').set(p2Wins);
      p1Container.setAttribute('style', "box-shadow: rgb(227, 43, 9) 0px 0px 25px 10px;");
      p2Container.setAttribute('style', 'box-shadow: rgb(62, 201, 167) 0px 0px 25px 10px;');
      displayResultsDiv.innerText = `${p2Obj.name} Won!`;
    } else if ((p1Choice === "scissors") && (p2Choice === "rock")) {
      p1Losses++;
      p2Wins++;
      console.log(p1Wins, p1Losses, p2Wins, p2Losses)
      database.ref('players/p1/losses').set(p1Losses);
      database.ref('players/p2/wins').set(p2Wins);
      p1Container.setAttribute('style', "box-shadow: rgb(227, 43, 9) 0px 0px 25px 10px;");
      p2Container.setAttribute('style', 'box-shadow: rgb(62, 201, 167) 0px 0px 25px 10px;');
      displayResultsDiv.innerText = `${p2Obj.name} Won!`;
    } else if ((p1Choice === "scissors") && (p2Choice === "paper")) {
      p1Wins++;
      p2Losses++;
      console.log(p1Wins, p1Losses, p2Wins, p2Losses)
      database.ref('players/p1/wins').set(p1Wins);
      database.ref('players/p2/losses').set(p2Losses);
      p1Container.setAttribute('style', "box-shadow: rgb(62, 201, 167) 0px 0px 25px 10px;");
      p2Container.setAttribute('style', 'box-shadow: rgb(227, 43, 9) 0px 0px 25px 10px;');
      displayResultsDiv.innerText = `${p1Obj.name} Won!`;
    } else if ((p1Choice === "paper") && (p2Choice === "rock")) {
      p1Wins++;
      p2Losses++;
      console.log(p1Wins, p1Losses, p2Wins, p2Losses)
      database.ref('players/p1/wins').set(p1Wins);
      database.ref('players/p2/losses').set(p2Losses);
      p1Container.setAttribute('style', "box-shadow: rgb(62, 201, 167) 0px 0px 25px 10px;");
      p2Container.setAttribute('style', 'box-shadow: rgb(227, 43, 9) 0px 0px 25px 10px;');
      displayResultsDiv.innerText = `${p1Obj.name} Won!`;
    } else if ((p1Choice === "paper") && (p2Choice === "scissors")) {
      p1Losses++;
      p2Wins++;
      console.log(p1Wins, p1Losses, p2Wins, p2Losses)
      database.ref('players/p1/losses').set(p1Losses);
      database.ref('players/p2/wins').set(p2Wins);
      p1Container.setAttribute('style', "box-shadow: rgb(227, 43, 9) 0px 0px 25px 10px;");
      p2Container.setAttribute('style', 'box-shadow: rgb(62, 201, 167) 0px 0px 25px 10px;');
      displayResultsDiv.innerText = `${p2Obj.name} Won!`;
    } else if (p1Choice === p2Choice) {
      p1Container.setAttribute('style', "box-shadow: rgb(242, 232, 196) 0px 0px 25px 10px;");
      p2Container.setAttribute('style', 'box-shadow: rgb(242, 232, 196) 0px 0px 25px 10px;');
      displayResultsDiv.innerText = `Tie Game`;
    }

    //updates screen with wins/loss
    document.getElementById('p1-wins').textContent = p1Obj.wins;
    document.getElementById('p1-loss').textContent = p1Obj.losses;
    document.getElementById('p2-wins').textContent = p2Obj.wins;
    document.getElementById('p2-loss').textContent = p2Obj.losses;
  }

  //sets user name, removes form on click
  document.getElementById('submit-name').onclick = function(e) {
    e.preventDefault();

    //gets the value of the user name
    var name = document.getElementById('user-name').value.trim();

    //only allows 2 users to be set, and must be an actual value
    if (totalUsers < 2 && name) {

      //if a valid name is selected, then a message can be sent. Removes default msg
      document.getElementById('send-msg').disabled = false;
      document.getElementById('send-msg').value = '';

      //stores the name in session storage to help with unique DOM changes based on the stage of the game for the user
      sessionStorage.name = name;

      //determines where to set user data
      totalUsers++;

      //sets total users to the db to sync between sessions
      database.ref().update({ users: totalUsers });

      //sets p1 data
      if (totalUsers === 1) {
        //reveals waiting msg
        waitingMsg.classList.remove('d-none');

        //adds user data to db
        database.ref('players/p1').set({
          name: name,
          user: totalUsers,
          wins: 0,
          losses: 0
        });
        
      } else {
        //reveals waiting msg and sets p2 data
        waitingMsg.classList.remove('d-none');
        waitingMsg.innerText = `Waiting for ${p1Obj.name}`;
        database.ref('players/p2').set({
          name: name,
          user: totalUsers,
          wins: 0,
          losses: 0
        });
      }

      //allows the send message button to be pressed once the name is set, since a name is needed to send a message
      // sendMsgBtn.disabled = false;

      //hides and removes value from form
      document.getElementById('user-name').value = '';
      document.querySelector('.form-container').classList.add('d-none');
    } 
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
    if (snapshot.val() === 1) {

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

  //function for click event when selecting a choice
  var setChoice = function(elem) {
    
    //clones the item we clicked to append to the user circle
    var choice = elem.cloneNode(true);

    //if the turn is 1
    if (turn === 1) {

      //update the p1 choice in the db
      database.ref('players/p1').update({ choice: choice.getAttribute('data-choice') });

      //reveal waiting msg
      waitingMsg.classList.remove('d-none');
      waitingMsg.innerText = `Waiting for ${p2Obj.name}`;

      //update the turn to 2 in the db
      database.ref('turn').set(2);

      //hide the choices from p1
      choicesDiv.classList.add('d-none');

      //if the turn is 2
    } else {

      //update p2 choice in the db
      database.ref('players/p2').update({ choice: choice.getAttribute('data-choice') });

      //update the turn to 0 in the db, signaling that the round is over
      database.ref('turn').set(0);

      //hide the choices from p2
      choicesDiv.classList.add('d-none');
    }
  }

  //listens for an update to choice on the p1 and p2 node
  database.ref('players').orderByChild('choice').on('child_changed', function(snapshot) {

    //when the choice is updated for either player, get the choice from the db, and select the choice by its data-choice attribute
    var elem = document.querySelector(`[data-choice='${snapshot.val().choice}']`);

    //only runs if the choice key exists. This is needed since choice gets reset at the end of the game
    if (snapshot.val().choice) {

      //clone the selected DOM element
      var elemClone = elem.cloneNode(true);

      //adjust the style to be centered when appended to the player circle
      elemClone.style.margin = "0";

      //appends the fa-icon to the p1 circle for both users
      if (turn === 1) {
        document.querySelector('.player-container-1').appendChild(elemClone);

        //appends the fa-icon to the p2 circle for both users
      } else if (turn === 2) {
        document.querySelector('.player-container-2').appendChild(elemClone);

        //hides waiting msg for both users
        waitingMsg.classList.add('d-none');

        //reveals opponent and winner
        p1Circle.classList.remove('d-none', 'col-md-12');
        p2Circle.classList.remove('d-none', 'col-md-12');
        resultsDiv.classList.remove('d-none', 'col-md-12');

        //adjusts column display
        p1Circle.classList.add('col-md-4');
        p2Circle.classList.add('col-md-4');
        resultsDiv.classList.add('col-md-4');
      }
    }
  });

  //if the turn is 0, then the round is over and results are displayed
  database.ref('turn').on('value', function(snapshot) {
    if (snapshot.val() === 0) {
      rps(p1Obj.choice, p2Obj.choice);

      //next round begins automatically after 3 seconds.
      setTimeout(() => {

        //sets the round to 1
        database.ref('turn').set(1);

        //removes previous choices for each player
        database.ref('players/p1/choice').set(null);
        database.ref('players/p2/choice').set(null);

        // finds the fa-icon from the last round in each player circle. removes it from the circle
        document.querySelector('.player-container-1').removeChild(p1Circle.querySelector('.fa'));
        document.querySelector('.player-container-2').removeChild(p2Circle.querySelector('.fa'));

        // hides choices and results
        choicesDiv.classList.add('d-none');
        resultsDiv.classList.add('d-none');

        //adjusts column display
        p1Circle.classList.remove('col-md-4');
        p2Circle.classList.remove('col-md-4');
        resultsDiv.classList.remove('col-md-4');

        //switches column layout
        p1Circle.classList.add('col-md-12');
        p2Circle.classList.add('col-md-12');
        resultsDiv.classList.add('col-md-12');

        //removes border
        p1Container.removeAttribute('style');
        p2Container.removeAttribute('style');

        //removes p2 circle from p1 screen. reveals choices for p1
        if (sessionStorage.name === p1Obj.name) {
          p2Circle.classList.add('d-none');
          choicesDiv.classList.remove('d-none');
          
          //removes p1 circle for p2 screen. shows waiting msg
        } else {
          p1Circle.classList.add('d-none');
          waitingMsg.classList.remove('d-none')
        }
      }, 3000);
    }
  });


  /********************************CHAT AREA****************************************************/

  database.ref('chat').on('child_added', function(snapshot) {
    var response = snapshot.val();
    var nameElem = document.createElement('span');
    var msgElem = document.createElement('span');
    var newDiv = document.createElement('div');

    //styles the name and msg, then adds the content
    nameElem.classList.add('d-block', 'text-muted');
    msgElem.classList.add('d-block');
    nameElem.textContent = response.name;
    msgElem.textContent = response.msg;
    
    //appends name and msg to newDiv, which gets appended to the chat display
    newDiv.appendChild(nameElem);
    newDiv.appendChild(msgElem);
    newDiv.classList.add('p-2');
    document.querySelector('.chat-msgs').appendChild(newDiv);
  });

  //sends the message to the database. Created the textarea element as an input button to submit the message, and get the name when enter is pressed.
  document.getElementById('send-msg').onkeyup = function(e) {
    if (e.keyCode === 13 && sessionStorage.name) {
      var msg = this.value;
      var name = sessionStorage.name;
      database.ref('chat').push({ name: name, msg: msg })
      this.value = '';
    }
  }

  //Creates a click event for each fa icon 
  for (i = 0; i < faIcons.length; i++) {
    faIcons[i].onclick = function () { setChoice(this) };
  }

  //clears the database on disconnect
  database.ref().set(false);

  // database.ref('players/p1').onDisconnect().remove();
};
