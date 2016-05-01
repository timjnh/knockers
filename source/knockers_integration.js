describe('knockers', function() {
    var q = require('q'),
        rest = require('restling'),
        knockers = require('./knockers');

    afterEach(function() {
        knockers.cleanAll();
    });

    describe('get', function () {
        it('should intercept and log requests', function (done) {
            var knocker,
                requestPromise,
                url = 'http://www.google.com/a/path/and?a=query',
                expectedResponse = { ok: true };

            knocker = knockers()
                .get(url)
                .reply(200, expectedResponse)
                .build();

            requestPromise = rest.get(url);

            q.spread([knocker.received(), requestPromise],
                function (request, response) {
                    expect(knocker.requests.length).toEqual(1);
                    expect(knocker.requests[0]).toBe(request);

                    expect(response.data).toEqual(expectedResponse);
                })
                .done(done);
        });
    });

    describe('post', function() {
        it('should intercept and log requests', function(done) {
            var knocker,
                requestPromise,
                url = 'http://www.google.com/a/path/and',
                expectedRequestBody = { hi: 'there!' },
                expectedResponse = { ok: true};

            knocker = knockers()
                .post(url)
                .reply(200, expectedResponse)
                .build();

            requestPromise = rest.postJson(url, expectedRequestBody);

            q.spread([knocker.received(), requestPromise],
                function (request, response) {
                    expect(knocker.requests.length).toEqual(1);
                    expect(knocker.requests[0]).toBe(request);
                    expect(knocker.requests[0].body).toEqual(expectedRequestBody);

                    expect(response.data).toEqual(expectedResponse);
                })
                .done(done);
        });
    });
});