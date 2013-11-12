// todo : http://webaudiodemos.appspot.com/input/index.html

var microphone, sampler;
var context = new window.webkitAudioContext();
var processing;
var interval;

window.onload = function() {
  navigator.webkitGetUserMedia({audio: true}, function(localMediaStream) {
    microphone = context.createMediaStreamSource(localMediaStream);
    sampler = context.createAnalyser();
    sampler.fftSize = 1024;
    microphone.connect(sampler);

    window.clearInterval(sampleAudio);
    interval = window.setInterval(sampleAudio, 15);
  });

  var canvas = document.getElementsByTagName('canvas')[0];
  new Processing(canvas, function(p) {
    processing = p;
    processing.size(window.innerWidth, window.innerHeight);
  });

  interval = window.setInterval(sampleAudio, 150);
};

function sampleAudio() {
  processing.background(89, 125, 225);
  processing.stroke(230, 230, 230);

  if (!sampler) {
    return sampleFakeAudio();
  }

  var buffer = new Uint8Array(512);
  sampler.smoothingTimeConstant = 0.75;
  sampler.getByteFrequencyData(buffer);

  var previousX = 0;
  var previousY = 0;

  for(var i = 0; i < buffer.length; ++i) {
    var x = window.innerWidth * 1.0 / buffer.length * i;
    var y = 300 - buffer[i];
    processing.line(previousX, previousY, x, y);

    previousX = x;
    previousY = y;
  }
}

var theta = 0;
var floatValues = new Uint8Array(window.innerWidth);
function sampleFakeAudio() {
  theta += 0.2;

  var x = theta;
  for (var i = 0; i < floatValues.length; ++i) {
    floatValues[i] = 100 + Math.sin(x + i * 0.1) * 100;
  }

  var prevX = 0;
  var prevY = floatValues[0];
  for(var j = 0; j < floatValues.length; ++j) {
    processing.line(prevX, 50 + prevY, prevX + j, 50 + floatValues[j]);

    prevX = prevX + j;
    prevY = floatValues[j];
  }
}
