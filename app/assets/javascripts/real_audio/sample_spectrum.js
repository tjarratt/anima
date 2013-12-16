var Anima = Anima || {};

Anima.spectrumBuffer = (function() {
  var xDivisions = 40;
  var yDivisions = 25;
  var strokeColor = [255,255,255];
  var fillColor = [255,255,255];

  var spectrumBuffer = new Array(xDivisions);
  for (var i = 0; i < xDivisions; ++i) {
    spectrumBuffer[i] = [];
    for (var j = 0; j < yDivisions; ++j) {
      spectrumBuffer[i][j] = 0;
    }
  }

  var average = function(array) {
    var sum = 0;
    var length = array.length;
    for(var i = 0; i < length; ++i) { sum += array[i]; }
    return Math.round(sum / length * 100) / 100;
  };

  spectrumBuffer.groupedAveragesFromBuffer = function (buffer, numGroups) {
    var averages = [];
    var groupSize = Math.ceil(buffer.length / numGroups);
    for (var i = 0; i < numGroups; i++) {
      var group = buffer.subarray(groupSize * i, groupSize * (i + 1));
      averages[i] = average(group);
    }
    return averages;
  };

  spectrumBuffer.sampleFromBuffer = function sampleFromBuffer(buffer) {
    var groupedAverages = this.groupedAveragesFromBuffer(buffer, yDivisions);
    var momentSpectrum = new Array(yDivisions);

    for (var i = 0; i < yDivisions; i++) {
      momentSpectrum[i] = groupedAverages[i];
    }
    spectrumBuffer.shift();
    spectrumBuffer.push( momentSpectrum );
  };

  spectrumBuffer.setStrokeColor = function setStrokeOpacity(color) {
    strokeColor = color;
  };

  spectrumBuffer.draw = function draw(processing) {
    var width = window.innerWidth / xDivisions;
    var height = window.innerHeight / 2 / yDivisions;
    for(i = 0; i < xDivisions; ++i) {
      for(j = 0; j < yDivisions; ++j) {
        var x = width * i;
        var y = height * j;

        var opacity = spectrumBuffer[i][j];

        processing.fill.apply(processing, fillColor.concat(opacity));
        processing.stroke.apply(processing, strokeColor.concat(opacity));

        processing.rect(x, y, width, height);
        processing.rect(x, window.innerHeight - y - height, width, height);
      }
    }
  };

  return spectrumBuffer;
}) ();
