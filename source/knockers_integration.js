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

    describe('delete', function () {
        it('should intercept and log requests', function (done) {
            var knocker,
                requestPromise,
                url = 'http://www.google.com/a/path/',
                expectedResponse = { ok: true };

            knocker = knockers()
                .delete(url)
                .reply(200, expectedResponse)
                .build();

            requestPromise = rest.del(url);

            q.spread([knocker.received(), requestPromise],
                function (request, response) {
                    expect(knocker.requests.length).toEqual(1);
                    expect(knocker.requests[0]).toBe(request);

                    expect(response.data).toEqual(expectedResponse);
                })
                .done(done);
        });

        it('should intercept requests with payloads', function(done) {
            var knocker,
                requestPromise,
                url = 'http://www.google.com/a/path/',
                expectedResponse = { ok: true },
                expectedRequestBody = { delete: 'me' };

            knocker = knockers()
                .delete(url)
                .reply(200, expectedResponse)
                .build();

            requestPromise = rest.request(url,
                {
                    method: 'delete',
                    data: JSON.stringify(expectedRequestBody),
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

            q.spread([knocker.received(), requestPromise],
                function (request, response) {
                    expect(knocker.requests.length).toEqual(1);
                    expect(knocker.requests[0]).toBe(request);
                    expect(knocker.requests[0].body).toEqual(expectedRequestBody);

                    expect(response.data).toEqual(JSON.stringify(expectedResponse));
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

    describe('put', function() {
        it('should intercept and log requests', function(done) {
            var knocker,
                requestPromise,
                url = 'http://www.google.com/a/path/and',
                expectedRequestBody = { hi: 'there!' },
                expectedResponse = { ok: true};

            knocker = knockers()
                .put(url)
                .reply(200, expectedResponse)
                .build();

            requestPromise = rest.putJson(url, expectedRequestBody);

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