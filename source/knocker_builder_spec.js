describe('KnockerBuilder', function() {
    var q = require('q'),
        nock = require('nock'),
        Knocker = require('./knocker'),
        knockerBuilder;

    beforeEach(function () {
        knockerBuilder = require('./knocker_builder').build();
    });

    afterEach(function() {
        nock.cleanAll();
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

    describe('replyWithError method', function() {
        it('should set the reply object', function() {
            var expectedResponse = {ok: true};
            expect(knockerBuilder.replyWithError('oh noes!')).toBe(knockerBuilder);
            expect(knockerBuilder._reply.error).toEqual('oh noes!');
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

        it('should respect the persist setting for get requests', function() {
            knocker = knockerBuilder
                .get(url)
                .reply(200, { ok: true })
                .persist(true)
                .build();
            
            expect(knocker._nock._persist).toBe(true);
        });

        it('should create a knocker for get requests with an error reply', function() {
            var nock,
                knocker;

            knocker = knockerBuilder
                .get(url)
                .replyWithError('oh noes!')
                .build();

            expect(Knocker.build).toHaveBeenCalled();

            nock = knocker._nock;

            expect(nock.keyedInterceptors['GET ' + url]).toBeDefined();
            expect(nock.keyedInterceptors['GET ' + url][0].errorMessage).toEqual('oh noes!');
        });

        it('should create a knocker for delete requests', function(done) {
            var nock,
                knocker,
                expectedBody = { ok: true };

            knocker = knockerBuilder
                .delete(url)
                .reply(200, expectedBody)
                .build();

            expect(Knocker.build).toHaveBeenCalled();

            nock = knocker._nock;
            expect(nock).not.toBeUndefined();

            expect(nock.keyedInterceptors['DELETE ' + url]).toBeDefined();
            expect(nock.keyedInterceptors['DELETE ' + url][0].statusCode).toEqual(200);

            spyOn(knocker, '_setLastRequestBody');
            nock.keyedInterceptors['DELETE ' + url][0].body('aUri', 'aRequestBody', function(err, responseBody) {
                expect(responseBody).toEqual(expectedBody);
                expect(knocker._setLastRequestBody).toHaveBeenCalledWith('aRequestBody');
                done();
            });
        });

        it('should respect the persist setting for delete requests', function() {
            knocker = knockerBuilder
                .delete(url)
                .persist(true)
                .reply(200, { ok: true })
                .build();
            
            expect(knocker._nock._persist).toBe(true);
        });

        it('should create a knocker for delete requests with an error reply', function() {
            var nock,
                knocker;

            knocker = knockerBuilder
                .delete(url)
                .replyWithError('oh noes!')
                .build();

            expect(Knocker.build).toHaveBeenCalled();

            nock = knocker._nock;

            expect(nock.keyedInterceptors['DELETE ' + url]).toBeDefined();
            expect(nock.keyedInterceptors['DELETE ' + url][0].errorMessage).toEqual('oh noes!');
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
            nock.keyedInterceptors['POST ' + url][0].body('aUri', 'aRequestBody', function(err, responseBody) {
                expect(responseBody).toEqual(expectedBody);
                expect(knocker._setLastRequestBody).toHaveBeenCalledWith('aRequestBody');
                done();
            });
        });

        it('should respect the persist setting for post requests', function() {
            knocker = knockerBuilder
                .post(url)
                .persist(true)
                .reply(200, { ok: true })
                .build();
            
            expect(knocker._nock._persist).toBe(true);
        });

        it('should create a knocker for post requests with an error reply', function() {
            var nock,
                knocker;

            knocker = knockerBuilder
                .post(url)
                .replyWithError('oh noes!')
                .build();

            expect(Knocker.build).toHaveBeenCalled();

            nock = knocker._nock;

            expect(nock.keyedInterceptors['POST ' + url]).toBeDefined();
            expect(nock.keyedInterceptors['POST ' + url][0].errorMessage).toEqual('oh noes!');
        });

        it('should create a knocker for put requests', function(done) {
            var nock,
                knocker,
                expectedBody = { ok: true };

            knocker = knockerBuilder
                .put(url)
                .reply(200, expectedBody)
                .build();

            expect(Knocker.build).toHaveBeenCalled();

            nock = knocker._nock;
            expect(nock).not.toBeUndefined();

            expect(nock.keyedInterceptors['PUT ' + url]).toBeDefined();
            expect(nock.keyedInterceptors['PUT ' + url][0].statusCode).toEqual(200);

            spyOn(knocker, '_setLastRequestBody');
            nock.keyedInterceptors['PUT ' + url][0].body('aUri', 'aRequestBody', function(err, responseBody) {
                expect(responseBody).toEqual(expectedBody);
                expect(knocker._setLastRequestBody).toHaveBeenCalledWith('aRequestBody');
                done();
            });
        });

        it('should respect the persist setting for post requests', function() {
            knocker = knockerBuilder
                .put(url)
                .persist(true)
                .reply(200, { ok: true })
                .build();
            
            expect(knocker._nock._persist).toBe(true);
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