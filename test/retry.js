var co = require('co')
var koa = require('koa')
var route = require('koa-route')

var request = require('..')

describe('cogent-retry', function () {

  var app = koa()
  var requests = 0
  var uri = "http://localhost:"

  app.use(route('/', error))

  function* error () {
    requests++;
    if (requests < 4) this.status = 503
    else this.status = 204	
  }	
   
  it('server should start', function (done) {
    app.listen(function (err) {
      if (err) return done(err)
      uri += this.address().port
      done()
    })
  })  
   
  it('should retry on error', co(function* () {
  	var res = yield* request(uri, {
  	  retries: 4	
  	})
  	res.statusCode.should equal(204)
  }))
})

