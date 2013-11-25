var Anima = Anima || {};

Anima.update_background = function() {
  var date = Anima.date_cache = new Date();

  $('#topGradientTransition,#bottomGradient').removeClass();
  var current_hour = date.getHours();
  var next_hour = (current_hour + 1) % 24;

  var percentage = (date.getMinutes() * 60 + date.getSeconds()) / 3600;
  $('#topGradientTransition').addClass('hour-' + current_hour);
  $('#topGradient').css('opacity', 1 - percentage);
  $('#bottomGradient').addClass('hour-' + next_hour);
};
