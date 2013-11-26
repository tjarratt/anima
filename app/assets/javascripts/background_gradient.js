var Anima = Anima || {};

Anima.update_background = (function() {
  var from_point, to_point;
  var can_haz_serious_business = true;

  return function() {
    var date = Anima.date_cache = new Date();

    $('#topGradientTransition,#bottomGradient').removeClass();
    var current_hour = date.getHours();
    var next_hour = (current_hour + 1) % 24;

    var percentage = (date.getMinutes() * 60 + date.getSeconds()) / 3600;
    $('#topGradientTransition').addClass('hour-' + current_hour);
    $('#topGradient').css('opacity', 1 - percentage);
    $('#bottomGradient').addClass('hour-' + next_hour);

    if (can_haz_serious_business && date.getHours() == 17 && date.getMinutes() >= 55) {
      from_point = {x: -280};
      to_point = {x: -20};
      can_haz_serious_business = false;

      var bznz = document.getElementById('srsbznz');
      var tween = new TWEEN.Tween(from_point)
        .to(to_point, 3000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function() {
          bznz.setAttribute('style', 'bottom:' + this.x + 'px');
        }).start();
    }
    else if (date.getHours() == 18 && date.getMinutes() >= 30) {
      to_point = {x: -280};
      from_point = {x: -20};
      can_haz_serious_business = false;

      var bznz = document.getElementById('srsbznz');
      var tween = new TWEEN.Tween(from_point)
        .to(to_point, 3000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function() {
          bznz.setAttribute('style', 'bottom:' + this.x + 'px');
        }).start();
    }
  };
})();
