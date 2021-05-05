let client_id = "7c54b6c759954f4db09959ce5cebe0b0"

localStorage.setItem("client_id", client_id);

let bpmSlider = document.querySelector("#bpm-slider");
let bpmOutput = document.querySelector(".bpm-output");
let bpmCheck = document.querySelector("#bpm-check");

function onPageLoad(){
    console.log("Refresh")
    if(window.location.href.length > 60){
        localStorage.setItem("access_token", location.hash.substr(1).split('&')[0].split('=')[1]);
        window.location.href = "http://127.0.0.1:5500/index.html";
    }
    access_token = localStorage.getItem("access_token");
    console.log(access_token)


}

document.querySelector(".button-auth").addEventListener("click", function(){
    location = "https://accounts.spotify.com/authorize?client_id=" + client_id + "&redirect_uri=http://127.0.0.1:5500/index.html&scope=user-read-private%20user-read-email%20user-top-read&response_type=token"
    
})

document.querySelector(".button-track").addEventListener("click", function(){
    //let query = document.querySelector("#searchbox").value
    //searchTrack(query);
    //requestTrack("1BSncOsSJPQkpl29QM0ipj")

    getRecommendations();
})

bpmCheck.addEventListener("change", function(){
    if (bpmCheck.checked == true){
        bpmOutput.innerHTML = bpmSlider.value;
        bpmSlider.style.background
    }
    else{
        bpmOutput.innerHTML = "";
    }
})

bpmSlider.oninput = function() {
    bpmOutput.innerHTML = this.value;
  }


function getRecommendations(){
    

    let request = new XMLHttpRequest();
    request.open("GET", "https://api.spotify.com/v1/me/top/artists?limit=5", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + access_token);
    request.send(null)
    request.onload = function(){
        if ( this.status == 200 ){
            let data = JSON.parse(this.responseText);
            console.log(data);

            makeRecommendationsRequest(data);
            

        }
        else {
            console.log(this.responseText);
            alert(this.responseText);
        }
    }
}

function makeRecommendationsRequest(data){
    let query = "https://api.spotify.com/v1/recommendations?seed_artists=";
            
            for(let i = 0; i<5; i++){
                console.log(data.items[i].id);
                query += data.items[i].id;
                query += "%2C";
            }
            if(bpmCheck.checked == true){
                query += "&target_tempo=" + bpmSlider.value;
            }

            let recommendationRequest = new XMLHttpRequest();
            recommendationRequest.open("GET", query, true);
            recommendationRequest.setRequestHeader('Content-Type', 'application/json');
            recommendationRequest.setRequestHeader('Authorization', 'Bearer ' + access_token);
            recommendationRequest.send(null);
            recommendationRequest.onload = function(){
                if ( this.status == 200 ){
                    let data = JSON.parse(this.responseText); 
                    requestTrack(data.tracks);
                    
        
                }
                else {
                    console.log(this.responseText);
                    alert(this.responseText);
                }
            }
}

function requestTrack(tracks){
    query = "https://api.spotify.com/v1/audio-features?ids="
    for (let i=0; i<tracks.length;i++){
        query += tracks[i].id;
        query += "%2C";
    }


    let request = new XMLHttpRequest();
    request.open("GET", query, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + access_token);
    request.send(null)
    request.onload = function(){
        if ( this.status == 200 ){
            let data = JSON.parse(this.responseText);
            console.log(data.audio_features)
            let songs = [];
            for(let j = 0; j<20; j++){
                
                console.log("Song title: " + tracks[j].name + " Artist: " + tracks[j].artists[0].name);
                songs[j] = document.createElement("div")
                songs[j].textContent = "";
                songs[j].textContent = "Song title: " + tracks[j].name + ", Artist: " + tracks[j].artists[0].name + " " + data.audio_features[j].tempo
                document.body.appendChild(songs[j]);

                document.querySelector("iframe").src = "https://open.spotify.com/embed/track/" + tracks[j].id;

            }

        }
        else {
            console.log(this.responseText);
            alert(this.responseText);
        }
    }
}

function searchTrack(query){
    let request = new XMLHttpRequest();
    request.open("GET", "https://api.spotify.com/v1/search?q=" + query + "&type=track", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + access_token);
    request.send();
    request.onload = function(){
        if ( this.status == 200 ){
            let data = JSON.parse(this.responseText);
            console.log(data.tracks.items);
            let songs = []
            for(let i = 0; i<20; i++){
                console.log("Song title: " + data.tracks.items[i].name + " Artist: " + data.tracks.items[i].artists[0].name);
                songs[i] = document.createElement("div")
                songs[i].textContent = "Song title: " + data.tracks.items[i].name + ", Artist: " + data.tracks.items[i].artists[0].name
                document.body.appendChild(songs[i]);
            }

        }
        else {
            console.log(this.responseText);
            alert(this.responseText);
        }
    }
    
}