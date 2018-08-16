const users = firebase.database().ref("users");

$(window).load("dash.html", function(){
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
                            
                        $("#board").append(
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