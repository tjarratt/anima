var Anima = Anima || {};

Anima.sample_microphone = (function() {
  var buffer = new Uint8Array(512);
  var historyBuffer = new Array(4096);
  for (var i = 0; i < historyBuffer.length; ++i) {
    historyBuffer[i] = 0;
  }

  return function sampleAudio() {
    Anima.sampler.getByteFrequencyData(buffer);

    var avg = Math.average(buffer);
    var color = Anima.color_for_hour();
    color.push(avg / 75 * 255); // alpha

    Anima.processing.background(0, 0, 0, 0);
    Anima.processing.stroke.apply(Anima.processing, color);

    var sum = 0;
    var bufferLength = buffer.length;
    for(var i = 0; i < bufferLength; ++i) { sum += buffer[i]; }

    var moment = sum / (255 * bufferLength) * 500;
    historyBuffer.shift();
    historyBuffer.push(moment);

    Anima.processing.fill.apply(null, color);
    Anima.processing.beginShape();

    var x, y,
        previous_x = 0,
        previous_y = buffer[0] * 1.5,
        waves_frame_origin = window.innerHeight / 2;

    var historyLength = historyBuffer.length;
    for(i = 0; i < historyLength; ++i) {
      x = window.innerWidth * i / bufferLength;
      y = (buffer[i] === undefined) ? 0 : buffer[i] * 1.5;

      Anima.processing.vertex(window.innerWidth * i / historyLength, waves_frame_origin - historyBuffer[i]);
      Anima.processing.line(previous_x, waves_frame_origin + previous_y,
                            x, waves_frame_origin + y);

      previous_x = x, previous_y = y;
    }

    Anima.processing.vertex(x, waves_frame_origin);
    Anima.processing.vertex(0, waves_frame_origin);
    Anima.processing.endShape();

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
