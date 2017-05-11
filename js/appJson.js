var AppJson = function(){};


AppJson.prototype.init = function(){
    this.initVars();
};

AppJson.prototype.initVars = function(){
    this.videoTarget = document.getElementById("imagesToVideo");
    this.videoJsonElement = document.getElementById("videoPlayer");
    this.videoFile = this.videoJsonElement.getAttribute("data-videoPlayer");

    this.rate = 24;
    this.imageInterval = 1000/this.rate;

    this.currentFrame = 0;
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

    if(this.currentFrame == jsonFile.frames.length + 1){
        clearInterval(that.interval);
    } else {
        console.log("currentFrame: " + this.currentFrame);
        this.videoTarget.src = jsonFile.frames[this.currentFrame];
    }

    this.currentFrame += 1;
};



var appJson = new AppJson();
appJson.init();