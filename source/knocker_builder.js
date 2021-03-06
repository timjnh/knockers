module.exports = (function() {
    'use strict';

    var url = require('url'),
        nock = require('nock'),
        assert = require('assert'),
        Knocker = require('./knocker');

    function KnockerBuilder() {}

    KnockerBuilder.prototype.get = function get(url) {
        this._method = 'GET';
        this._url = url;
        return this;
    };

    KnockerBuilder.prototype.post = function post(url) {
        this._method = 'POST';
        this._url = url;
        return this;
    };

    KnockerBuilder.prototype.put = function put(url) {
        this._method = 'PUT';
        this._url = url;
        return this;
    };

    KnockerBuilder.prototype.patch = function put(url) {
        this._method = 'PATCH';
        this._url = url;
        return this;
    };

    KnockerBuilder.prototype.delete = function _delete(url) {
        this._method = 'DELETE';
        this._url = url;
        return this;
    };

    KnockerBuilder.prototype.persist = function persist(persist) {
        this._persist = persist === undefined ? true : persist;
        return this;
    };

    KnockerBuilder.prototype.reply = function reply(code, body, headers) {
        this._reply = { code: code, body: body, headers: headers };
        return this;
    };

    KnockerBuilder.prototype.replyWithError = function replyWithError(error) {
        this._reply = { error: error };
        return this;
    };

    KnockerBuilder.prototype.build = function build() {
        assert(this._url, 'url is required');
        assert(this._reply, 'reply is required');

        assert(this._method, 'method is required');
        if(this._method == 'POST') {
            return buildPostKnocker.bind(this)();
        } else if(this._method == 'PUT' || this._method == 'PATCH') {
            return buildPutOrPatchKnocker.bind(this)();
        } else if(this._method == 'GET') {
            return buildGetKnocker.bind(this)();
        } else if(this._method == 'DELETE') {
            return buildDeleteKnocker.bind(this)();
        } else {
            throw 'How did I get here?';
        }
    };

    function buildPostKnocker() {
        var myNock,
            _this = this,
            parsedUrl = url.parse(this._url),
            knocker = Knocker.build();

        myNock = nock(parsedUrl.protocol + '//' + parsedUrl.host);
        if(this._persist !== undefined) {
            myNock = myNock.persist(this._persist);
        }

        myNock = myNock.filteringRequestBody(function(body) { return '*'; })
            .post(parsedUrl.path, '*');

        if(this._reply.error) {
            myNock = myNock.replyWithError(this._reply.error);
        } else {
            myNock = myNock.reply(function (uri, requestBody, cb) {
                // this is kind of icky but i can't see any other way to get to the body
                // of the request that nock received.  the reply callback is currently
                // executed after the request even is emitted.  as long as that remains
                // true, this should be ok
                knocker._setLastRequestBody(requestBody);
                cb(null, [_this._reply.code, _this._reply.body, _this._reply.headers]);
            });
        }

        knocker.setNock(myNock);

        return knocker;
    }

    function buildPutOrPatchKnocker() {
        var myNock,
            _this = this,
            parsedUrl = url.parse(this._url),
            knocker = Knocker.build();

        myNock = nock(parsedUrl.protocol + '//' + parsedUrl.host);
        if(this._persist !== undefined) {
            myNock = myNock.persist(this._persist);
        }

        myNock = myNock.filteringRequestBody(function(body) { return '*'; });

        if(this._method == 'PUT') {
            myNock = myNock.put(parsedUrl.path, '*');
        } else {
            myNock = myNock.patch(parsedUrl.path, '*');
        }

        if(this._reply.error) {
            myNock = myNock.replyWithError(this._reply.error);
        } else {
            myNock = myNock.reply(function (uri, requestBody, cb) {
                // this is kind of icky but i can't see any other way to get to the body
                // of the request that nock received.  the reply callback is currently
                // executed after the request even is emitted.  as long as that remains
                // true, this should be ok
                knocker._setLastRequestBody(requestBody);
                cb(null, [_this._reply.code, _this._reply.body, _this._reply.headers]);
            });
        }

        knocker.setNock(myNock);

        return knocker;
    }

    function buildGetKnocker() {
        var myNock,
            parsedUrl = url.parse(this._url);

        myNock = nock(parsedUrl.protocol + '//' + parsedUrl.host);
        if(this._persist !== undefined) {
            myNock = myNock.persist(this._persist);
        }

        myNock = myNock.get(parsedUrl.path);

        if(this._reply.error) {
            myNock = myNock.replyWithError(this._reply.error);
        } else {
            myNock = myNock.reply(this._reply.code, this._reply.body, this._reply.headers);
        }

        return Knocker.build(myNock);
    }

    function buildDeleteKnocker() {
        var myNock,
            _this = this,
            parsedUrl = url.parse(this._url),
            knocker = Knocker.build();

        myNock = nock(parsedUrl.protocol + '//' + parsedUrl.host);
        if(this._persist !== undefined) {
            myNock = myNock.persist(this._persist);
        }

        myNock = myNock.filteringRequestBody(function(body) { return '*'; })
            .delete(parsedUrl.path, '*');

        if(this._reply.error) {
            myNock = myNock.replyWithError(this._reply.error);
        } else {
            myNock = myNock.reply(function (uri, requestBody, cb) {
                knocker._setLastRequestBody(requestBody);
                cb(null, [_this._reply.code, _this._reply.body, _this._reply.headers]);
            });
        }

        knocker.setNock(myNock);

        return knocker;
    }

    KnockerBuilder.build = function build() {
        return new KnockerBuilder();
    };

    return KnockerBuilder;
})();