(function(){

    const signupForm = document.getElementById("sign-up-form");
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const reenterPassword = document.getElementById("reenter-password");
    const successDialog = document.getElementById("signup-success-dialog");
    //polyfill the dialog
    dialogPolyfill.registerDialog(successDialog);
    const checkBtn = document.getElementById("check-btn");
    
    //for password validation message
    const letter = document.getElementById("letter");
    const capital = document.getElementById("capital");
    const number = document.getElementById("number");
    const length = document.getElementById("length");

    // const validatePassword = () => {
    //     if(password.value != reenterPassword.value) {
    //         reenterPassword.setCustomValidity("Passwords Don't Match");
    //     } else {
    //         reenterPassword.setCustomValidity('');
    //     }
    // }
    // reenterPassword.onchange = validatePassword;

    checkBtn.addEventListener("click", function(event){
        event.preventDefault();
        location.href = "login.html";
    });

    const checkMatchingPassword = () => {
        if (password.value != reenterPassword.value) {
            reenterPassword.setCustomValidity('Passwords must match.');
            reenterPassword.focus();
        } else {
            reenterPassword.setCustomValidity('');
        }        
    };

    const checkEmailValidity = () => {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        const isValid = pattern.test(email.value);
        if(isValid){
            email.setCustomValidity('');
            email.focus();
        }else{
            email.setCustomValidity('Invalid Email!');
        }
    }

    // When the user clicks on the password field, show the message box
    const showPasswordMessageBox = () =>{
        document.getElementById("message").style.display = "block";
    }

    // When the user clicks outside of the password field, hide the message box
    const disablePasswordMessageBox = () =>  {
        document.getElementById("message").style.display = "none";
    }
    
    const checkPasswordValidity = () => {
        // At least one lowercase letters
        const lowerCaseLetters = /[a-z]/g;
        if(password.value.match(lowerCaseLetters)) {
          letter.classList.remove("invalid");
          letter.classList.add("valid");
        } else {
          letter.classList.remove("valid");
          letter.classList.add("invalid");
        }
      
        // At least one capital letters
        const upperCaseLetters = /[A-Z]/g;
        if(password.value.match(upperCaseLetters)) {
          capital.classList.remove("invalid");
          capital.classList.add("valid");
        } else {
          capital.classList.remove("valid");
          capital.classList.add("invalid");
        }
      
        // At least one numbers
        const numbers = /[0-9]/g;
        if(password.value.match(numbers)) {
          number.classList.remove("invalid");
          number.classList.add("valid");
        } else {
          number.classList.remove("valid");
          number.classList.add("invalid");
        }
      
        // At least length >= 6
        if(password.value.length >= 6) {
          length.classList.remove("invalid");
          length.classList.add("valid");
        } else {
          length.classList.remove("valid");
          length.classList.add("invalid");
        }

        //meet all the required condition for password
        if(password.value.match(lowerCaseLetters) && password.value.match(upperCaseLetters) &&  password.value.match(numbers) && password.value.length >= 6){
            disablePasswordMessageBox();
        }else{
            showPasswordMessageBox();
        }
    }
    
    password.onkeyup = checkPasswordValidity;
    // password.onfocus = showPasswordMessageBox;
    // password.onblur = disablePasswordMessageBox;
    email.addEventListener('change', checkEmailValidity, false);
    password.addEventListener('change', checkMatchingPassword, false);
    reenterPassword.addEventListener('keyup', checkMatchingPassword, false);
    

    signupForm.addEventListener("submit", function(event){

        event.preventDefault();
        /*check if the password not matching*/
        // if( `${password.value}` !== `${reenterPassword.value}`){
        //     return  reenterPassword.setCustomValidity("Passwords Don't Match");
        // }

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