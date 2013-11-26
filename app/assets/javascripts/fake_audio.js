var Anima = Anima || {};

Anima.sample_fake_audio = (function() {
  var theta = 0;
  var float_values = new Uint8Array(window.innerWidth);
  var waves_frame_origin = window.innerHeight / 2;

  return function() {
    var color = Anima.color_for_hour();

    Anima.processing.background(0, 0, 0, 0);
    Anima.processing.stroke.apply(Anima.processing, color);

    theta += 1;
    for (var i = 0; i < float_values.length; ++i) {
      float_values[i] = 100 + Math.sin((theta + i * 33) * 0.1) * 100;
    }

    var previous_x = -1;
    var previous_y = float_values[0] - 50;

    for(var j = 0; j < float_values.length; ++j) {
      Anima.processing.line(previous_x, waves_frame_origin + previous_y - 50, previous_x + j, waves_frame_origin + float_values[j] - 50);

      previous_x = previous_x + j;
      previous_y = float_values[j];
    }

    TWEEN.update();
    window.requestAnimationFrame(Anima.sample_fake_audio);
  };
})();

Anima.enable_fake_audio = function() {
  window.requestAnimationFrame(Anima.sample_fake_audio);
};
