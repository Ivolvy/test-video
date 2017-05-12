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

    this.totalPercent = 0;


    appJson.createBottomBar();
    appJson.createVideoTarget();

    appJson.initSound();
    appJson.getJsonFile();


    /*Video formats
    1280 x 720
    854 x 480*/
};


AppJson.prototype.createBottomBar = function(){

    this.bottomBar = document.createElement('div');
    this.bottomBar.setAttribute('id', 'bottomBar');
    this.videoContainer.appendChild(this.bottomBar);

    appJson.createProgressBar();
    appJson.initializeControls();
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
 * Create progress bar
 */
AppJson.prototype.createProgressBar = function(){
    var that = this;

    this.progressBar = document.createElement('div');
    this.progressBar.setAttribute('class', 'progressBar');

    this.bar = document.createElement('div');
    this.bar.setAttribute('class', 'bar');

    this.progressBar.appendChild(this.bar);
    this.bottomBar.appendChild(this.progressBar);




};




/**
 * Increase progress bar
 */
AppJson.prototype.increaseProgressBar = function(percent){
    this.totalPercent += percent;
    this.bar.style.width = this.totalPercent + '%';

};




/**
 * Initialize controls (play/pause/...)
 */
AppJson.prototype.initializeControls = function() {

    this.controls = document.createElement('div');
    this.controls.setAttribute('class', 'controls');


    //Play Button
    this.playButton = document.createElement('button');
    this.playButton.setAttribute('class', 'playButton');
    this.playButton.addEventListener("click", function(){
        appJson.playVideo();
    }, false);


    //Play Icon
    this.playIcon = document.createElement('img');
    this.playIcon.setAttribute('class', 'playIcon');
    this.playIcon.src = "resources/playButton.svg";
    this.playButton.appendChild(this.playIcon);



    //Pause Button
    this.pauseButton = document.createElement('button');
    this.pauseButton.setAttribute('class', 'pauseButton');
    this.pauseButton.addEventListener("click", function(){
        appJson.pauseVideo();
    }, false);

    //Pause Icon
    this.pauseIcon = document.createElement('img');
    this.pauseIcon.setAttribute('class', 'pauseIcon');
    this.pauseIcon.src = "resources/pauseButton.svg";
    this.pauseButton.appendChild(this.pauseIcon);



    if(this.pause){
        this.pauseButton.style.display = 'none';
    } else{
        this.playButton.style.display = 'none';
    }


    this.controls.appendChild(this.playButton);
    this.controls.appendChild(this.pauseButton);

    this.bottomBar.appendChild(this.controls);

};

/**
 * Play the video
 */
AppJson.prototype.playVideo = function(){
    this.pause = false;

    this.sound.play();

    this.playButton.style.display = 'none';
    this.pauseButton.style.display = 'block';
};

/**
 * Pause the video
 */
AppJson.prototype.pauseVideo = function(){
    this.pause = true;

    this.sound.pause();

    this.playButton.style.display = 'block';
    this.pauseButton.style.display = 'none';
};


/**
 * Init sound
 */
AppJson.prototype.initSound = function(){
    this.sound = document.createElement('audio');
    this.sound.setAttribute('class', 'audio');
    this.sound.src = "jsonVideo/sound.mp3";
};

/**
 * Get Json file in order to play the video
 */
AppJson.prototype.getJsonFile = function(){
    var that = this;

    var http = new XMLHttpRequest();

    http.onprogrgetJsonFileess = function() {
        console.log("Progress");
    };

    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {
            if (http.status == 200) {
                var jsonFile = JSON.parse(http.responseText);
                appJson.launchVideo(jsonFile);
                that.sound.play();
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
AppJson.prototype.launchVideo = function(jsonFile){
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
        appJson.increaseProgressBar(100/jsonFile.frames.length);
        this.videoTarget.src = jsonFile.frames[this.currentFrame];
    }

    this.currentFrame += 1;
};



var appJson = new AppJson();
appJson.init();