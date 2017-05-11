<?php
/*
 * Convert all images to base64 and encode them to json file
 *
 * Steps:
 * 1/ Get all videos' frames: ffmpeg -i 720.mp4 -an -f image2 "%d.jpg"
 * 2/ Encode frames in json: php images_to_json.php frameStart frameEnd imagesFolder/ imageExtension outputName.json
 *
 * Example: php images_to_json.php 1 722 resources/lightImagesVideo/ .jpg jsonVideo/video.json
 *
 * */

/**
 * Convert image to base64
 * @param $image
 * @return string
 */
function getBase64Image($image){
    //Get image from path
    $imgBase64 = base64_encode(file_get_contents($image));

    // Format
    $imageFormat = 'data: '.mime_content_type($image).';base64,'.$imgBase64;

    return $imageFormat;
}



$frameStart = $argv[1] ?: 1;
$frameEnd = $argv[2]; //to do dynamically if not filled
$folder = $argv[3];
$imageExtension = $argv[4];
$outputName = $argv[5];
$framesTab[] = "";

//Fille the tab with all base64 frames
for($i = $frameStart; $i < $frameEnd; $i++){
    $image = $folder . $i . $imageExtension;
    $framesTab[] = getBase64Image($image);
}

$json["frames"] = $framesTab;

$file = fopen($outputName, "w");
fwrite($file, json_encode($json));
fclose($file);


