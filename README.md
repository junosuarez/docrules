# docrules
pattern matching assertion framework for documents

try it with [tracery](https://npm.im/tracery)!

(work in progress, see `test/example.js` or ask Jason. Not yet ready for public release)

## usage

docrules defines sets of `rules` grouped by `selectors`. Rule sets can then be run on a document to generate a report of errors, warnings, and info.

    var docrules = require('docrules')

first we create a rule set

    var rules = new docrules()

Now add a matching selector. Selectors use mongodb style dot notation. A wildcard `*` can be used to match any key at that level.

`rules.match(selector, (ruleCb) => void)`

The second argument of `rules.match` is a function which takes a ruleCallback. This ruleCallback is used to define rules which should be run on each item which matches the `selector`

    rules.match('users.*', function (user) {

We define a rule like so:

      user('should have an ID', function (assert) {

Rule callbacks require a label (shown in the report if the rule reports an error, warning, or info), and a body function defining the rule. The body function is passed an `assert` function which should be used to ensure proper reporting. Other assertion libraries should not be used at this time (see the `run` function implementation of `index.js` if you want to hack it in). `this` is bound to the matching value, in this case, a user object.

        assert(this.hasOwnProperty(id))
        .error()

      })

## assertion

Assertions are called as chains. They require a condition and a report, and may have a fix in between.

    assert(condition)
      .report('level','message')

or

    assert(condition)
      .fix('label', function() {})
      .report('level','message')

There are three aliases for `.report` which pre-fill the label for you - normally you will use this:

    .error('message')
    .warn('message')
    .info('message')

Note the assertion will not throw if you do not call a report function, even if the condition fails. (This may change in future versions)

## running the ruleset

After we've created a ruleset, added some match groups, and defined some rules, we can run these by calling

    var report = ruleset.run(document)

The resulting report is an array which looks like this:

   [ { inner:
       { name: 'AssertReportError',
         level: 'error',
         message: 'not a user' },
      selector: 'users.*',
      path: [ 'users', 'b' ],
      value: { firstName: 'Bertha', lastName: 'Cortez', likesStarWars: true },
      rule: 'schema',
      level: 'error',
      message: 'not a user' } ]

With these additional properties:

   {
    matches: 2,
    rules: 6,
    errors: [ { inner: [Object],
        selector: 'users.*',
        path: [Object],
        value: [Object],
        rule: 'schema',
        level: 'error',
        message: 'not a user' } ],
    warnings: [] }

For a full end-to-end, see `test/example.js`

## license
internal (c) 2013 Agile Diagnosis.