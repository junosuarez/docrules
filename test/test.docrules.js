var chai = require('chai')
chai.should()
chai.use(require('chai-interface'))
var sinon = require('sinon')
chai.use(require('sinon-chai'))
var expect = chai.expect

var docrules = require('../index')

describe('docrules', function () {
  it('returns instanceof docrules with or without `new`', function () {
    var rules = docrules()
    rules.should.be.instanceof(docrules)

    var rules2 = new docrules()
    rules2.should.be.instanceof(docrules)
  })

  it('has interface', function () {

    docrules.should.have.interface({
      FOR: Number,
      FOREACH: Number
    })

    docrules.FOR === 2
    docrules.FOREACH === 4
  })

  it('constructs an object with interface', function () {
    docrules().should.have.interface({
      match: Function,
      run: Function,
      _patterns: Array
    })
  })

  describe('#match', function () {
    // for(selector, body) : void
    // body(it, assert)

    it('returns this', function () {
      var rules = docrules()

      rules.match('foo', function () {}).should.equal(rules)
    })

    it('calls the body to parse the rule group and adds it to _rules', function () {
      var rules = docrules()
      var called = false;

      var rule = sinon.spy()

      rules.match('selector', function (it) {
        called = true;

        it.should.be.a('function')

        it('description', rule)

      })

      called.should.equal(true)

      var pattern = rules._patterns[0]

      pattern.selector.should.equal('selector')
      pattern.rules.should.deep.equal([{
        description: 'description',
        fn: rule
      }])

      rule.should.not.have.been.called

    })

  })

  describe('#run', function () {

    var rules = docrules().forEach('users', function (each) {
      each('user should have an email address', function (user, assert) {
        assert(/[a-z]+@[a-z]+\.com/.test(user.email))
          .error('bad email address')
      })
    })

    var doc = {
      users: {
        bob: {email: 'dsfo'},
        sue: {email: 's@j.com'},
        bear: {email: 'n/a'}
      }
    }

    rules.run()


    it('calls each rule for each matching item')

  })

})