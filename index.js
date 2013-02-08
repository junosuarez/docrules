var docrules = function() {
  if (!(this instanceof docrules)) {
    return new docrules()
  }

  this._patterns = []
}

var matcher = require('./match')

docrules.prototype.match = function (selector, body) {

  var rules = []

  function add(description, ruleFn) {
      rules.push({description: description, fn: ruleFn})
  }

  body(add)

  this._patterns.push({
    selector: selector,
    matcher: matcher(selector),
    rules: rules
  })

  return this;
}


docrules.FOR = 2
docrules.FOREACH = 4

docrules.prototype.for = function (selector, body) {

  var group = []

  function add(description, ruleFn) {
    group.push({description: description, fn: ruleFn})
  }

  body(add)

  // this._rules.push({
  //   type: docrules.FOR,
  //   selector: selector,
  //   group: group
  // })

  return this;
}

docrules.prototype.forEach = function (selector, body) {

  var group = []

  function add(description, rule) {
    group.push({description: description, rule: rule})
  }

  body(add)

  // this._rules.push({
  //   type: docrules.FOREACH,
  //   selector: selector,
  //   group: group
  // })

  return this;
}


docrules.prototype.run = function (document) {

  var report = []
  report.matches = 0
  report.rules = 0
  report.errors = []
  report.warnings = []

  this._patterns.forEach(function (pattern) {
    var matches = pattern.matcher(document)
    // console.log('pattern:', pattern, '\nmatches:',  matches)
    matches.forEach(function (match) {
      report.matches++
      pattern.rules.forEach(function (rule) {
        report.rules++
        var asserter = require('./assert').asserter(match.value)

        try {
          rule.fn.call(match.value, asserter.assert, match.path)
        } catch (e) {
          if (e.name === 'AssertReportError') {
            var record = {
              inner: e,
              selector: pattern.selector,
              path: match.path,
              value: match.value,
              rule: rule.description,
              level: e.level || 'error',
              message: e.message
            }
            report.push(record)
            if (record.level === 'error') {
              report.errors.push(record)
            } else if (record.level === 'warn') {
              report.warnings.push(record)
            }

          }
        }
      })
    })

  })

  return report;

}

module.exports = docrules