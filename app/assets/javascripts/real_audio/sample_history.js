var Anima = Anima || {};

Anima.historyBuffer = (function() {
  var strokeColor = [255,255,255];
  var strokeOpacity = 255;

  var historyBuffer = new Array(4096);
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

  historyBuffer.setStrokeColor = function setStrokeColor(color) {
    strokeColor = color;
  };

  historyBuffer.setStrokeOpacity = function setStrokeOpacity(opacity) {
    strokeOpacity = opacity;
  };

  historyBuffer.draw = function draw(processing) {
    var x, y;
    var waves_frame_origin = window.innerHeight / 2;
    var length = historyBuffer.length;
    var window_width = window.innerWidth - 50;

    processing.stroke.apply(processing, strokeColor.concat(strokeOpacity));
    processing.fill.apply(processing, strokeColor.concat(strokeOpacity));
    processing.beginShape();

    for(i = 0; i < length; ++i) {
      x = window_width * i / length;
      y = historyBuffer[i];

      processing.vertex(x, waves_frame_origin - y);
    }

    processing.vertex(x, waves_frame_origin);
    processing.vertex(0, waves_frame_origin);
    processing.endShape();
  };

  return historyBuffer;
})();
