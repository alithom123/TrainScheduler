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
        train.frequency = $("#trainName").val();
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
        console.log(snapshot);
        key = snapshot.key;

        // Add train to table.
        // $("#trainTable").find('tbody')
        //     .append($('<tr>')
        //         .append($('<td>')
        //             .append($('<img>')
        //                 .attr('src', 'img.png')
        //                 .text('Image cell')
        //             )
        //         )
        //     );

        $("#trainTable").find('tbody')
            .append($('<tr>')
                .append($('<td>').text("fromCode"))
                .append($('<td>').text("fromCode"))
                .append($('<td>').text("fromCode"))
                .append($('<td>').text("fromCode"))
                .append($('<td>').text("fromCode"))
            );


    });
}