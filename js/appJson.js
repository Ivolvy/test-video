var AppJson = function(){};


AppJson.prototype.init = function(){
    this.initVars();
};

AppJson.prototype.initVars = function(){
    this.videoContainer = document.getElementById("videoPlayer");
    this.videoFile = this.videoContainer.getAttribute("data-videoPlayer");

    this.rate = 24;
    this.imageInterval = 1000/this.rate;

    this.jsonFile = "";

    this.currentFrame = 0;
    this.pause = false;
    this.videoEnded = false;

    this.totalPercent = 0;


    appJson.createBottomBar();
    appJson.createVideoTarget();

    appJson.initSound();
    appJson.getJsonFile();
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

    this.barPadding = document.createElement('div');
    this.barPadding.setAttribute('class', 'barPadding');

    this.bar = document.createElement('div');
    this.bar.setAttribute('class', 'bar');


    this.progressBar.appendChild(this.bar);
    this.bar.appendChild(this.barPadding);
    this.bottomBar.appendChild(this.progressBar);



    this.progressBar.addEventListener('click', function(e){
        var posX = e.pageX - this.offsetLeft;

        //Get exact percentage of progress
        var progressSelection = posX*100/that.progressBar.offsetWidth;

        appJson.goToPosition(progressSelection);
    });


};

/**
 * Go to position in the progress bar
 * @param percent
 */
AppJson.prototype.goToPosition = function(percent){
    if(this.reloadElement.getButton().style.display == 'block'){
        appJson.displayBarButton(0);
    }

    this.totalPercent = percent;
    this.bar.style.width = percent + '%';

    //Select the associated frame
    this.currentFrame = Math.round(this.jsonFile.frames.length*percent/100);
    this.videoTarget.src = this.jsonFile.frames[this.currentFrame];

    //Move to part of sound
    this.sound.currentTime = this.sound.duration*percent/100;


    if(this.videoEnded){
        this.videoEnded = false;
        this.sound.play();
        appJson.launchVideo(this.currentFrame);
    }
};


/**
 * Increase progress bar
 * @param percent
 */
AppJson.prototype.increaseProgressBar = function(percent){
    this.totalPercent += percent;
    this.bar.style.width = this.totalPercent + '%';
};

/**
 * Reset progress bar
 */
AppJson.prototype.resetProgressBar = function(){
    this.totalPercent = 0;
    this.bar.style.width = this.totalPercent + '%';
};


/**
 * Initialize controls (play/pause/...)
 */
AppJson.prototype.initializeControls = function() {

    this.controls = document.createElement('div');
    this.controls.setAttribute('class', 'controls');

    this.playElement = new BarElements("play", appJson.playVideo);
    this.pauseElement = new BarElements("pause", appJson.pauseVideo);
    this.reloadElement = new BarElements("reload", appJson.reloadVideo);
    this.reloadElement.getButton().style.display = 'none';

    if(this.pause){
        this.pauseElement.getButton().style.display = 'none';
    } else{
        this.playElement.getButton().style.display = 'none';
    }


    this.controls.appendChild(this.playElement.getButton());
    this.controls.appendChild(this.pauseElement.getButton());
    this.controls.appendChild(this.reloadElement.getButton());

    this.bottomBar.appendChild(this.controls);

};



/**
 * Play the video
 */
AppJson.prototype.playVideo = function(){
    appJson.pause = false;

    appJson.sound.play();
    appJson.displayBarButton(0);
};

/**
 * Pause the video
 */
AppJson.prototype.pauseVideo = function(){
    appJson.pause = true;

    appJson.sound.pause();
    appJson.displayBarButton(1);
};

/**
 * Reload the video
 */
AppJson.prototype.reloadVideo = function(){
    appJson.videoEnded = false;

    appJson.displayBarButton(0);

    appJson.sound.play();
    appJson.resetProgressBar();
    appJson.launchVideo(0);
};

/**
 * Display bar button
 * 0: pause
 * 1: play
 * 2: reload
 * @param barButton
 */
AppJson.prototype.displayBarButton = function(barButton){

    this.pauseElement.getButton().style.display = 'none';
    this.playElement.getButton().style.display = 'none';
    this.reloadElement.getButton().style.display = 'none';

    if(barButton == 0){
        this.pauseElement.getButton().style.display = 'block';
    } else if(barButton == 1){
        this.playElement.getButton().style.display = 'block';
    } else if(barButton == 2){
        this.reloadElement.getButton().style.display = 'block';
    }

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

    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {
            if (http.status == 200) {
                that.jsonFile = JSON.parse(http.responseText);
                appJson.launchVideo(0);
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
AppJson.prototype.launchVideo = function(currentFrame){
    this.currentFrame = currentFrame;
    this.interval = setInterval(appJson.displayFrames.bind(this, this.jsonFile), this.imageInterval);
};

/**
 * Display each frames successively
 */
AppJson.prototype.displayFrames = function(){

    //If video paused, don't display frames
    if(this.pause){
        return;
    }

    if(this.currentFrame == this.jsonFile.frames.length){
        clearInterval(this.interval);
        appJson.endVideo();
    } else {
        appJson.increaseProgressBar(100/this.jsonFile.frames.length);
        this.videoTarget.src = this.jsonFile.frames[this.currentFrame];
    }

    this.currentFrame += 1;
};


AppJson.prototype.endVideo = function(){
    this.videoEnded = true;

    appJson.displayBarButton(2);
};



var appJson = new AppJson();
appJson.init();