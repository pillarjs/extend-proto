# extend-proto

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

A utility to inject a prototype chain, fully generic and adaptable.

This largely exists for performance. Injecting a single prototype with many properties on it has been historically faster than adding those properties to an existing instance.

```js
var http = require('http')
var proto = require('extend-proto')

var proto = Proto({
    req: http.IncomingMessage,
    res: http.ServerResponse
})
proto.req.defineProperty('kittens', { value: 'the best' })

http.createServer(function(req, res) {
  proto(req, res)

  req.kittens // the best
})

```


## [MIT Licensed](LICENSE)

[npm-image]: https://img.shields.io/npm/v/extend-proto.svg?style=flat
[npm-url]: https://npmjs.org/package/extend-proto
[node-version-image]: https://img.shields.io/node/v/extend-proto.svg?style=flat
[node-version-url]: http://nodejs.org/download/
[travis-image]: https://img.shields.io/travis/pillarjs/extend-proto.svg?style=flat
[travis-url]: https://travis-ci.org/pillarjs/extend-proto
[coveralls-image]: https://img.shields.io/coveralls/pillarjs/extend-proto.svg?style=flat
[coveralls-url]: https://coveralls.io/r/pillarjs/extend-proto?branch=master
[downloads-image]: https://img.shields.io/npm/dm/extend-proto.svg?style=flat
[downloads-url]: https://npmjs.org/package/extend-proto
