/*!
 * extend-proto
 * Copyright (c) 2016 Jeremiah Senkpiel
 * MIT Licensed
 */


/**
 * Expose `Proto`.
 */
module.exports = Proto


/**
 * Initialize a new `Proto` with the given `options`.
 *
 * @param {object} options
 * @return {middleware} for prototype extension
 * @public
 */
function Proto(protos, options) {
  var opts = options || {}

  if (!protos) {
    throw new TypeError('argument `protos` is required')
  }
  if (typeof protos !== 'object' || Array.isArray(protos)) {
    throw new TypeError('argument `protos` must be an object')
  }
  var _protos = Object.keys(protos)

  // default `configurable` to `true` so that properties may be overwriten
  opts.configurable = undefined === opts.configurable ? true : opts.configurable

  // default `enumerable` to `true` so that prototypes may be properly inspected
  opts.enumerable = undefined === opts.enumerable ? true : opts.enumerable

  /**
   * prototype extension middlware
   */
  var middleware = function setProto() {
    var i = arguments.length
    while (i--) {
      arguments[i].__proto__ = middleware[_protos[i]].proto
    }
  }

  // setup prototypes
  var i = _protos.length
  while (i--) {
    var name = _protos[i]
    var prop = middleware[name] = {
        proto: { __proto__: protos[name].prototype }
      , _opts: opts
    }
    prop.defineProperty = defineProperty.bind(prop)
    prop.defineProperties = defineProperties.bind(prop)
  }

  return middleware
}


/**
 * define a property onto the __proto__
 */
function defineProperty(name, descriptor) {
  if (!name) {
    throw new TypeError('argument `name` is required')
  }

  if (typeof name !== 'string') {
    throw new TypeError('argument `name` must be a string')
  }

  if (!descriptor) {
    throw new TypeError('argument `descriptor` is required')
  }

  if (typeof descriptor !== 'object' || Array.isArray(descriptor)) {
    throw new TypeError('argument `descriptor` must be an object')
  }

  // set user-defined options
  descriptor.configurable = this._opts.configurable
  descriptor.enumerable = this._opts.enumerable

  Object.defineProperty(this.proto, name, descriptor)
}


/**
 * define properties on __proto__ via an object map
 */
function defineProperties(props) {
  if (!props) {
    throw new TypeError('argument `props` is required')
  }

  if (typeof props !== 'object' || Array.isArray(props)) {
    throw new TypeError('argument `props` must be an object')
  }

  // set user-defined options
  for (var key in props) {
    props[key].configurable = this._opts.configurable
    props[key].enumerable = this._opts.enumerable
  }

  Object.defineProperties(this.proto, props)
}
