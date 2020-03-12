(function(){
    let loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function(e){
        e.preventDefault();
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/Users/login", true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function(event) { // Call a function when the state changes.
            event.preventDefault();
			if(xhr.readyState === xhr.DONE && xhr.status === 200){

                // Request finished. Do processing here.
                console.log(xhr.response);
                //console.log(xhr.responseText);
                var obj = JSON.parse(xhr.response);//convert the json sent by the api
                localStorage.setItem("access_token", JSON.stringify({access_token : obj.id}));// save the access_token in localstorage
                //setTimeout(function(){location.href = "movies.html";}, 0);
                window.location.href = "movies.html";

				// else if (xhr.status === 304){
				// 	var obj = JSON.parse(xhr.response);//convert the json sent by the api
				// 	localStorage.setItem("access_token", JSON.stringify({access_token : obj.id}));// save the access_token in localstorage
				// 	setTimeout(function(){location.href = "movies.html";}, 0);
            }
        }
        //let formData = new FormData(loginForm);
        const payload = `username=${username.value}&password=${password.value}`;
        xhr.send(payload);
    });
})();