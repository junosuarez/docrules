var AssertReportError = function (level, message, inner) {
  this.name = "AssertReportError"
  this.level = level
  this.message = message || level
  if (inner) {
    this.inner = inner;
  }
}
AssertReportError.prototype = new Error()
AssertReportError.prototype = AssertReportError

var assert = function (condition) {
  if (!(this instanceof assert)) {
    return new assert(condition)
  }
  if (typeof condition !== 'boolean') {
    throw new Error('condition must be boolean value')
  }

  this._ = {
    conditions: [condition]
  }

}

assert.prototype.or = function (condition) {
  if (typeof condition !== 'boolean') {
    throw new Error('condition must be boolean value')
  }
  this._.conditions.push(condition)
  return this;
}

assert.prototype.fix = function (message, fn) {
  if (typeof message !== 'string') {
    throw new TypeError('message must be a string explaining the reason for applying the fix fn')
  }
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function')
  }

  if (this._.fix) {
    throw new Error('fix may only be called once in an assertion chain')
  }

  this._.fix = {message: message, fn: fn};

  return this;
}

assert.prototype.report = function (level, message) {
  if (this._.conditions.some(function(condition) {
    return condition === true
  })) {
    return;
  }

  if (this._.fix) {
    try {
      this._.fix.fn.call(this.target)
      /* fix was successful, no need to throw */
      return;
    } catch (e) {
      throw new AssertReportError(level, message + ' (fix failed: asdf: ' + e.message, e)
    }
  }

  throw new AssertReportError(level, message)

}

assert.prototype.error = function (message) {
  this.report('error', message)
}

assert.prototype.warn = function (message) {
  this.report('warn', message)
}

assert.prototype.info = function (message) {
  this.report('info', message)
}

var docrules = function() {
  if (!(this instanceof docrules)) {
    return new docrules()
  }
}

docrules.prototype.for = function (selector, body) {

  function it() {}
  function assert() {}

  body(it, assert)
}

docrules.prototype.forEach = function (selector, body) {

}

docrules.prototype.run = function (document) {

}





module.exports = docrules
module.exports.assert = assert
module.exports.AssertReportError = AssertReportError