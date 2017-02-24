# knockers

[Nock](https://github.com/node-nock/nock) is a great library for mocking out HTTP requests but I find the interface makes for some clunky tests, particularly for simple scenarios.  Knocker builds on nock to streamline these cases and clean up your tests.  It's very much in it's early stages.  Contributions are welcome!

Improvements:

* Full urls for address specification rather than required separation of host and path
* Logging/buffering of requests so they can be evaluated in a natural order at the end of a test
* Promises to determine when requests have been fulfilled

## Installation

npm install --save-dev knockers

## Usage

### Basic Usage

    it('should call my website', function(done) {

        // knockers are created using a builder pattern
        var knocker = knockers()
            // the interface accepts full urls.  no more parsing required
            .get('http://somefunwebsite/with/a/path/and?a=query')
            // where appropriate, interfaces match nock's
            .reply(200, { stuff: 'and things' })
            .build();

        doSomethingToKickOffAnHttpRequest();

        // the received() method returns a promise that resolves after the first request matches the knocker
        knocker.received()
            .then(function() {
                // requests made to the knocker are stored in .requests for more natural test ordering
                expect(knocker.requests.length).toEqual(1);
            })
            .done(done);
    });

# GET requests

GET requests are very simple

    knockers()
        .get('http://somefunwebsite/with/a/path/and?a=query')
        .reply(200, { stuff: 'and things' })
        .build();

# POST requests

POST requests are pretty much the same

    var knocker = knockers()
        .post('http://somefunwebsite/with/a/path')
        .reply(200, { ok: true })
        .build();

Bodies are inserted into the request object for validation in the expectation portion of your test

    expect(knocker.requests[0].body).toEqual({ expected: body });

# DELETE requests

DELETE requests are pretty close as well

    knockers()
        .delete('http://somefunwebsite/with/a/path')
        .reply(200, { stuff: 'and things' })
        .build();

# Cleanup

    afterEach(function() {
        knockers.cleanAll();
    })

# Misc

<img src="https://github.com/timjnh/knockers/blob/master/knockers.png" />

Yes they will npmjs.org... Yes they will.

# License

MIT