var Anima = Anima || {};

Anima.sample_microphone = (function() {
  var buffer = new Uint8Array(512);

  var average = function(array) {
    var sum = 0;
    var length = array.length;
    for(var i = 0; i < length; ++i) { sum += array[i]; }
    return Math.round(sum / length * 100) / 100;
  };

  return function sampleAudio() {
    Anima.sampler.getByteFrequencyData(buffer);

    var avg = average(buffer);
    var strokeColor = Anima.color_for_hour();

    Anima.processing.background(0, 0, 0, 0);

    Anima.spectrumBuffer.setStrokeColor([strokeColor]);
    Anima.spectrumBuffer.sampleFromBuffer(buffer);
    Anima.spectrumBuffer.draw(Anima.processing);

    Anima.historyBuffer.setStrokeColor([strokeColor]); // gross
    Anima.historyBuffer.setStrokeOpacity(avg / 75 * 200 + 55);
    Anima.historyBuffer.sampleFromBuffer(buffer);
    Anima.historyBuffer.draw(Anima.processing);

    Anima.frequencyBuffer.sampleFromBuffer(buffer);
    Anima.frequencyBuffer.setStrokeColor(strokeColor);
    Anima.frequencyBuffer.setStrokeOpacity(avg / 75 * 200 + 55);
    Anima.frequencyBuffer.draw(Anima.processing);

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
  new Processing(document.getElementById('labels'), function(p) {
    Anima.labels = p;
    Anima.draw_labels();
  });
};

Anima.draw_labels = function() {
  Anima.labels.size(window.innerWidth, window.innerHeight);

  var labelCanvas = document.getElementById('labels');
  var ctx = labelCanvas.getContext('2d');
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.font = "30px arial";

  var y = window.innerHeight / 2 + 55;
  ctx.fillStyle = Anima.stroke_color_for_hour();
  ctx.textAlign = 'right';
  ctx.fillText("now", window.innerWidth - 20, y);
  ctx.textAlign = 'left';
  ctx.fillText("then", 20, y);
};
