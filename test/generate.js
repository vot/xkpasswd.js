require('chai').should();

var generate = require('../generate');
var util = require('util');

function splitIntoParts(password) {
  return password.split(/[^a-z]+/i);
}

describe('complexity options', function () {
  it('generates password without any argument', function () {
    var password = generate();
    password.should.not.be.null;
  });

  it('generates password with 3 parts by default', function () {
    var password = generate();
    splitIntoParts(password).length.should.be.equal(3);
  });

  /*
  xkpasswd -c 0 => oecology_headroom_metasomas
  xkpasswd -c 1 => bemingled_loll
  xkpasswd -c 2 => repertorial-papillulate-preceptorship
  xkpasswd -c 3 => platemaker.disembroiling.reflectorized.65
  xkpasswd -c 4 => panically.aspect.machicolations.purport.21
  xkpasswd -c 5 => psychobiological*denaturise*deciphers*dehydrogenises*cufflink*19
  xkpasswd -c 6 => 85?ILEAC?noria?SWEEPINGNESS?anthozoans?NECKCLOTH?67
  xkpasswd -c 7 => 21:MATTIFYING:rizzer:STATELINESSES:equivocations:PARAMASTOID:53
  */
  [3, 2, 3, 4, 5, 6, 7, 7].forEach(function (partsExpected, complexity) {
    var description = util.format('complexity %s produces %s parts password', complexity, partsExpected);
    it(description, function () {
      var password = generate({ complexity: complexity });
      splitIntoParts(password).length.should.be.equal(partsExpected);
    });
  });
});

describe('transform options', function () {
  it('"uppercase" transform produces all block letter parts', function () {
    var password = generate({ transform: 'uppercase' });
    splitIntoParts(password).forEach(function (part) {
      /\W+|[A-Z]+/.test(part).should.be.true;
    });
  });

  it('"lowercase" transform produces all block letter parts', function () {
    var password = generate({ transform: 'lowercase' });
    splitIntoParts(password).forEach(function (part) {
      /\W+|[a-z]+/.test(part).should.be.true;
    });
  });

  it('"alternate" transform produces all alternating casing parts', function () {
    var password = generate({ transform: 'alternate' });
    var expectUppercase = true;
    splitIntoParts(password).filter(function (part) {
      return part.match(/^[a-zA-Z]+$/);
    }).forEach(function (part) {
      if (expectUppercase) {
        part.should.match(/^[A-Z]+$/);
      } else {
        part.should.match(/^[a-z]+$/);
      }
      expectUppercase = !expectUppercase;
    });
  });
});

describe('custom word lists', function () {
  it('should accept an array as "wordList"', function () {
    var password = generate({ wordList: ['a', 'b', 'c'] });
    splitIntoParts(password).forEach(function (part) {
      /\W+|[a-z]+/.test(part).should.be.true;
    });
  });

  it('should accept a JSON file as "wordList"', function () {
    var password = generate({ wordList: __dirname + '/testWordList.json' });
    splitIntoParts(password).forEach(function (part) {
      /\W+|[a-z]+/.test(part).should.be.true;
    });
  });

  it('should accept a txt file as "wordList"', function () {
    var password = generate({ wordList: __dirname + '/testWordList.txt' });
    splitIntoParts(password).forEach(function (part) {
      /\W+|[a-z]+/.test(part).should.be.true;
    });
  });
});
