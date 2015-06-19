# mocha_jsdom_test
Shows change in latest version of handling jsdom stack traces.

To show issues
```
sh run_tests.sh
```

The problem is that since mocha@2.1.0, the handling of stack traces changed so that stack traces of JSDOM loaded scripts are no longer useful.

In particular in the last test the result for mocha@2.1.0 is
```
6) Basic Test with beforeEach jsdom setup throws a jsdom browser error from preloaded file.:
     Error: globalThrower
      at window.browserThrower (file:///Users/johnmclaughlin/git/mocha_jsdom_test/browserThrower.js:5:9)
```
But the result for mocha@2.2.5 is not useful for tracking down the source of the error:
```
  6) Basic Test with beforeEach jsdom setup throws a jsdom browser error from preloaded file.:
     Error: the error {} was thrown, throw an Error :)
      at Context.jsdomDoneCallback (all_tests.js:12:3)
```
