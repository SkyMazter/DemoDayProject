const database = firebase.database().ref();
let username;
let email;
let password;
let user;

function signUp(event){
    username = $("#signupUsername").val();
    password = $("#signupPassword").val();
    email = $("#email").val();
    $("#signupUsername").val("");
    $("#signupPassword").val("");
    $("#email").val("");
    //Update database here
    
    let json;

    if(email != "" && email.includes("@") && email.includes(".com")){
        json = {
            USERNAME: username,
            PASSWORD: password,
            EMAIL: email
        }
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
    }else{
        json = {
            USERNAME: username,
            PASSWORD: password,
            EMAIL: ""
        }
    }
    database.push(json);
}

$("#logIn").click(function(){
    if($("#username").val() !== "" && $("#password").val() !== ""){
        if($("#username").val().includes(".com")){
            email = $("#username").val();
            username = "";
        }else{
            username = $("#username").val();
            email = "";
        }
        password = $("#password").val();

        database.once('value', function(snapshot) {
            let i = 0;
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                if(childData.USERNAME == username && childData.PASSWORD == password){
                    i = 1;
                    user = username;
                    alert("Logged In");
                    window.open("home.html", "_self");
                }else if(childData.EMAIL == email && childData.PASSWORD == password){
                    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // ...
                      });
                      i = 1;
                      alert("Logged In");
                      window.open("home.html", "_self");
                }
            });
            if(i == 0){
                alert("Incorrect username or password");
            }
        });
    }else{
        alert("");
    }
    // function currentUser(){
    // if($("#username").val() === "Oscar"){
    //     user = "Oscar"
    //     return user
    // }
    // else{

    // }
    // return user
    // }
});
// console.log(currentUser());

$("#signUp").click(function(){
    if($("#signupUsername").val() !== "" && $("#signupPassword").val() !== ""){ 
        database.once('value', function(snapshot) {
            let i = 0;
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                if($("#signupUsername").val() == childData.USERNAME){
                    i = 1;
                    alert("Username Taken");
                }
                if($("#email").val().includes(".com") && $("#email").val().includes("@") || $("#email").val() == ""){}else{
                    alert("Invalid Email");
                }
            });
            if(i == 0){
                signUp();
                window.open("index.html", "_self");
            }
        });
    }
});

$("#updateEmail").click(function(){
    if(user !== undefined && $("#newEmail").val().includes(".com") && $("#newEmail").val().includes("@")){
        database.once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                if(user == childData.USERNAME){
                     childData.EMAIL = $("#newEmail").val();
                 }
            });
        });
    }
})

