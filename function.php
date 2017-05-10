<?php

// Directory
$directory = $_GET["videoFolder"] . "/";


$files = glob($directory . "*.{jpg,jpeg,png,gif}",GLOB_BRACE);

if ($files){
    $filecount = count($files);
    echo $filecount;
} else{
    echo "No files in selected folder";
}

?>

