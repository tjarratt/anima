var Anima = Anima || {};

Anima.color_for_hour = function() {
  var hour = Anima.date_cache.getHours();

  if (hour < 5) {
    return [230, 230, 230];
  }
  else if (hour < 8) {
    return [175, 175, 175];
  }
  else if (hour < 16) {
    return [95, 95, 95];
  }
  else {
    return [230, 230, 230];
  }
};
