var Anima = Anima || {};

var centerOffset = 0;
var spectrumBuffer = (function() {
  var xDivisions = 40;
  var yDivisions = 25;
  var strokeColor = [255,255,255];
  var fillColor = [255,255,255];

  var spectrumBuffer = new Array(xDivisions);
  for (var i = 0; i < xDivisions; ++i) {
    spectrumBuffer[i] = [];
    for (var j = 0; j < yDivisions; ++j) {
      spectrumBuffer[i][j] = 0;
    }
  }

  spectrumBuffer.sampleFromBuffer = function sampleFromBuffer(buffer) {
    var groupedAverages = groupedAveragesFromBuffer(buffer, yDivisions);
    var momentSpectrum = new Array(yDivisions);

    for (var i = 0; i < yDivisions; i++) {
      momentSpectrum[i] = groupedAverages[i];
    }
    spectrumBuffer.shift();
    spectrumBuffer.push( momentSpectrum );
  };

  spectrumBuffer.setStrokeColor = function setStrokeOpacity(color) {
    strokeColor = color;
  };

  spectrumBuffer.draw = function draw(processing) {
    var width = window.innerWidth / xDivisions;
    var height = window.innerHeight / 2 / yDivisions;
    for(i = 0; i < xDivisions; ++i) {
      for(j = 0; j < yDivisions; ++j) {
        var x = width * i;
        var y = height * j;

        var opacity = spectrumBuffer[i][j];

        processing.fill.apply(processing, fillColor.concat(opacity));
        processing.stroke.apply(processing, strokeColor.concat(opacity));

        processing.rect(x, y, width, height);
        processing.rect(x, window.innerHeight - y - height, width, height);
      }
    }
  };

  return spectrumBuffer;
}) ();

function groupedAveragesFromBuffer(buffer, numGroups) {
  var averages = [];
  var groupSize = Math.ceil(buffer.length / numGroups);
  for (var i = 0; i < numGroups; i++) {
    var group = buffer.subarray(groupSize * i, groupSize * (i + 1));
    averages[i] = Math.average(group);
  }
  return averages;
}

var historyBuffer = (function() {
  var historyBuffer = new Array(1024);
  var strokeOptions = [];

  for (var i = 0; i < historyBuffer.length; ++i) {
    historyBuffer[i] = 0;
  }

  historyBuffer.sampleFromBuffer = function sampleFromBuffer(buffer) {
    var sum = 0;
    var length = buffer.length;
    for(var i = 0; i < length; ++i) { sum += buffer[i]; }

    var moment = sum / (255 * buffer.length) * 500;
    historyBuffer.shift();
    historyBuffer.push(moment);
  };

  historyBuffer.setStroke = function setStroke(options) {
    strokeOptions = options;
  };

  historyBuffer.draw = function draw(processing) {
    var waves_frame_origin = window.innerHeight / 2 + centerOffset;
    var x, y;
    var previous_x = 0;
    var previous_y = historyBuffer[0];
    var length = historyBuffer.length;

    processing.stroke.apply(processing, strokeOptions);

    for(i = 0; i < length; ++i) {
      x = window.innerWidth * i / length;
      y = historyBuffer[i];

      // TODO : what if we could just pass this entire array to processing? should be more efficient, nay?
      Anima.processing.line(previous_x, waves_frame_origin - previous_y - centerOffset/2,
                            x, waves_frame_origin - y - centerOffset/2
      );

      Anima.processing.line(previous_x, waves_frame_origin + previous_y - centerOffset/2,
                            x, waves_frame_origin + y - centerOffset/2
      );

      previous_x = x;
      previous_y = y;
    }
  };

  return historyBuffer;
}) ();

Anima.sample_microphone = (function() {
  var buffer = new Uint8Array(512);
  
  return function sampleAudio() {
    Anima.sampler.getByteFrequencyData(buffer);

    var avg = Math.average(buffer);
    var strokeColor = Anima.color_for_hour();

    Anima.processing.background(0, 0, 0, 0);

    spectrumBuffer.setStrokeColor([strokeColor]);
    spectrumBuffer.sampleFromBuffer(buffer);
    spectrumBuffer.draw(Anima.processing);

    historyBuffer.setStroke([strokeColor, avg / 75 * 200 + 55]); //alpha
    historyBuffer.sampleFromBuffer(buffer);
    historyBuffer.draw(Anima.processing);

    TWEEN.update();
    window.requestAnimationFrame(Anima.sample_microphone);
  };
})();

Anima.enable_real_audio = function(context, media_stream) {
  Anima.sampler = context.createAnalyser();
  Anima.sampler.fftSize = 1024;
  Anima.sampler.smoothingTimeConstant = 0.95;

  var microphone = context.createMediaStreamSource(media_stream);
  microphone.connect(Anima.sampler);

  window.requestAnimationFrame(Anima.sample_microphone);
};

Math.average = function(array) {
  var sum = 0;
  var length = array.length;
  for(var i = 0; i < length; ++i) { sum += array[i]; }
  return Math.round(sum / length * 100) / 100;
};
