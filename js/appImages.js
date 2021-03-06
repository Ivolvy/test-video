var AppImages = function(){};


AppImages.prototype.init = function(){
    this.initVars();
};

AppImages.prototype.initVars = function(){
    this.videoElement = document.getElementById("imagesToVideo");

    this.videoFolder = "imagesVideo";
    this.videoImages = "imagesVideo";
    this.imageExtension = ".jpg";

    this.str = "";
    this.pad = "000";
    this.imageNumber = "";
    this.increment = 0;
    this.images = [];
    this.numberOfImages = 0;
    this.rate = 24;
    this.imageInterval = 1000/this.rate;
};

/**
 * Get all the images of the video
 */
AppImages.prototype.getImages = function(){
    var that = this;

    var http = new XMLHttpRequest();
    var params = "videoFolder=" + this.videoFolder;
    http.onloadend = appImages.onLoadEnd;

    http.onprogress = appImages.onProgress;

    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {
            if (http.status == 200) {
                that.numberOfImages = http.responseText;

                for (var i = 0; i < that.numberOfImages; i++) {
                    this.imageNumber = appImages.updateImageNumber(i);
                    appImages.preloadImages(this.imageNumber);
                }
            }
        }
    };

    http.open("POST", "function.php", true);
    http.setRequestHeader("Content-type", "appImageslication/x-www-form-urlencoded");
    http.send(params);
};


/**
 * Play when all the images are preload
 * @param event
 */
AppImages.prototype.onLoadEnd = function(event) {
    console.log("Preload ended");

    appImages.play();
};

/**
 * On progress preload images
 * @param event
 */
AppImages.prototype.onProgress = function(event) {
    console.log("Loading");
};


/**
 * Preload images
 * @param i
 */
AppImages.prototype.preloadImages = function(i){
    this.images[i] = new Image();
    this.images[i].src = this.videoFolder + "/" + this.videoImages + i + this.imageExtension;

    console.log("preload: " + this.images[i].src);
};

/**
 * Update image number
 * @param increment
 * @returns {string|*}
 */
AppImages.prototype.updateImageNumber = function(increment){
    this.str = "" + increment;
    console.log("increment: " + increment);
    this.imageNumber = this.pad.substring(0, this.pad.length - this.str.length) + this.str;

    console.log(this.imageNumber);

    return this.imageNumber;

};

/**
 * Play all the frames
 */
AppImages.prototype.play = function() {
    console.log("play");

    this.str = "" + 0;
    this.increment = 0;

    this.interval = setInterval(appImages.frame.bind(this), this.imageInterval);
};

/**
 * Each frame for the video
 */
AppImages.prototype.frame = function() {
    console.log("frame");

    this.str = "" + this.increment;
    this.imageNumber = this.pad.substring(0, this.pad.length - this.str.length) + this.str;

    if (this.increment == this.numberOfImages) {
        clearInterval(this.interval);
    } else {
        this.videoElement.src = this.videoFolder + "/" + this.videoImages + this.imageNumber + this.imageExtension;
    }
    console.log(this.imageNumber);
    this.increment += 1;
};




var appImages = new AppImages();
appImages.init();