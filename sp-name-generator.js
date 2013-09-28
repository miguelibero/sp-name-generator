
var SocialPointNameGenerator = (function () {
  var module = {};
  var settings = {
    adjectives: ['dark', 'monster', 'dragon', 'social', 'legendary'],
    oldAdjectives: ['super', 'crazy', 'jumping'],
    nouns: ['monsters', 'dragons','warriors', 'legends', 'city', 'kingdoms' ],
    oldNouns: ['dog', 'park', 'alien'],
    structures: [
      '%noun%',
      '%adjective% %structure%',
    ],
    oldChance: 0.3,
    uniqueStructureChance: 0.5,
    uniqueStructures: [
      '%structure% of %structure%',
      'Clash of %structure%',
      'League of %structure%',
      '%structure% Saga',
      '%structure% Wars',
      '%structure% Legacy',
      '%structure% Empires'
    ],
    oldUniqueStructures: [
      '%structure% Attack',
      '%structure% Master',
      '%structure% Paradise',
      '%structure% Madness'
    ],
    fonts: [ "Skranji", "Chango", "Kavoon", "Sansita One", "Erica One", "Shojumaru", "Boogaloo" ],
    boldChance: 0.5,
    strokeMaxWidth: 4,
    shadowChance: 0.3,
    shadowMaxOffset: 5,
    shadowMaxBlur: 5
  };

  var randomGrey = function() {
    var p = Math.floor(Math.random()*255).toString(16)
    return "#"+p+p+p;
  };

  var randomColor = function() {
    return "#"+Math.floor(Math.random()*16777215).toString(16);
  };

  var capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  var randomArrayElement = function (array) {
    return array[Math.floor(Math.random() * array.length)];
  };

  var getUniqueStruct = function (uniqueUsed) {
    var notUsed = [];
    var structs =  Math.random() > settings.oldChance ? settings.uniqueStructures : settings.oldUniqueStructures;
    for (var i in structs) {
      var struct = structs[i];
      if(uniqueUsed.indexOf(struct) == -1) {
        notUsed.push(struct);
      }
    }
    var struct = randomArrayElement(notUsed);
    uniqueUsed.push(struct);
    return struct;
  }
  var getStruct = function (uniqueUsed) {
    if (Math.random() > settings.uniqueStructureChance && settings.uniqueStructures.length > uniqueUsed.length) {
      return getUniqueStruct(uniqueUsed);
    } else {
      return randomArrayElement(settings.structures);
    }
  };

  var getNoun = function() {
    var nouns = Math.random() > settings.oldChance ? settings.nouns : settings.oldNouns;
    return capitalizeFirstLetter(randomArrayElement(nouns));
  };

  var getAdjective = function() {
    var adj = Math.random() > settings.oldChance ? settings.adjectives : settings.oldAdjectives;
    return capitalizeFirstLetter(randomArrayElement(adj));
  };

  var generateStruct = function (struct, uniqueUsed) {
    if (uniqueUsed === undefined) {
      uniqueUsed = [];
      struct = getUniqueStruct(uniqueUsed);
    } else if (struct === undefined) {
      struct = getStruct(uniqueUsed);
    }
    var map = {
      '%noun%' :      function() {
        return getNoun();
      },
      '%adjective%' : function() {
        return getAdjective();
      },
      '%structure%' : function() {
        return generateStruct(undefined, uniqueUsed);
      }
    };
    while (true) {
      var found = false;
      for (var k in map) {
        if (struct.indexOf(k) != -1) {
          struct = struct.replace(k, map[k]());
          found = true;
        }
      }
      if (!found) {
        break;
      }
    }
    return struct;
  }

  module.generate = function () {
    var struct = generateStruct();
    return struct;
  };

  module.generateHtml = function() {
    var name = this.generate();
    var css = {};

    if (Math.random() < settings.boldChance) {
      css['font-weight'] = 'bold';
    }
    css['font-family'] = randomArrayElement(settings.fonts)+", Arial, sans-serif";
    
    var textColor = randomColor();
    css['color'] = textColor;
    var strokeWidth = Math.round(Math.random()*settings.strokeMaxWidth);
    var strokeColor = textColor;
    while (strokeColor === textColor) {
      strokeColor = randomColor(textColor);
    }
    css["-webkit-text-stroke"] = ""+strokeWidth+"px " + strokeColor;
    css["-moz-text-stroke"] = css["-webkit-text-stroke"];
    if (Math.random() < settings.shadowChance) {
      var shadowOffset = Math.round(Math.random()*settings.shadowMaxOffset);
      var shadowBlur = Math.round(Math.random()*settings.shadowMaxBlur);
      var shadowColor = strokeColor;
      while (shadowColor === strokeColor) {
        shadowColor = randomGrey();
      }
      var xOri = Math.random() > 0.5 ? "" : "-";
      var yOri = Math.random() > 0.5 ? "" : "-";
      css["text-shadow"] = xOri + shadowOffset + "px " + yOri + shadowOffset + "px " + shadowBlur + "px " + shadowColor;
    }

    var html = '<span style="';
    for (var k in css ) {
      html += k+": "+css[k]+";";
    }
    html += '">'+name+'</span>';
    return html;
  }

  return module;
}());
