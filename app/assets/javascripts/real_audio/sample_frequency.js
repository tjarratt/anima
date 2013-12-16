var Anima = Anima || {};

Anima.frequencyBuffer = (function() {
  var frequencyBuffer = [];
  var strokeColor = [255,255,255];
  var strokeOpacity = 255;

  return {
    sampleFromBuffer: function(buffer) {
      frequencyBuffer = buffer;
    },
    setStrokeColor: function(color) {
      strokeColor = color;
    },
    setStrokeOpacity: function(opacity) {
      strokeOpacity = opacity;
    },
    draw: function(processing) {
      var x, y, waves_origin = window.innerHeight / 2;

      processing.beginShape();
      for (var i = 0; i < frequencyBuffer.length; ++i) {
        x = window.innerWidth * i / frequencyBuffer.length;
        y = (frequencyBuffer[i] === undefined) ? 0 : frequencyBuffer[i] * 1.5;
        processing.vertex(x, waves_origin + y);
      }

      processing.vertex(x, waves_origin);
      processing.vertex(0, waves_origin);
      processing.endShape();
    }
  };
})();
