var chai = require('chai')
chai.should()
chai.use(require('chai-interface'))
var sinon = require('sinon')
chai.use(require('sinon-chai'))
var expect = chai.expect

var assert = require('../assert')


describe('assert', function () {

  it('constructs chains of assertions, fixes, and exceptions', function () {
    assert(true).error()

    assert(false).fix('sdf', function () {}).warn()

  })

  it('constructs an instanceof assert with or without `new` (normal usage is without)', function () {
    var assert1 = assert(true)
    assert1.should.be.instanceof(assert)

    var assert2 = new assert(true)
    assert2.should.be.instanceof(assert)
  })

  it('has interface', function () {
    assert(true).should.have.interface({
      fix: Function,
      error: Function,
      warn: Function,
      info: Function,
      report: Function,
      _condition: Boolean
    })
  })

  it('constructs an assert chain if called without arguments', function () {
    var chain = assert()
  })

  it('takes a boolean and remembers its value', function () {
    var a = assert(true)

    a._condition.should.equal(true)
  })

  describe('#fix', function () {
    it('returns this', function () {
      var a = assert(true)
      a.fix('', function (){}).should.equal(a)
    })
    it('sets fix continuation', function () {
      var fn = function () {}
      var a = assert(true).fix('fix', fn)
      a._fix.fn.should.equal(fn)
    })
    it('throws if no message is given', function () {
      expect(function () {
        assert(true).fix(function () {})
      }).to.throw(/message/)
    })
    it('throws if fix is not a function', function () {
      expect(function () {
        assert(true).fix('fs', 'fo')
      }).to.throw(/fn/)
    })
    it('throws if fix is called more than once on an assert chain', function () {
      expect(function () {
        assert(true).fix('a', function () {}).fix('b', function(){})
      }).to.throw(/once/)
    })
  })

  describe('#report', function () {
    it('terminates the chain', function () {
    })

    it('throws AssertReportError if condition is not true', function () {
      expect(function () {
        assert(false).report('foo', 'message')
      }).to.throw(assert.AssertReportError)
    })

    it('does not throw if the condition is true', function () {
      assert(true).report('end')
    })

    it('executes fix fn if there is one iff all conditions are false', function () {
      var fn = sinon.spy()
      assert(true).fix('fix', fn).error()

      fn.should.not.have.been.called

      try {
        assert(false).fix('fix', fn).error()
      } catch (e) {}

      fn.should.have.been.calledOnce

    })

    it('throws if fix throws', function () {
      expect(function () {
        assert(false).fix('asdf', function () { throw new Error() }).error()
      }).throw(/fix failed: asdf/)
    })

    it('throws if fix returns false', function () {
      expect(function () {
        assert(false).fix('asdf', function () { return false }).error()
      }).throw(/fix failed: asdf/)
    })


    it('does not throw if fix returns undefined', function () {
      expect(function () {
        assert(false).fix('asdf', function () {}).error()
      }).not.to.throw()
    })

    it('calls fix fn in context of assert.target object', function () {
      var a = assert(false)
      a.target = {}
      var fix = sinon.spy()

      a.fix('fix', fix).error()

      fix.should.have.been.calledOn(a.target)

    })
  })
  describe('#error', function () {
    it('is a partial application of #report where level = `error`', function () {
      var a = assert(true)
      a.report = sinon.spy()
      a.error('msg')

      a.report.should.have.been.calledWithExactly('error', 'msg')
    })
  })
  describe('#warn', function () {
    it('is a partial application of #report where level = `warn`', function () {
      var a = assert(true)
      a.report = sinon.spy()
      a.warn('msg')

      a.report.should.have.been.calledWithExactly('warn', 'msg')
    })

  })
  describe('#info', function () {
    it('is a partial application of #report where level = `info`', function () {
      var a = assert(true)
      a.report = sinon.spy()
      a.info('msg')

      a.report.should.have.been.calledWithExactly('info', 'msg')
    })
  })

})