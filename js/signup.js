(function(){

    let signupForm = document.getElementById("sign-up-form");
    let username = document.getElementById("username");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let reenterPassword = document.getElementById("reenter-password");
    let successDialog = document.getElementById("signup-success-dialog");
    let checkBtn = document.getElementById("check-btn");

    checkBtn.addEventListener("click", function(event){
        event.preventDefault();
        location.href = "login.html";
    });

    

    signupForm.addEventListener("submit", function(event){

        event.preventDefault();
        /*check if the password not matching*/
        if( `${password.value}` !== `${reenterPassword.value}`){
            return alert("Password not match!");
        }

        console.log("Signup button was clicked");
        function createXHR(){
            try { return new XMLHttpRequest(); } catch(e) {}
            try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e) {}
            try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e) {}
            try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {}
            try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {}
            
            alert("XMLHttpxhr not supported");   
            return null;
        }

        var xhr = new createXHR();
        xhr.open("POST", "https://movie-website-rest-api.herokuapp.com/Users", true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                // Request finished. Do processing here.
                console.log(xhr.response);
                console.log(xhr.responseText);
                var obj = JSON.parse(xhr.response);//convert the json sent by the api
                //sign-up successfull
                // alert("Signup Successfull Redicting to Login Page");
                if (typeof successDialog.showModal === "function") {
                    successDialog.showModal();
                } else {
                    alert("The <dialog> API is not supported by this browser");
                }
                //location.href = "login.html";
            }
        }
        //let formData = new FormData(myForm);
        const payload = `username=${username.value}&email=${email.value}&password=${password.value}`;
        console.log(payload);
        xhr.send(payload);
    });

})();