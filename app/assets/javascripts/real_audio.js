var Anima = Anima || {};

Anima.sample_microphone = (function() {
  var buffer = new Uint8Array(512);

  return function sampleAudio() {
    Anima.sampler.getByteFrequencyData(buffer);

    var avg = Math.average(buffer);
    var color = Anima.color_for_hour();
    color.push(avg / 75 * 255); // alpha

    Anima.processing.background(0, 0, 0, 0);
    Anima.processing.stroke.apply(Anima.processing, color);

    var waves_frame_origin = window.innerHeight / 2 + 100;
    var previous_x = 0;
    var previous_y = buffer[0] * 1.5;

    var length = buffer.length;
    for(var i = 0; i < length; ++i) {
      var x = window.innerWidth * i / length;
      var y = buffer[i] * 1.5;
      Anima.processing.line(
        previous_x, waves_frame_origin - previous_y - 50,
        x, waves_frame_origin - y - 50
      );

      previous_x = x;
      previous_y = y;
    }

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
