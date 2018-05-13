var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('video-bg', {
    videoId: 'kUkvaEjtM34',
    host: 'https://www.youtube-nocookie.com',
    playerVars: {
      'rel': 0,
      'controls': 0,
      'showinfo': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  if(event.data == 0) {
    document.getElementsByTagName('body')[0].style = 'background: black;';
    document.getElementById('video-bg').remove();
  }
}