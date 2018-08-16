const database = firebase.database().ref();
const users = firebase.database().ref("users");
const messages = firebase.database().ref("messages");
let username;
let email;
let password;
let i;

function signUp(type){
    username = $(`#${type}SignupUsername`).val();
    password = $(`#${type}SignupPassword`).val();
    email = $(`#${type}SignupEmail`).val();
    $(`#${type}SignupUsername`).val("");
    $(`#${type}SignupPassword`).val("");
    $(`#${type}SignupEmail`).val("");

    i=0;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(){
            var user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: username,
                type: type
            })
            let json;
            const id = user.uid;                  
            if(type == "teacher"){
                json = {
                    EMAIL: email,
                    USERNAME: username,
                    UID: user.uid,
                    TYPE: "Teacher"
                }
            }else if(type == "student"){
                json = {
                    EMAIL: email,
                    USERNAME: username,
                    UID: user.uid,
                    TYPE: "Student"
                }
            }
            
            users.push(json);
            firebase.auth().signOut().then(function(){
                window.open("index.html", "_self")
            })
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            i=1;
            return error;
        });
}

$("#logIn").click(function(){
    if($("#username").val() !== "" && $("#password").val() !== ""){
        if($("#username").val().includes(".com")){
            email = $("#username").val();
            username = "";
        }else{
            username = $("#username").val();
            users.once('value', function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    var childData = childSnapshot.val();
                    if(username == childData.USERNAME){
                        email = childData.EMAIL;
                        console.log(email);

                        // filtering users
                        return username
                        console.log(username)
                    }
                });
            });
        }
        password = $("#password").val();
        
        i = 0;
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
            var user = firebase.auth().currentUser;
            var userID = user.uid;

            if(i == 0){
                alert("Logged In");
                //here, we need to load the data for the appropriate user
                window.open("home.html", "_self");
               
                // $("#")
            }
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            i = 1;
            alert(errorMessage);            
          });
    }
});

function signUpButton(type){
    if($(`#${type}SignupUsername`).val() !== "" && $(`#${type}SignupPassword`).val() !== "" && $(`#${type}SignupEmail`) !== ""){
        if($(`#${type}SignupEmail`) == ""){
            alert("Email Required");
        }
        users.once('value', function(snapshot) {
            i = 0;
            snapshot.forEach(function(childSnapshot) {
                //loops through database
                var childData = childSnapshot.val();
                if($(`#${type}SignupUsername`).val() == childData.USERNAME){
                    i = 1;
                    alert("Username Taken");
                }
                console.log(type);
                if($(`#${type}SignupEmail`).val().includes(".com") && $(`#${type}SignupEmail`).val().includes("@") || $(`#${type}SignupEmail`).val() == ""){}else{
                    i = 1;
                    alert("Invalid Email");
                }
            });
            if(i == 0){
                signUp(type);
            }
        });
    }
}
$("#studentSignUp").click(function(){
    signUpButton("student");
});
$("#teacherSignUp").click(function(){
    signUpButton("teacher");
});

$(window).load("home.html",function(){
    users.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var childData = childSnapshot.val();
            if(childData.EMAIL == firebase.auth().currentUser.email){
                let type = childData.TYPE;
                if(type == "Student"){
                    //pastes name
                    let word = childData.USERNAME; 
                    $("#welcome").append("<p> Welcome " + word + "!</p>");
                    // pastes schedule for specific user
                    
                    for(let x = 0; x <  8; x++){
                        
                        $("#Board").append(
                        "<div class = 'class'>" + 
                        
                        "<p>Mr.Teacher</p>" +

                        "<p>Subject</p>"+

                        "<p>Period #</p>"+
                        
                        "<p>Grade Average</p>"+

                        "<p>Room #</p>"

                        + "</div>");
                        
                    }
                }else if(type == "Teacher"){
                    //pastes name
                    let word = childData.USERNAME; 
                    $("#welcome").append("<p> Welcome " + word + "!</p>");
                    $("#title").html("Class List");

                    for( let x = 0; x <  8; x++){
                       $("#Board").append(
                            "<div class = 'class'>" + 
                            
                            "<p>Student's name</p>" +
    
                            "<p>Grade (9th,10th,11th ECT)</p>"+
    
                            "<p>Period #</p>"+
                            
                            "<p>Grade Average</p>"+
    
                            "<p>Student ID</p>"
    
                            + "</div>");
                    }

                }
            }
        });
    });
})

$("#logOut").click(function(){
    firebase.auth().signOut();
    window.open("index.html", "_self");
});


$("#settings").click(function(){
    let firstname = $("#firstname").val();
    let lastname = $("#lastname").val();
    let grade = $("#grade").val();
    let classes = $("#class").val();
    let json = {
        "Firstname": firstname,
        "Lastname": lastname,
        "Grade": grade,
        "Class": classes
    }
    users.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var childData = childSnapshot.val();
            if(childData.EMAIL == firebase.auth().currentUser.email){
                childSnapshot.push(json);
            }
        });
    });
});

$("#updateEmail").click(function(){
    if($("#newEmail").val() !== "" && $("#pass").val() !== ""){
        var email = firebase.auth().currentUser.email;
        firebase.auth().signInWithEmailAndPassword(email, $("#pass").val()).then(function(){
            firebase.auth().currentUser.updateEmail($("#newEmail").val());
        }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/wrong-password') {
                    alert('Wrong Password.');
                }
            });
    }
});
$("#updatePassword").click(function(){
    if($("#passw").val() !== "" && $("#newPassword").val() !== ""){
        var email = firebase.auth().currentUser.email;
        firebase.auth().signInWithEmailAndPassword(email, $("#passw").val()).then(function(){
            user.updatePassword($("#newPassword").val()).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    alert(errorMessage);
                }
        }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/wrong-password') {
                    alert('Wrong Password.');
                }
            });
        })
    }
});