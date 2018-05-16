var video = document.getElementById('video-bg');
video.play();

video.onended = function() {
  document.getElementsByTagName('body')[0].style = 'background: black;';
  video.remove();
}