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

var assert = function (guard) {
  if (!(this instanceof assert)) {
    return new assert(guard)
  }
  this._condition = Boolean(guard);
}

assert.prototype.fix = function (message, fn) {
  if (typeof message !== 'string') {
    throw new TypeError('message must be a string explaining the reason for applying the fix fn')
  }
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function')
  }

  if (this._fix) {
    throw new Error('fix may only be called once in an assertion chain')
  }

  this._fix = {message: message, fn: fn};

  return this;
}

assert.prototype.report = function (level, message) {
  if (this._condition) return;

  if (this._fix) {
    try {
      var res = this._fix.fn.call(this.target)
      if (res === false) {
        throw new AssertReportError(level, message + ' (fix failed: ' + this._fix.message + ')')
      }
      /* fix was successful, no need to throw */
      return;
    } catch (e) {
      throw new AssertReportError(level, message + ' (fix failed: ' + this._fix.message + ': ' + e.message + ')', e)
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

var asserter = function (target) {
  if (!(this instanceof asserter)) {
    return new asserter(target)
  }
  this.target = target

  this.assert = function (guard) {
    var a = assert(guard)
    a.target = target
    return a
  }
}

module.exports = assert
module.exports.asserter = asserter
module.exports.AssertReportError = AssertReportError