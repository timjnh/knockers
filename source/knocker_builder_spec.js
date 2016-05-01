describe('KnockerBuilder', function() {
    var q = require('q'),
        Knocker = require('./knocker'),
        knockerBuilder;

    beforeEach(function () {
        knockerBuilder = require('./knocker_builder').build();
    });

    describe('get method', function () {
        it('should set the method and url', function () {
            var url = 'http://www.google.com';
            expect(knockerBuilder.get(url)).toBe(knockerBuilder);
            expect(knockerBuilder._method).toEqual('GET');
            expect(knockerBuilder._url).toEqual(url);
        });
    });

    describe('post method', function () {
        it('should set the method and url', function () {
            var url = 'http://www.google.com';
            expect(knockerBuilder.post(url)).toBe(knockerBuilder);
            expect(knockerBuilder._method).toEqual('POST');
            expect(knockerBuilder._url).toEqual(url);
        });
    });

    describe('reply method', function () {
        it('should set the reply object', function () {
            var expectedResponse = {ok: true};
            expect(knockerBuilder.reply(200, expectedResponse)).toBe(knockerBuilder);
            expect(knockerBuilder._reply.code).toEqual(200);
            expect(knockerBuilder._reply.body).toEqual(expectedResponse);
        });
    });

    describe('build method', function () {
        var url = 'http://www.google.com:80/a/path/and?a=query';

        beforeEach(function() {
            spyOn(Knocker, 'build').and.callThrough()
        });

        it('should create a knocker for get requests', function() {
            var nock,
                knocker,
                expectedBody = { ok: true };

            knocker = knockerBuilder
                .get(url)
                .reply(200, expectedBody)
                .build();

            expect(Knocker.build).toHaveBeenCalled();

            nock = knocker._nock;
            expect(nock).not.toBeUndefined();

            expect(nock.keyedInterceptors['GET ' + url]).toBeDefined();
            expect(nock.keyedInterceptors['GET ' + url][0].statusCode).toEqual(200);
            expect(nock.keyedInterceptors['GET ' + url][0].body).toEqual(JSON.stringify(expectedBody));
        });

        it('should create a knocker for post requests', function(done) {
            var nock,
                knocker,
                expectedBody = { ok: true };

            knocker = knockerBuilder
                .post(url)
                .reply(200, expectedBody)
                .build();

            expect(Knocker.build).toHaveBeenCalled();

            nock = knocker._nock;
            expect(nock).not.toBeUndefined();

            expect(nock.keyedInterceptors['POST ' + url]).toBeDefined();
            expect(nock.keyedInterceptors['POST ' + url][0].statusCode).toEqual(200);

            spyOn(knocker, '_setLastRequestBody');
            nock.keyedInterceptors['POST ' + url][0].body('aUri', 'aRequestBody', function(responseBody) {
                expect(responseBody).toEqual(JSON.stringify(expectedBody));
                expect(knocker._setLastRequestBody).toHaveBeenCalledWith('aRequestBody');
                done();
            });
        });

        it('should complain if url is not set', function () {
            try {
                knockerBuilder.build();
                fail();
            } catch(err) {
                expect(err.message).toEqual('url is required');
            }
        });

        it('should complain if reply is not set', function() {
            try {
                knockerBuilder
                    .get('http://www.google.com')
                    .build();
                fail();
            } catch(err) {
                expect(err.message).toEqual('reply is required');
            }
        });

        it('should complain if method is not set', function() {
            knockerBuilder.reply(200, { ok: true });
            knockerBuilder._url = 'http://www.google.com';

            try {
                knockerBuilder.build();
                fail();
            } catch(err) {
                expect(err.message).toEqual('method is required');
            }
        });
    });
});