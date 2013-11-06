// todo : http://webaudiodemos.appspot.com/input/index.html

var microphone, sampler;
var context = new window.webkitAudioContext();
var processing;

window.onload = function() {
  navigator.webkitGetUserMedia({audio: true}, function(localMediaStream) {

    microphone = context.createMediaStreamSource(localMediaStream);
    sampler = context.createAnalyser();
    sampler.fftSize = 1024;
    microphone.connect(sampler);

    var canvas = document.getElementsByTagName('canvas')[0];
    new Processing(canvas, function(p) {
      processing = p;
      window.setInterval(sampleAudio, 15);
    });
  });
};

function sampleAudio() {
  var buffer = new Uint8Array(1024);

  sampler.smoothingTimeConstant = 0.75;
  sampler.getByteFrequencyData(buffer);
  console.log(buffer);

  processing.size(window.innerWidth, window.innerHeight);
  processing.background(89, 125, 225);
  processing.stroke(230, 230, 230);

  processing.line(0, 300, window.innerWidth, 300);

  var previousX = 0;
  var previousY = 0;

  for(var i = 0; i < buffer.length; ++i) {
    var x = window.innerWidth / buffer.length * i;
    processing.line(previousX, previousY, x, 300 + buffer[i]);
  }

  processing.line(previousX, previousY, window.innerWidth, 300);
}
