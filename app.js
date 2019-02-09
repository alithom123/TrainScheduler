$(document).ready(function () {
    console.log("Running app.js.");



    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB9N7EmodXmjWRrBy6HcsrZcnMG7MfJ_N8",
        authDomain: "train-scheduler-e7274.firebaseapp.com",
        databaseURL: "https://train-scheduler-e7274.firebaseio.com",
        projectId: "train-scheduler-e7274",
        storageBucket: "",
        messagingSenderId: "868268336908"
    };
    firebase.initializeApp(config);

    var db = firebase.database();

    var train = {
        name: "TEST Train",
        destination: "TEST Destination",
        frequency: 30,
        startTime: "8:00AM"
    }

    $("button").on("click", function (e) {
        e.preventDefault();
        console.log("submitting");
        train = {};
        train.name = $("#trainName").val();
        train.destination = $("#trainDestination").val();
        train.frequency = $("#trainFrequency").val();
        train.startTime = $("#trainStartTime").val();

        pushTrainToFirebase(db, train);
    });

    getTrains(db);


});

function pushTrainToFirebase(db, train) {

    // var key = db.ref('trains/').push({
    //     name: trainname,
    //     destination: ,
    // }).key;

    var key = db.ref('trains/').push(train);
    return key;
}

function getTrains(db) {

    var key;
    var ref = db.ref('trains/');

    // ref.orderByChild("isPlaying").equalTo(0).on("child_added", function (snapshot)
    ref.on("child_added", function (snapshot) {
        console.log("Snapshot key: " + snapshot.key);
        console.log(snapshot.val());
        let trainInfo = snapshot.val();
        key = snapshot.key;

        // Add train to table.
        let nextArrivalData = determineNextArrival(trainInfo);
        let nextArrivalText = nextArrivalData.nextArrival;
        let minutesUntilArrivalText = nextArrivalData.minutesUntilArrival;
        // nextArrival: nextArrivalTime,
        // minutesUntilArrival: mnextTrain
        // let minutesAway = determineMinutesAway(trainInfo);


        $("#trainTable").find('tbody')
            .append($('<tr>')
                .append($('<td>').text(trainInfo.name))
                .append($('<td>').text(trainInfo.destination))
                .append($('<td>').text(trainInfo.startTime))
                .append($('<td>').text(trainInfo.frequency))
                .append($('<td>').text(nextArrivalText))
                .append($('<td>').text(minutesUntilArrivalText))
            );


        // destination: "asdf"
        // frequency: "asdf"
        // name: "asdf"
        // startTime: "asdf"


    });
}


function determineNextArrival(train) {

    // Assume the following situations.
    // (TEST 1)
    // First Train of the Day is 3:00 AM
    // Assume Train comes every 3 minutes.
    // Assume the current time is 3:16 AM....
    // What time would the next train be...? (Use your brain first)
    // It would be 3:18 -- 2 minutes away
    // (TEST 2)
    // First Train of the Day is 3:00 AM
    // Assume Train comes every 7 minutes.
    // Assume the current time is 3:16 AM....
    // What time would the next train be...? (Use your brain first)
    // It would be 3:21 -- 5 minutes away
    // ==========================================================
    // Solved Mathematically
    // Test case 1:
    // 16 - 00 = 16
    // 16 % 3 = 1 (Modulus is the remainder)
    // 3 - 1 = 2 minutes away
    // 2 + 3:16 = 3:18
    // Solved Mathematically
    // Test case 2:
    // 16 - 00 = 16
    // 16 % 7 = 2 (Modulus is the remainder)
    // 7 - 2 = 5 minutes away
    // 5 + 3:16 = 3:21



    /* MY CODE */
    let mtFrequency = train.frequency;
    let mfirstTime = train.startTime;
    // let mfirstTime = "03:30";
    let mfirstTimeConverted = moment(mfirstTime, "HH:mm").subtract(1, "years");
    console.log("mfirstTimeConverted = ");
    console.log(mfirstTimeConverted);
    let mcurrentTime = moment();
    console.log("CURRENT TIME: " + moment(mcurrentTime).format("hh:mm"));
    // Difference between the times
    var mdiffTime = moment().diff(moment(mfirstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + mdiffTime);
    // Time apart (remainder)
    var mtRemainder = mdiffTime % mtFrequency;
    console.log(mtRemainder);
    // Minute Until Train
    var mtMinutesTillTrain = mtFrequency - mtRemainder;
    console.log("MINUTES TILL TRAIN: " + mtMinutesTillTrain);
    // Next Train
    var mnextTrain = moment().add(mtMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(mnextTrain).format("hh:mm"));
    let nextArrivalTime = moment(mnextTrain).format("hh:mm");
    return {
        nextArrival: nextArrivalTime,
        minutesUntilArrival: mnextTrain
    };


    /*
        // Assumptions
        var tFrequency = 3;
        // Time is 3:30 AM
        var firstTime = "03:30";
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
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);
        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    */
}