var fs = require('fs');
var path = require('path');
var defaultWordList = require('./xkpasswd-words.json');

// define helpers
var h = {
  random: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  getRandomWord: function (wordList) {
    return wordList[h.random(0, wordList.length - 1)];
  },

  resolveComplexity: function (complexity) {
    // Patterns can consist of any combination of the following: (w)ords, (d)igits, (s)eparators
    complexity = complexity || 2;
    var rtn = {};
    rtn.separators = '#.-=+_';
    if (complexity < 1) complexity = 1;
    if (complexity > 6) complexity = 6;

    if (complexity === 1) rtn.pattern = 'wsw';
    if (complexity === 2) rtn.pattern = 'wswsw';
    if (complexity === 3) rtn.pattern = 'wswswsdd';
    if (complexity === 4) rtn.pattern = 'wswswswsdd';

    if (complexity === 5) {
      rtn.pattern = 'wswswswswsdd';
      rtn.separators = '#.-=+_!$*:~?';
    }

    if (complexity === 6) {
      rtn.pattern = 'ddswswswswswsdd';
      rtn.transform = 'alternate';
      rtn.separators = '#.-=+_!$*:~?%^&;';
    }

    return rtn;
  },

  processOpts: function (opts) {
    var rtn = {};

    opts.complexity = parseInt(opts.complexity);
    opts.complexity = typeof opts.complexity === 'number' ? opts.complexity : 3;

    var predefined = h.resolveComplexity(opts.complexity);
    var separators = typeof opts.separators === 'string' ? opts.separators : predefined.separators;

    rtn.pattern = opts.pattern || predefined.pattern;
    rtn.separator = separators.split('')[h.random(0, separators.length - 1)];
    rtn.transform = opts.transform || predefined.transform || 'lowercase';

    return rtn;
  },

  // this needs to support the following options:
  // 1) "words.json"
  // 2) "words.txt"
  // 3) "orange,banana, fizz, buzz" (string of comma-separated words)
  readCustomWordList: function (input) {
    var data;
    var rtn = [];

    if (Array.isArray(input)) {
      data = input;
    }

    // parse string input
    if (typeof input === 'string') {
      var tmpWordList = input.split(',');

      if (tmpWordList.length === 1) {
        var targetFile = path.resolve(tmpWordList[0]);

        if (targetFile.indexOf('.json') === targetFile.length - 5) {
          data = require(targetFile);
        }

        if (targetFile.indexOf('.txt') === targetFile.length - 4) {
          var fileContents = fs.readFileSync(targetFile).toString();
          data = fileContents.split('\n');
        }
      }

      if (!data) {
        data = tmpWordList;
      }
    }

    // if there's no data return false
    if (!data) {
      return false;
    }

    // remove empty
    for (var i = 0; i < data.length; i++) {
      var word = typeof data[i] === 'string' ? data[i].trim() : '';
      if (word.length) {
        rtn.push(word);
      }
    }

    return rtn;
  }
}

module.exports = function (opts) {
  opts = opts || {};
  var o = h.processOpts(opts);
  var pattern = o.pattern.split('');
  var uppercase = (o.transform && o.transform == 'uppercase');
  var password = [];

  var wordList = defaultWordList;

  var customWordList = h.readCustomWordList(opts.wordList);

  if (Array.isArray(customWordList) && customWordList.length) {
    wordList = customWordList;
  }

  pattern.forEach(function (type) {
    var value;
    if (type === 'd') value = h.random(0, 9);
    if (type === 's') value = o.separator;
    if (type === 'w' || type == 'W') {
      value = h.getRandomWord(wordList);
      if (o.transform && o.transform == 'alternate') uppercase = !uppercase;
      if (uppercase || type == 'W') {
        value = value.toUpperCase();
      } else {
        value = value.toLowerCase();
      }
    }

    password.push(value);
  });

  return password.join('');
};
