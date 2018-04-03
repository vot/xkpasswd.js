# xkpasswd

[![NPM Version][npm-img]][npm-url]
[![NPM Downloads][npm-dl-img]][npm-url]
[![Build status][circle-img]][circle-url]
[![Coveralls coverage][coveralls-img]][coveralls-url]

[npm-url]: https://npmjs.org/package/xkpasswd
[npm-img]: https://img.shields.io/npm/v/xkpasswd.svg
[npm-dl-img]: https://img.shields.io/npm/dm/xkpasswd.svg
[circle-img]: https://img.shields.io/circleci/project/github/vot/xkpasswd-node/master.svg
[circle-url]: https://circleci.com/gh/vot/xkpasswd-node/tree/master
[coveralls-img]: https://img.shields.io/coveralls/vot/xkpasswd-node.svg
[coveralls-url]: https://coveralls.io/github/vot/xkpasswd-node


*Memorable password generator, inspired by a PERL module powering xkpasswd.net/s/*

Also available in Go: [xkpasswd-go](https://github.com/vot/xkpasswd-go)


## Using as a node module

You can use xkpasswd as a module in your application.

**EXAMPLE**

```
var xkpasswd = require('xkpasswd');

console.log(xkpasswd());
valuable=bear=difference=53

console.log(xkpasswd({complexity: 5, separators: '#+-'}));
addition#wheat#congress#manner#lonely#20

console.log(xkpasswd({wordList: __dirname + '/myWordList.json'}));
apple#grape#banana

```


## Using as a command in terminal

You can also use xkpasswd command in your terminal if you install the package
globally (`npm install xkpasswd -g`).

**CLI OPTIONS**

```
xkpasswd --complexity <number> --separators <string> --pattern <string> --transform <string> --number <number> --wordList <string>
```

`xkp` alias for is also provided for convenience.
You can use it interchangeably with `xkpasswd` command.

<br />

You can specify `complexity` argument in accordance with [complexity levels table](#complexity-levels). Defaults to 2.

If specified `pattern` argument overrides the [pattern](#patterns) derived from complexity level.

If `separators` are provided they are used instead of the standard set (see complexity levels).
One separator is used per password, picked randomly from the provided set.

You can set `transform` option to `alternate` or `uppercase` to trigger case transformation.

To generate multiple passwords at once you can specify the desired
amount with the `number` argument. Defaults to 1.

Finally if you'd like to use a custom list of words you can provide it
as a JSON file, text file or an array via `wordList` function.

<br />

**Using hyphen (`-`) as a separator**

Due to the way the arguments are parsed make sure to use equals sign instead of space
if you'd like to use a hyphen (`-`) as your separator: `xkpasswd -s=-`.

<br />

**EXAMPLE** Default behaviour

```
$ xkpasswd
hide+threw+money+61
```

**EXAMPLE** Specify complexity

```
$ xkpasswd -c 5
join=industrial=wide=direction=lungs=16

$ xkpasswd -c 6
57!FIFTHLY!astronauts!AFFECTEDLY!nymphs!TRUSTLESSNESSES!06
```

**EXAMPLE** Specify custom pattern

```
$ xkpasswd -p wdwd

adjective3solar6
```

**EXAMPLE** Specify custom word list / dictionary

```
$ xkpasswd -wordList myWordList.json

orange.apple.banana
```

```
$ xkpasswd -dict myWordList.txt

kiwi-strawberry-grape
```

**EXAMPLE** Specify complexity, custom separators and number of passwords

```
$ xkpasswd -c 3 -s '#!+' -n 5

dog!friend!successful!47
other#sell#close#01
hyperspatial+polyvalences+inquirendo+03
war#reassemble#inventress#93
gainsays+illumes+discontiguity+86
```


## Patterns

Patterns can consist of any combination of words, digits and separators.
The first letters (**w**, **d** and **s** respectively) are used in pattern string provided to the password generation function.

For example:

* `w` will return a single word (i.e. `demographics`). Use `w` for lowercase and `W` for uppercase.
* `wsd` will return a word and a digit, separated by one of the permitted separators (i.e. `storm#7`)
* `wswsdd` will return two words followed by a two digit number, all with separators between (i.e. `delates+dissembled+16`)



## Complexity levels

There are 6 complexity levels specified which can be used to provide
default patterns as well as trigger additional features, such as alternate casing
between words and expanded sets of separators.


| Complexity | Pattern         | Separators       |
|------------|-----------------|------------------|
| 1          | wsw             | #.-=+_           |
| 2          | wswsw           | #.-=+_           |
| 3          | wswswsdd        | #.-=+_           |
| 4          | wswswswsdd      | #.-=+_           |
| 5          | wswswswswsd     | #.-=+_!$*:~?     |
| 6          | ddswswswswswsdd | #.-=+_!$*:~?%^&; |

In addition level 6 alternates upper and lower case between words.

## Release notes

v1.0.5

- Added support for custom word lists
- Improved linting profile


v1.0.4

- Added Coveralls integration and badge


v1.0.3

- Added tests and linting (thanks @yogendra)


v1.0.2

- Added transform option (thanks @yogendra)


v1.0.1

- Using a cleaned up list of words


v1.0.0

- updated complexity levels
- fixed uppercase/lowercase transformation
- cleaned up code and documentation
