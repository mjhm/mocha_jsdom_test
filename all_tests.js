

var jsdom = require('jsdom');
var thrower = require('./thrower');

var jsdomDoneCallback = function (done, errors, window) {
  if (errors) {
    console.log('jsdomDoneCallback:', errors);
    throw errors[0];
  }
  this.window = window;
  done();
};

var jsdomCreator = function (doneCallback, scripts) {
  var self = this;
  jsdom.env({
    features: {
      FetchExternalResources: ['script'],
      ProcessExternalResources: ['script'],
      MutationEvents: ['2.0'],
      SkipExternalResources: false
    },
    html: '<html><head></head><body><div id=\'content-root\'></div></body></html>',
    scripts: scripts || [],
    done: doneCallback,
    resourceLoader: function (resource, callback) {
      console.log('resource', resource);
      resource.defaultFetch(function(err, body) {
        console.log('resource body', body);
        if (err) {
          console.log('resourceLoader error', err);
        }
        callback(err, body);
      });
    }
  });
};


describe('Basic Test', function () {
  it('throws an error in the actual test', function () {
    throw new Error('throws something');
  });

  it('throws an error from a node require', function () {
    thrower();
  });

  it('throws an async error from a node require', function (done) {
    setTimeout(function () {
      thrower();
    }, 1);
  });

  it('throws an error in a jsdom script', function (done) {
    jsdomCreator(jsdomDoneCallback.bind(this, done), [process.cwd() + '/directThrow.js']);
  });

  it('throws an error in a jsdom done callback', function (done) {
    jsdomCreator(thrower);
  });

  describe('with beforeEach jsdom setup', function () {
    beforeEach(function (done) {
      jsdomCreator(jsdomDoneCallback.bind(this, done), [process.cwd() + '/browserThrower.js']);
    });
    it('throws a jsdom browser error from preloaded file.', function (done) {
      this.window.browserThrower();
    });

    it.only('throws a jsdom browser error from a post loaded file', function (done) {
      var s = this.window.document.createElement("script");
      s.type = "text/javascript";
      s.onLoad = function() {console.log('onLoad event');};
      s.onError = function() {console.log('onError event');};
      s.src = process.cwd() + '/directThrow.js';
      this.window.document.head.appendChild(s);
      console.log(this.window.document.body.innerHTML);
    });
  });
});
