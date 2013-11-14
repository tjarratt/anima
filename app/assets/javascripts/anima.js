// todo : http://webaudiodemos.appspot.com/input/index.html

var microphone, sampler;
var context = new window.webkitAudioContext();
var processing;

window.onload = function() {
  var repeater, id;

  navigator.webkitGetUserMedia({audio: true}, function(localMediaStream) {
    microphone = context.createMediaStreamSource(localMediaStream);
    sampler = context.createAnalyser();
    sampler.fftSize = 1024;
    microphone.connect(sampler);

    window.clearTimeout(id);
    repeater = function () { sampleAudio(); id = setTimeout(repeater, 15); };
    repeater();
  });

  var canvas = document.getElementsByTagName('canvas')[0];
  new Processing(canvas, function(p) {
    processing = p;
    processing.size(window.innerWidth, window.innerHeight);
  });

  repeater = function() { sampleAudio(); id = setTimeout(repeater, 100); };
  repeater();

  (function daytimeRepeater() { updateBackground(); setTimeout(daytimeRepeater, 1000); })();
};

function updateBackground() {
  var date = new Date();

  $('#topGradientTransition,#bottomGradient').removeClass();
  var currentHour = date.getHours();
  var nextHour = (currentHour + 1) % 24;

  var percentage = (date.getMinutes() * 60 + date.getSeconds()) / 3600;
  $('#topGradientTransition').addClass('hour-' + currentHour);
  $('#topGradient').css('opacity', 1 - percentage);
  $('#bottomGradient').addClass('hour-' + nextHour);
}

function sampleAudio() {
  processing.background(0, 0, 0, 0);
  processing.stroke(230, 230, 230);

  if (!sampler) {
    return sampleFakeAudio();
  }

  var buffer = new Uint8Array(512);
  sampler.smoothingTimeConstant = 0.75;
  sampler.getByteFrequencyData(buffer);

  for(var lineCount = 0; lineCount < 5; ++lineCount) {
    var previousX = 0;
    var previousY = 0 - 50 * lineCount;

    for(var i = 0; i < buffer.length; ++i) {
      var x = window.innerWidth * 1.0 / buffer.length * i;
      var y = 300 - 50 * lineCount - buffer[i];
      processing.line(previousX, previousY, x, y);

      previousX = x;
      previousY = y;
    }
  }
}

var theta = 0;
var float_values = new Uint8Array(window.innerWidth);
function sampleFakeAudio() {
  theta += 0.2;

  var waves_frame_origin = window.innerHeight / 2;

  var x = theta;
  for (var i = 0; i < float_values.length; ++i) {
    float_values[i] = 100 + Math.sin(x + i * 0.1) * 100;
  }

  for(var lineCount = 0; lineCount < 5; ++lineCount) {
    var prevX = 0;
    var prevY = float_values[0] - 50 * lineCount;

    for(var j = 0; j < float_values.length; ++j) {
      processing.line(prevX, waves_frame_origin + prevY - 50 * lineCount, prevX + j, waves_frame_origin + float_values[j] - 50 * lineCount);

      prevX = prevX + j;
      prevY = float_values[j];
    }
  }
}
