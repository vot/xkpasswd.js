var fs = require('fs');
var path = require('path');
var defaultWordList = require('./xkpasswd-words.json');

// define helpers
var h = {
  random: function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  getRandomWord: function getRandomWord(wordList) {
    return wordList[h.random(0, wordList.length - 1)];
  },

  resolveComplexity: function resolveComplexity(complexity) {
    // Patterns can consist of any combination of the following: (w)ords, (d)igits, (s)eparators
    var compl = complexity || 2;
    var rtn = {};
    rtn.separators = '#.-=+_';
    if (compl < 1) compl = 1;
    if (compl > 6) compl = 6;

    if (compl === 1) rtn.pattern = 'wsw';
    if (compl === 2) rtn.pattern = 'wswsw';
    if (compl === 3) rtn.pattern = 'wswswsdd';
    if (compl === 4) rtn.pattern = 'wswswswsdd';

    if (compl === 5) {
      rtn.pattern = 'wswswswswsdd';
      rtn.separators = '#.-=+_!$*:~?';
    }

    if (compl === 6) {
      rtn.pattern = 'ddswswswswswsdd';
      rtn.transform = 'alternate';
      rtn.separators = '#.-=+_!$*:~?%^&;';
    }

    return rtn;
  },

  processOpts: function processOpts(opts) {
    var rtn = {};

    var complexity = parseInt(opts.complexity, 10);
    complexity = typeof complexity === 'number' ? complexity : 3;

    var predefined = h.resolveComplexity(complexity);
    var separators = typeof opts.separators === 'string' ? opts.separators : predefined.separators;

    rtn.pattern = opts.pattern || predefined.pattern;
    rtn.separator = separators.split('')[h.random(0, separators.length - 1)];
    rtn.transform = opts.transform || predefined.transform || 'lowercase';
    rtn.wordList = opts.wordList;

    return rtn;
  },

  // this needs to support the following options:
  // 1) "words.json"
  // 2) "words.txt"
  // 3) "orange,banana, fizz, buzz" (string of comma-separated words)
  readCustomWordList: function readCustomWordList(input) {
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
          // eslint-disable-next-line
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
};

module.exports = function main(opts) {
  var o = h.processOpts(opts || {});
  var pattern = o.pattern.split('');
  var uppercase = (typeof o.transform === 'string' && o.transform.toLowerCase() === 'uppercase');
  var password = [];

  var wordList = defaultWordList;

  var customWordList = h.readCustomWordList(o.wordList);

  if (Array.isArray(customWordList) && customWordList.length) {
    wordList = customWordList;
  }

  pattern.forEach(function generatePasswordSegment(type) {
    var value;
    if (type === 'd') value = h.random(0, 9);
    if (type === 's') value = o.separator;
    if (type === 'w' || type === 'W') {
      value = h.getRandomWord(wordList);
      if (typeof o.transform === 'string' && o.transform.toLowerCase() === 'alternate') {
        uppercase = !uppercase;
      }
      if (uppercase || type === 'W') {
        value = value.toUpperCase();
      } else {
        value = value.toLowerCase();
      }
    }

    password.push(value);
  });

  return password.join('');
};
