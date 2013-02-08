var chai = require('chai')
chai.should()
var tracery = require('tracery')

var match = require('../match')

describe('match', function () {

  it('takes a selector and returns a parser', function () {

    var parser = match('foo.bar')

    parser.should.be.a('function')

  })

  describe('parsers', function () {
    it('takes an object and returns an array of matches', function () {
      var m = match('platypus.ostrich')({
        platypus: {
          ostrich: {
            enemies: false
          },
          tiger: {
            enemies: true
          }
        }
      })

      m.should.deep.equal([{path: ['platypus','ostrich'], value: {enemies: false}}])
    })

    it('supports wildcards for objects', function () {
      var m = match('animals.*.size')({
        animals: {
          ostrich: {size: 4},
          'kangaroo rat': {size: 3},
          owl: {size: 2},
          'blue whale': {size: 80},
          megalodon: {size: 100}
        }
      })

      m.should.deep.equal([
        {path: ['animals','ostrich','size'], value: 4},
        {path: ['animals','kangaroo rat','size'], value: 3},
        {path: ['animals','owl','size'], value: 2},
        {path: ['animals','blue whale','size'], value: 80},
        {path: ['animals','megalodon','size'], value: 100}
      ].reverse(/* order doesnt actually matter */))
    })

    it('works on arrays', function () {
      var m = match('a.*.c')({
        a: [{c: 1}, {c: 2}, {c: 3}]
      })

      m.should.deep.equal([ { path: [ 'a', '2', 'c' ], value: 3 },
  { path: [ 'a', '1', 'c' ], value: 2 },
  { path: [ 'a', '0', 'c' ], value: 1 } ])
    })

    it('works with multiple wildcards', function () {
      var m = match('a.*.c.*')({
        a: {
          b: {
            c: ['d','dee']
          },
          B: {
            c: ['D','DEE']
          },
          β: {
            c: ['gamma','GAMMA']
          }
        }
      })

      m.length.should.equal(6)
    })
  })


})