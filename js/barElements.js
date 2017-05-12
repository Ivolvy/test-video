/**
 * Create bar elements
 * @param elementName
 * @param callback
 * @constructor
 */

var BarElements = function(elementName, callback){

    //Button
    this.button = document.createElement('button');
    this.button.setAttribute('class', elementName + 'Button');
    this.button.addEventListener("click", function(){
        callback();
    }, false);

    //Icon
    this.icon = document.createElement('img');
    this.icon.setAttribute('class', elementName + 'Icon');
    this.icon.src = "resources/" + elementName + "Button.svg";
    this.button.appendChild(this.icon);
};


BarElements.prototype.getButton = function(){
    return this.button;
};

BarElements.prototype.getIcon = function(){
    return this.icon;
};