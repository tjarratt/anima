var Anima = Anima || {};

Anima.color_for_hour = function() {
  var hour = Anima.date_cache.getHours();
  var color;

  if (hour < 5) {
    color = [230, 230, 230];
  }
  else if (hour < 8) {
    color = [175, 175, 175];
  }
  else if (hour < 16) {
    color = [95, 95, 95];
  }
  else {
    color = [230, 230, 230];
  }

  return Anima.processing.color(color);
};
