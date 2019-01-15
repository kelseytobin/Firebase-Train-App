// Initialize Firebase
var config = {
    apiKey: "AIzaSyB-rKqiTcCUdBOmP8F3pQPyur_KN7pZ_XE",
    authDomain: "train-app-c8ef2.firebaseapp.com",
    databaseURL: "https://train-app-c8ef2.firebaseio.com",
    projectId: "train-app-c8ef2",
    storageBucket: "",
    messagingSenderId: "8830646799"
  };
  firebase.initializeApp(config);

  //create var to hold firebase
var database = firebase.database();

var trainName = "";
var trainDestination = "";
var firstTime = "";
var trainFrequency = "";

//create click event for submit button
$("#add-train-btn").on("click", function(event) {
    event.preventDefault(); //keep form from resubmitting entire page

    //retrieve user input from form within click event
    tName = $("#train-name-input").val().trim();
    tDestination = $("#destination-input").val().trim();
    tTime = moment($("#first-train-input").val().trim(),  "HH:mm").format("X");
    tFreq = $("#frequency-input").val().trim();

    //create object to hold train data that will be stored in firebase
    var newTrain = {
        name: tName,
        destination: tDestination,
        first: tTime,
        frequency: tFreq
    };

    //upload train data to firebase
    database.ref().push(newTrain);

    //console log to make sure this is working
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.first);
    console.log(newTrain.frequency);

    //clear text boxes in form
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");

//end click event
});

//create firebase event for addding new train to database and to html table via new row
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    

    //store all input values into variable
    var newName = childSnapshot.val().name;
    var newDestination =  childSnapshot.val().destination;
    var newTime = childSnapshot.val().tTime;
    var newFreq = childSnapshot.val().frequency;

    //log variables to make sure values are being grabbed
    console.log(newName);
    console.log(newDestination);
    console.log(newTime);
    console.log(newFreq);

    // ----------- HOMEWORK CODE STARTS HERE- CALCULATE ARRIVAL AND MINUTES AWAY----------------//
    
    //reformat train start time, create var to hold next arrival
    var tReformat = moment.unix(newTime).format("HH:mm");

     // Frequency
     var frequency = newFreq;

     // New Time
     var firstTime = newTime;
    
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var minutesAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    // Next Train
    var nextTrain = moment().add(minutesAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    //create new table row
    var newRow = $("<tr>").append(
        $("<td>").text(newName),
        $("<td>").text(newDestination),
        $("<td>").text(newFreq),
        $("<td>").text(nextTrain),
        $("<td>").text(minutesAway)
      );

    //append new table row to html
    $("#train-table > tbody").append(newRow);

    // Run error function if it doesnt work

//end firebase event
});

//create firebase event for user being able to delete train row from html table