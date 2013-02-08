var chai = require('chai')
chai.should()
var tracery = require('tracery')

describe('example', function () {
  it('does this', function () {

    var docrules = require('../index')

    var rules = docrules()

    rules.match('users.*', function (user) {

      user('should have a first and last name', function (assert) {
        assert(true, this.firstName && this.lastName)
          .error('first and/or last name are blank')
      })

      user('should like star wars', function (assert) {
        assert(this.likesStarWars)
          .fix('yes, you do', function () { this.likesStarWars = true })
          .error('the universe is wrong.')
      })

      user('schema', function (assert) {

        var User = tracery({
          lastName: String,
          firstName: String,
          age: Number
        })

        assert(User(this))
          .error('not a user')

      })

    })

    var data = {
      users: {
        a:{
          firstName: 'Alfred',
          lastName: 'Doolittle',
          age: 10
        },
        b:{
          firstName: 'Bertha',
          lastName: 'Cortez'
        }
      }
    }


    var report = rules.run(data)
    console.log('report: \n',report)
    // console.log('report', report.length, report)
    // console.log(require('util').inspect(rules, true, 5))
    // console.log(data)
  })
})