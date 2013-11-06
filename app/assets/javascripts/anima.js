// todo : http://webaudiodemos.appspot.com/input/index.html

var microphone, sampler;
var context = new window.webkitAudioContext();
window.onload = function() {
  navigator.webkitGetUserMedia({audio: true}, function(localMediaStream) {

    microphone = context.createMediaStreamSource(localMediaStream);
    sampler = context.createAnalyser();
    sampler.fftSize = 1024;
    microphone.connect(sampler);

    window.setInterval(sampleAudio, 300);

    var canvas = document.getElementsByTagName('canvas')[0];
    var processing = new Processing(canvas, function(p) {
      p.size(window.innerWidth, window.innerHeight);
      p.background(89, 125, 225);

      p.stroke(230, 230, 230);

      p.line(0, 150, window.innerWidth, 150);
      p.line(0, 200, window.innerWidth, 200);
      p.line(0, 250, window.innerWidth, 250);
      p.line(0, 300, window.innerWidth, 300);
      p.line(0, 350, window.innerWidth, 350);
    });
  });
};

function sampleAudio() {
  var buffer = new Uint8Array(1024);

  sampler.smoothingTimeConstant = 0.75;
  sampler.getByteFrequencyData(buffer);
  console.log(buffer);
}
