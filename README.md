# test-video

# Video player with images

Uses ffmpeg.

Steps:
1/ Get all videos' frames: ffmpeg -i 720.mp4 -an -f image2 "%d.jpg"
2/ Encode frames in json: php images_to_json.php frameStart frameEnd imagesFolder/ imageExtension outputName.json
3/ Get mp3 from video: ffmpeg -i source_video.avi -vn -ar 44100 -ac 2 -ab 192 -f mp3 sound.mp3

Just use: <div id="videoPlayer" data-videoPlayer="video.json"></div>