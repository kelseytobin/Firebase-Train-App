//initialize firebase through var config and initialize command
var config = {
    apiKey: "AIzaSyDLHC5LRdN5p3CWPYXTcgmwJEobOo5_hec",
    authDomain: "train-scheduling-app-d7fe2.firebaseapp.com",
    databaseURL: "https://train-scheduling-app-d7fe2.firebaseio.com",
    projectId: "train-scheduling-app-d7fe2",
    storageBucket: "train-scheduling-app-d7fe2.appspot.com",
    messagingSenderId: "1095971288978"
  };
  
  firebase.initializeApp(config);

//create var to hold firebase
var database = firebase.database();

//create click event for submit button
$("#add-train-btn").on("click", function(event) {
    event.preventDefault(); //keep form from resubmitting entire page

    //retrieve user input from form within click event
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTime = $("#first-train-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();

    //create object to hold train data that will be stored in firebase
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        first: firstTime,
        frequency: trainFrequency
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
    var trainName = childSnapshot.val().name;
    var trainDestination =  childSnapshot.val().destination;
    var firstTime = childSnapshot.val().first;
    var trainFrequency = childSnapshot.val().frequency;

    //log variables to make sure values are being grabbed
    console.log(name);
    console.log(destination);
    console.log(first);
    console.log(frequency);

    // ----------- HOMEWORK CODE STARTS HERE- CALCULATE ARRIVAL AND MINUTES AWAY----------------//
    
    //reformat train start time, create var to hold next arrival
 

    //calcuclate difference in minutes between train start time, last train, and next arriving
    //create var to hold minutes away
    
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
    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var minutesAway = trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    // Next Train
    var nextTrain = moment().add(minutesAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    //create new table row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextTrain),
        $("<td>").text(minutesAway)
      );

    //append new table row to html
    $("#train-table > tbody").append(newRow);

//end firebase event
});

//create firebase event for user being able to delete train row from html table