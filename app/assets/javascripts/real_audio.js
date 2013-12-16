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
};
