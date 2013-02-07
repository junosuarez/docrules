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

  it('constructs an object with interface', function () {
    docrules().should.have.interface({
      'for': Function,
      forEach: Function,
      run: Function
    })
  })

  describe('#for', function () {
    // for(selector, body) : void
    // body(it, assert)

    it('calls the body function with two functions, `it` and `assert`', function () {
      var body = sinon.spy()
      var rules = docrules()

      rules.for('foo', body)

      body.should.have.been.calledOnce

      body.firstCall.args[0].should.be.a('function')
      body.firstCall.args[1].should.be.a('function')

    })
  })

  describe('#forEach', function () {})

  describe('#run', function () {})

  describe('.assert', function () {
    var assert = docrules.assert
    it('constructs chains of assertions, fixes, and exceptions', function () {
      assert(true).error()

      assert(false).or(false).fix('sdf', function () {}).warn()

      assert(false).or(true).error()

    })

    it('constructs an instanceof assert with or without `new` (normal usage is without)', function () {
      var assert1 = assert(true)
      assert1.should.be.instanceof(assert)

      var assert2 = new assert(true)
      assert2.should.be.instanceof(assert)
    })

    it('has interface', function () {
      assert(true).should.have.interface({
        or: Function,
        fix: Function,
        error: Function,
        warn: Function,
        info: Function,
        report: Function,
        _: {conditions: Array}
      })
    })

    it('takes a condition and initializes a .conditions array', function () {
      var a = assert(true)

      a._.conditions.should.deep.equal([true])
    })

      it('must be called with a boolean condition', function () {
        expect(function () {
          assert()
        }).to.throw('boolean')
        expect(function () {
          assert('')
        }).to.throw('boolean')
        expect(function () {
          assert({})
        }).to.throw('boolean')
        expect(function () {
          assert(1)
        }).to.throw('boolean')
        expect(function () {
          assert([])
        }).to.throw('boolean')
        expect(function () {
          assert(undefined)
        }).to.throw('boolean')
      })

    describe('#or', function () {
      it('must be called with a boolean condition', function () {
        expect(function () {
          assert(true).or()
        }).to.throw('boolean')
        expect(function () {
          assert(true).or('')
        }).to.throw('boolean')
        expect(function () {
          assert(true).or({})
        }).to.throw('boolean')
        expect(function () {
          assert(true).or(1)
        }).to.throw('boolean')
        expect(function () {
          assert(true).or([])
        }).to.throw('boolean')
        expect(function () {
          assert(true).or(undefined)
        }).to.throw('boolean')
      })
      it('returns this', function () {
        var a = assert(true)
        a.or(true).should.equal(a)
      })

      it('adds a condition to conditions', function () {
        var a = assert(true).or(false)
        a._.conditions.should.deep.equal([true, false])
      })
    })

    describe('#fix', function () {
      it('returns this', function () {
        var a = assert(true)
        a.fix('', function (){}).should.equal(a)
      })
      it('sets fix continuation', function () {
        var fn = function () {}
        var a = assert(true).fix('fix', fn)
        a._.fix.fn.should.equal(fn)
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

      it('throws AssertReportError if conditions are not true', function () {
        expect(function () {
          assert(false).report('foo', 'message')
        }).to.throw(docrules.AssertReportError)
        expect(function () {
          assert(false).or(false).report('foo', 'message')
        }).to.throw(docrules.AssertReportError)
        expect(function () {
          assert(false).or(false).or(false).report('foo', 'message')
        }).to.throw(docrules.AssertReportError)
      })

      it('does not throw if any of the conditions is true', function () {
        assert(true).report('end')
        assert(false).or(true).report('end')
        assert(true).or(false).report('end')
        assert(false).or(false).or(true).report('end')
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
})