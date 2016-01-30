var assert = require('assert')
var http = require('http')
var Proto = require('..')

describe('Proto', function () {
  var proto

  function A() {}
  function B() {}

  describe('General Functionality', function () {
    beforeEach(function () {
      proto = Proto({ A: A, B: B })
    })

    it('should have A & B objects', function () {
      assert(proto.A, 'did not set A')
      assert(proto.B, 'did not set B')
    })

    it('should have [obj].defineProperty', function () {
      assert('function' === typeof proto.A.defineProperty, 'did not set A.defineProperty')
      assert('function' === typeof proto.B.defineProperty, 'did not set B.defineProperty')
    })

    it('should have [obj].defineProperties', function () {
      assert('function' === typeof proto.A.defineProperties, 'did not set A.defineProperties')
      assert('function' === typeof proto.B.defineProperties, 'did not set B.defineProperties')
    })

    it('should preserve parent __proto__ type', function () {
      var a = {}
      var b = {}
      proto(a, b)

      assert(a instanceof A, 'a was not an instance of A')
      assert(b instanceof B, 'b was not an instance of B')
    })

  })

  describe('defineProperty', function () {
    beforeEach(function () {
      proto = Proto({ A: A, B: B })
    })

    it('should throw if `name` is not provided', function () {
      assert.throws(proto.A.defineProperty, 'defineProperty must throw if name is undefined')
    })

    it('should throw if `name` is not a string', function () {
      assert.throws(function () {
        proto.A.defineProperty(3)
      }, 'defineProperty must throw if name is not a string')
    })

    it('should throw if `descriptor` is not provided', function () {
      assert.throws(function () {
        proto.A.defineProperty('hello')
      }, 'defineProperty must throw if name is undefined')
    })

    it('should throw if `descriptor` is not an object', function () {
      assert.throws(function () {
        proto.A.defineProperty('llamas', 'nope')
      }, 'defineProperty must throw if name is undefined')
    })

    it('should set __proto__ properties', function () {
      proto.A.defineProperty('kittens', { value: 'the best' })
      proto.B.defineProperty('the moon', { value: 1 })

      var a = { body: {} }
      var b = { send: function (){} }
      proto(a, b)

      assert.strictEqual('the best', a.kittens, 'did not correctly set kittens :(')
      assert.strictEqual('the best', a.__proto__.kittens, 'did not set kittens on __proto__ :(')
      assert.strictEqual(1, b['the moon'], 'did not correctly set "the moon" :(')
      assert.strictEqual(1, b.__proto__['the moon'], 'did not set "the moon" on __proto__ :(')
    })
  })

  describe('defineProperties', function () {
    beforeEach(function () {
      proto = Proto({ A: A, B: B })
    })

    it('should throw if `props` is not provided', function () {
      assert.throws(proto.A.defineProperties, 'defineProperty must throw if name is undefined')
    })

    it('should throw if `props` is not an object', function () {
      assert.throws(function () {
        proto.A.defineProperties(2)
      }, 'defineProperty must throw if name is undefined')
    })

    it('should set __proto__ properties', function () {
      proto.A.defineProperties({
          'kittens': { value: 'the best' }
        , 3: { value: 'not 3' }
      })

      proto.B.defineProperties({
        'the moon': { value: 1 }
      })

      var a = { body: {} }
      var b = { send: function (){} }
      proto(a, b)

      assert.strictEqual('the best', a.kittens, 'did not correctly set kittens :(')
      assert.strictEqual('the best', a.__proto__.kittens, 'did not set kittens on __proto__ :(')
      assert.strictEqual('not 3', a[3], 'did not correctly set 3 :(')
      assert.strictEqual('not 3', a.__proto__[3], 'did not set 3 on __proto__ :(')
      assert.strictEqual(1, b['the moon'], 'did not correctly set "the moon" :(')
      assert.strictEqual(1, b.__proto__['the moon'], 'did not set "the moon" on __proto__ :(')
    })
  })

  describe('options', function () {

    describe('configurable', function () {

      it('should override property descriptors', function () {
        proto = Proto({ A: A, B: B }, { configurable: false })

        proto.A.defineProperty('kittens', {
            value: 'the best'
          , configurable: true
        })
        proto.B.defineProperties({
          'the moon': {
              value: 1
            , configurable: true
          }
        })

        var a = {}
        var b = {}
        proto(a, b)

        delete a.__proto__.kittens
        delete b.__proto__['the moon']

        assert.strictEqual('the best', a.kittens, 'kittens was overwritten :(')
        assert.strictEqual(1, b['the moon'], '"the moon" was overwritten :(')
      })

      it('should default to true', function () {
        proto = Proto({ A: A, B: B })

        proto.A.defineProperty('kittens', {
            value: 'the best'
          , configurable: false
        })
        proto.B.defineProperties({
          'the moon': {
              value: 1
            , configurable: false
          }
        })

        var a = {}
        var b = {}
        proto(a, b)

        delete a.__proto__.kittens
        delete b.__proto__['the moon']

        assert.strictEqual(undefined, a.kittens, 'kittens was overwritten :(')
        assert.strictEqual(undefined, b['the moon'], '"the moon" was overwritten :(')
      })
    })

    describe('enumerable', function () {

      it('should override property descriptors', function () {
        proto = Proto({ A: A, B: B }, { enumerable: false })

        proto.A.defineProperty('kittens', {
            value: 'the best'
          , enumerable: true
        })
        proto.B.defineProperties({
          'the moon': {
              value: 1
            , enumerable: true
          }
        })

        var a = {}
        var b = {}
        proto(a, b)

        assert.strictEqual(-1, Object.keys(a).indexOf('kittens'), 'kittens was enumerable :(')
        assert.strictEqual(-1, Object.keys(b).indexOf('the moon'), '"the moon" was enumerable :(')

        assert.strictEqual('the best', a.kittens, 'kittens was not set properly :(')
        assert.strictEqual(1, b['the moon'], '"the moon" was not set properly :(')
      })

      it('should default to true', function () {
        proto = Proto({ A: A, B: B })

        proto.A.defineProperty('kittens', {
            value: 'the best'
          , enumerable: false
        })
        proto.B.defineProperties({
          'the moon': {
              value: 1
            , enumerable: false
          }
        })

        var a = {}
        var b = {}
        proto(a, b)

        assert.strictEqual(true, -1 !== Object.keys(a.__proto__).indexOf('kittens'), 'kittens was not enumerable :(')
        assert.strictEqual(true, -1 !== Object.keys(b.__proto__).indexOf('the moon'), '"the moon" was not enumerable :(')

        assert.strictEqual('the best', a.kittens, 'kittens was not set properly :(')
        assert.strictEqual(1, b['the moon'], '"the moon" was not set properly :(')
      })
    })

  })
})
