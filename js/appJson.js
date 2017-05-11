var AppJson = function(){};


AppJson.prototype.init = function(){
    this.initVars();
};

AppJson.prototype.initVars = function(){
    this.videoContainer = document.getElementById("videoPlayer");
    this.videoFile = this.videoContainer.getAttribute("data-videoPlayer");

    this.rate = 24;
    this.imageInterval = 1000/this.rate;

    this.currentFrame = 0;
    this.pause = false;


    appJson.createVideoTarget();
    appJson.initializeControls();

    appJson.getJsonFile();


    /*Video formats
    1280 x 720
    854 x 480*/
};

/**
 * Create video target element
 */
AppJson.prototype.createVideoTarget = function(){
    this.videoTarget = document.createElement('img');
    this.videoTarget.setAttribute('id', 'imagesToVideo');

    this.videoContainer.appendChild(this.videoTarget);
};


/**
 * Initialize controls (play/pause/...)
 */
AppJson.prototype.initializeControls = function() {

    this.controls = document.createElement('div');
    this.controls.setAttribute('class', 'controls');

    this.playButton = document.createElement('button');
    this.playButton.setAttribute('class', 'playButton');
    this.playButton.innerHTML = 'Play';
    this.playButton.addEventListener("click", function(){
        appJson.playVideo();
    }, false);

    this.controls.appendChild(this.playButton);


    this.pauseButton = document.createElement('button');
    this.pauseButton.setAttribute('class', 'pauseButton');
    this.pauseButton.innerHTML = 'Pause';
    this.pauseButton.addEventListener("click", function(){
        appJson.pauseVideo();
    }, false);

    if(this.pause){
        this.pauseButton.style.display = 'none';
    } else{
        this.playButton.style.display = 'none';
    }

    this.controls.appendChild(this.pauseButton);


    this.videoContainer.appendChild(this.controls);

};

/**
 * Play the video
 */
AppJson.prototype.playVideo = function(){
    this.pause = false;

    this.playButton.style.display = 'none';
    this.pauseButton.style.display = 'block';
};

/**
 * Pause the video
 */
AppJson.prototype.pauseVideo = function(){
    this.pause = true;

    this.playButton.style.display = 'block';
    this.pauseButton.style.display = 'none';
};

/**
 * Get Json file in order to play the video
 */
AppJson.prototype.getJsonFile = function(){
    var http = new XMLHttpRequest();

    http.onprogress = function() {
        console.log("Progress");
    };

    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {
            if (http.status == 200) {
                var jsonFile = JSON.parse(http.responseText);
                appJson.launch(jsonFile);
            }
        }
    };

    http.open("GET", this.videoFile, true);
    http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    http.send(null);
};

/**
 * Launch video process
 */
AppJson.prototype.launch = function(jsonFile){
    this.currentFrame = 0;

    console.log("imageInterval: "+this.imageInterval);

    this.interval = setInterval(appJson.displayFrames.bind(this, jsonFile), this.imageInterval);
};

/**
 * Display each frames successively
 */
AppJson.prototype.displayFrames = function(jsonFile){
    var that = this;

    //If video paused, don't display frames
    if(this.pause){
        return;
    }

    if(this.currentFrame == jsonFile.frames.length){
        clearInterval(that.interval);
    } else {
        console.log("currentFrame: " + this.currentFrame);
        this.videoTarget.src = jsonFile.frames[this.currentFrame];
    }

    this.currentFrame += 1;
};



var appJson = new AppJson();
appJson.init();