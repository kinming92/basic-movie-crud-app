(function(){

    /* set up the DOM object */
    let movieListing = document.getElementById("movie-listing");
    
    var addMovieBtn = document.getElementById("add-movie-btn"); 
    let addMovieDialog = document.getElementById("add-movie-dialog");
    let movieDialogCancel = document.getElementById("movie-dialog-cancel-btn");
    let movieDialogSave = document.getElementById("movie-dialog-save-btn");
    var movieForm = document.getElementById("movie-form");
    
    var year;
    var title;
    var rating;
    var genre;
    var userRating;
    var imgUrl;

    let displayList = document.getElementById("display-list");

    /* delete dialog */
    let deleteDialogOkay = document.getElementById("delete-dialog-okay-btn");
    let deleteDialogCancel = document.getElementById("delete-dialog-cancel-btn");
    let deleteDialog = document.getElementById("delete-dialog");

    let displayInfoDialog = document.getElementById("display-info-dialog");
    let displayInfoCancelBtn = document.getElementById("display-info-dialog-cancel-btn");
    
    var movieKey = "";
    var retrievedData;

    /*logout btn*/
    let logoutBtn = document.getElementById("logout-btn");

    /* get the accesstoken once we login into the main page */
    let obj = JSON.parse(localStorage.getItem("access_token"));
    let accessToken = obj.access_token;
    
    
    /* retrieve data from database */
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://movie-website-rest-api.herokuapp.com/movies/movieList?" + `access_token=${accessToken}`, true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == xhr.DONE && xhr.status == 200){
            
            /*prepopulate the data into local storage */
            var responseObj = JSON.parse(xhr.response);
            for (var i = 0; i < responseObj.movies.length; i++ ){
                let item = {
                    title: `${responseObj.movies[i].title}`,
                    year: `${responseObj.movies[i].year}`,
                    genre: `${responseObj.movies[i].genre}`,
                    rating: `${responseObj.movies[i].rating}`,
                    userRating: `${responseObj.movies[i].userRating}`,
                    image: `${responseObj.movies[i].image}`
                }
                
                var text = 
                    `${responseObj.movies[i].title} (${responseObj.movies[i].year})`;
                    // Genre: ${responseObj.movies[i].genre}
                    // Rating: ${responseObj.movies[i].rating}
                    // User Rating: ${responseObj.movies[i].userRating}`;

                createNewMovieListing(`${responseObj.movies[i]._id}`,text, `${responseObj.movies[i].image}`);
                localStorage.setItem(`${responseObj.movies[i]._id}`,JSON.stringify(item));
            }
			
            /* check if localStorage more than 1 at the begining*/
            console.log("why not get here");
			if (localStorage.length >  1){
				movieListing = document.getElementById("movie-listing");    
                document.body.removeChild(movieListing); // when there is at least one movie added, remove the "empty" movieListing
			}
        }
        console.log("run once");
    }
    xhr.send(null);
    

 
    /*function to add a item to display-list */
    function createNewMovieListing( id, text, image_url){
        let li = createTagNTextnode("LI", "li-" + id , text);

        /* create image tag */
        let imageTag = createImgTag("IMG", "img-"+ id, image_url, "" );
        
        /* create span edit elemtn */
        let inputEdit = createTagNTextnode("INPUT", "edit-" + id, " Edit "); //use titleyearrating as the movieKey
        inputEdit.setAttribute("class", "edit" );
        inputEdit.setAttribute("type", "image");
        inputEdit.setAttribute("src", "images/button/edit-regular.svg");
        inputEdit.setAttribute("alt", "edit");
        inputEdit.setAttribute("width", "25");
        inputEdit.setAttribute("height", "25");
        inputEdit.appendChild(document.createTextNode(" Edit "));
         
        /* create delete edit DOM */
        let inputDelete = createTagNTextnode("INPUT",  "delete-"+ id, "Delete ");
        inputDelete.setAttribute("class", "delete");
        inputDelete.setAttribute("type", "image");
        inputDelete.setAttribute("src", "images/button/trash-alt-regular.svg");
        inputDelete.setAttribute("alt", "edit");
        inputDelete.setAttribute("width", "25");
        inputDelete.setAttribute("height", "25");
        inputDelete.appendChild(document.createTextNode("Delete "));


        let inputDivTag = document.createElement("div");
        inputDivTag.setAttribute("class", "li__actions");
        inputDivTag.appendChild(inputEdit);
        inputDivTag.appendChild(inputDelete);

        let imgDivTag = document.createElement("div");
        imgDivTag.setAttribute("class", "li__img");
        imgDivTag.appendChild(imageTag);

        li.insertBefore(imgDivTag, li.firstChild);
        li.appendChild(inputDivTag);
        
        displayList.appendChild(li);

    }

    function createImgTag(newElTag, newTagId, url, text){
        var newDiv = document.createElement(newElTag);
        newDiv.setAttribute("id", newTagId);
        newDiv.setAttribute("src", url);
        newDiv.setAttribute("alt", text);
        // newDiv.setAttribute("heigth", "30");
        // newDiv.setAttribute("width", "30");
        return newDiv;
    }

    /*function: create a new Tag and append a textNode as a child */
    /*return the element tag */
    function createTagNTextnode (newElTag, newTagId, text) { 
        // create a new div element 
        var newDiv = document.createElement(newElTag); 
        // and give it some content 
        var newContent = document.createTextNode(text); 
        // add the text node to the newly created div
        newDiv.appendChild(newContent); 
        newDiv.setAttribute("id",newTagId);
        return newDiv;
    }

    /*Eventlistener for addMovieBtn */
    addMovieBtn.addEventListener("click", function(){
        if (typeof addMovieDialog.showModal === "function") {
          addMovieDialog.showModal();
        } else {
          alert("The dialog API is not supported by this browser");
        }
    });

    /*Eventlistener cancel button in add-movie-dialog*/
    movieDialogCancel.addEventListener("click", function(){
        //reset the movieKey
        movieKey = "";
        addMovieDialog.close();
    });

    /*Eventlistener save button in add-movie-dialog*/
    movieForm.addEventListener("submit", function(event){

        event.preventDefault();
        /*new way to collect data */
        let formData = new FormData(movieForm);

        title = formData.get("title");
        year = formData.get("year");
        rating = formData.get("rating");
        genre = formData.get("genre");
        userRating = formData.get("userRating");
        imgUrl = formData.get("image");

        console.log(title + year + rating + userRating+ imgUrl);
       
        var cleanTitle = DOMPurify.sanitize(title);
        var cleanImgUrl = DOMPurify.sanitize(imgUrl);
        
        if(movieKey === ""){ //add movie button is pressed, then save button
            /* handle case when localstorage == 1(since access_token takes up 1 slot) */
            if(localStorage.length == 1 ){
                movieListing = document.getElementById("movie-listing");    
                document.body.removeChild(movieListing); // when there is at least one movie added, remove the "empty" movieListing
            }

            /* add movie to database through api*/
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://movie-website-rest-api.herokuapp.com/movies?" + `access_token=${accessToken}`, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function(){
                if(xhr.readyState == xhr.DONE && xhr.status == 200){
                    console.log(this.response);
                    var responseObj = JSON.parse(xhr.response);
                    /*store the newly added item in locastorage */
                    let item = {
                        title: cleanTitle,
                        year: year,
                        genre: genre,
                        rating: rating,
                        userRating: userRating,
                        image: cleanImgUrl
                    }
                    localStorage.setItem( responseObj._id, JSON.stringify(item));
                    var text = `${cleanTitle} (${year}) ${genre} - ${rating} - User Rating: ${userRating}`;
                    createNewMovieListing(`${responseObj._id}`, text, `${cleanImgUrl}`);
                    addMovieDialog.close();
                }
            }
            var payload = `title=${cleanTitle}&year=${year}&genre=${genre}&rating=${rating}&userRating=${userRating}&image=${cleanImgUrl}`;
            xhr.send(payload);
            
            
        }else{  //Edit button is pressed, then save button

            var xhr = new XMLHttpRequest();
            xhr.open("PUT", `https://movie-website-rest-api.herokuapp.com/movies/${movieKey}/replace?` + `access_token=${accessToken}`, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function(){
                if(xhr.readyState == xhr.DONE && xhr.status == 200){
                    console.log(this.response);
                    var responseObj = JSON.parse(xhr.response);

                    /* remove the old movieKey on localstorage */
                    localStorage.removeItem(movieKey);

                    /* set up a new item on localstorage*/
                    let item = {
                        title: cleanTitle,
                        year: year,
                        genre: genre,
                        rating: rating,
                        userRating: userRating,
                        image: cleanImgUrl
                    }
                    localStorage.setItem( responseObj._id, JSON.stringify(item));

                     /*create li element*/
                    var text = `${cleanTitle} (${year}) `;
                    //`${genre} - ${rating} - User Rating: ${userRating}`;
                    let childToReplaced = document.getElementById("li-"+movieKey);
                    let li = document.createElement("li");
                    let textNode = document.createTextNode(text);

                    /* create image tag */
                    let imageTag = createImgTag("IMG", "img-"+ responseObj._id, cleanImgUrl, "" );

                    /* create span edit element */
                    //use the movieKey/id = edit-movieKey
                    let inputEdit = createTagNTextnode("INPUT", "edit-" + responseObj._id, " Edit ");
                    inputEdit.setAttribute("class", "edit" );
                    inputEdit.setAttribute("type", "image");
                    inputEdit.setAttribute("src", "images/button/edit-regular.svg");
                    inputEdit.setAttribute("alt", "edit");
                    inputEdit.setAttribute("width", "25");
                    inputEdit.setAttribute("height", "25");
                    inputEdit.appendChild(document.createTextNode(" Edit "));
                    
                    /* create delete edit element */
                    let inputDelete = createTagNTextnode("INPUT", "delete-"+ responseObj._id, "Delete ");
                    inputDelete.setAttribute("class", "delete");
                    inputDelete.setAttribute("type", "image");
                    inputDelete.setAttribute("src", "images/button/trash-alt-regular.svg");
                    inputDelete.setAttribute("alt", "edit");
                    inputDelete.setAttribute("width", "25");
                    inputDelete.setAttribute("height", "25");
                    inputDelete.appendChild(document.createTextNode("Delete "));

                    let inputDivTag = document.createElement("div");
                    inputDivTag.setAttribute("class", "li__actions");
                    inputDivTag.appendChild(inputEdit);
                    inputDivTag.appendChild(inputDelete);

                    let imgDivTag = document.createElement("div");
                    imgDivTag.setAttribute("class", "li__img");
                    imgDivTag.appendChild(imageTag);


                    li.appendChild(imgDivTag);
                    li.appendChild(textNode);
                    li.appendChild(inputDivTag);
                    li.setAttribute("id","li-" + responseObj._id);

                    childToReplaced.parentNode.replaceChild(li, childToReplaced);

                    //reset the moiveKey again
                    movieKey = "";
                    addMovieDialog.close();
                        
                }
            }
            payload = `title=${cleanTitle}&year=${year}&genre=${genre}&rating=${rating}&userRating=${userRating}&image=${cleanImgUrl}`;
            xhr.send(payload);
   
        }

    });

    /* Get the UL element, add a click listener for each LI */
    document.getElementById("display-list").addEventListener("click", function(e) {
        if(e.target && e.target.nodeName == "IMG"){
             // the list is clicked, display the info for the movie
             movieKey = e.target.id.replace("img-","");
             console.log(movieKey);
             
             if (typeof displayInfoDialog.showModal === "function") { //show the deleteDialog
                 displayInfoDialog.showModal();
                 retrievedData = localStorage.getItem(movieKey);
                 let movieObj = JSON.parse(retrievedData);
 
                 let outputNode = document.getElementById("display-info-output");
                 
                 let imgNode = createImgTag("img", "", movieObj.image, "movieImage");
                 imgNode.setAttribute("width", "250");
                 imgNode.setAttribute("height", "300");
                 let titleNode = createTagNTextnode("h5", '' , `Title: ${movieObj.title}`);
                 let yearNode = createTagNTextnode("h5", "", `Year: ${movieObj.year}`);
                 let genreNode = createTagNTextnode("h5", "", `Genre: ${movieObj.genre}`);
                 let ratingNode = createTagNTextnode("h5", "", `Rating: ${movieObj.rating}`);
                 let UserRatingNode = createTagNTextnode("h5", "", `UserRating: ${movieObj.userRating}`);
                 
                 let imgDivNode = document.createElement("div");
                 imgDivNode.setAttribute("class", "img-wrapper");
                 imgDivNode.appendChild(imgNode);
                 
                 
                 outputNode.appendChild(imgDivNode);
                 outputNode.appendChild(titleNode);
                 outputNode.appendChild(yearNode);
                 outputNode.appendChild(genreNode);
                 outputNode.appendChild(ratingNode);
                 outputNode.appendChild(UserRatingNode);
                 
             } else {
               alert("The dialog API is not supported by this browser");
             }
        };
        
        // if(e.target && e.target.nodeName == "LI") {// e.target is the clicked element! If it was a list item
        //     //console.log("List item ", e.target.id, " was clicked!"); // List item found!  Output the ID!
        // }

        // if(e.target && e.target.nodeName == "LI" && e.target.className != "edit" && e.target.className != "delete"){
           
        // }

        if(e.target && e.target.nodeName == "INPUT" && e.target.className == "edit"){ // If it was a edit span element
            movieKey = e.target.id.replace("edit-","");
            console.log("edit was clicked!", movieKey);

            if (typeof addMovieDialog.showModal === "function") {

                /*----------reset the ALl field based on movieKey--------*/ 
                retrievedData = localStorage.getItem(movieKey);
                let movieObj = JSON.parse(retrievedData);
                console.log(movieObj);
				document.getElementById("input-title").value = movieObj.title;
				document.getElementById("input-year").value = movieObj.year;
				document.getElementById("input-rating").value = movieObj.rating;
				document.getElementById("input-genre").value = movieObj.genre;
				document.getElementById("input-img-url").value = movieObj.image;
                addMovieDialog.showModal();
            } else {
                alert("The dialog API is not supported by this browser");
            }
        }
        
        if(e.target && e.target.nodeName == "INPUT" && e.target.className == "delete"){//if it was a edit delete element

            movieKey = e.target.id.replace("delete-","");//set the movieKey
            console.log("delete was clicked!", movieKey);

           
            if (typeof deleteDialog.showModal === "function") { //show the deleteDialog
              deleteDialog.showModal();
            } else {
              alert("The dialog API is not supported by this browser");
            }

        }
    });

    displayInfoCancelBtn.addEventListener("click", function() {
        //remove everything node 
        movieKey = "";
        let outputNode = document.getElementById("display-info-output");
        while (outputNode.lastElementChild) {
            outputNode.removeChild(outputNode.lastElementChild);
        }
        
        displayInfoDialog.close();
    });
    


    /* Delete Dialog Okay eventListener */
    deleteDialogOkay.addEventListener("click", function(){
        console.log(movieKey);

        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", `https://movie-website-rest-api.herokuapp.com/movies/${movieKey}?` + `access_token=${accessToken}`, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function(){
            if(xhr.readyState == xhr.DONE && xhr.status == 200){
                console.log(this.response);
                
                retrievedData = localStorage.getItem(movieKey);
                let movieObj = JSON.parse(retrievedData);
                console.log(movieObj + " was removed");
                localStorage.removeItem(movieKey);
                
                let nodeToRemoved = document.getElementById("li-" + movieKey);
                displayList.removeChild(nodeToRemoved);
        
                if(localStorage.length == 1){ //add back the div tag
                    //emptyList.setAttribute("style", "visibility: visible");
                    var noMoviespan = createTagNTextnode("DIV", "movie-listing", "NO Movie Currently Listed ");
                    document.body.insertBefore(noMoviespan, addMovieBtn );
                }
                movieKey = "";
                deleteDialog.close();
            }
        }
        xhr.send(null);
        
       
    });
    
    /* delete dialog cancel eventlistener */
    deleteDialogCancel.addEventListener("click", function(){
        //set the movieKey to ""
        movieKey = "";
        deleteDialog.close();
    });


    logoutBtn.addEventListener("click", function(){


        var payload = `access_token=${accessToken}`;
        console.log(payload);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://movie-website-rest-api.herokuapp.com/Users/logout?" + `access_token=${accessToken}`, true);
        xhr.onreadystatechange = function(){
            if(xhr.readyState == xhr.DONE && xhr.status == 204){
                console.log("redirect to login page!");
                localStorage.clear();
                location.href="login.html"; 
            }
        }
        xhr.send(null);

    });
})();