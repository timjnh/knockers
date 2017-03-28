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

    KnockerBuilder.prototype.delete = function _delete(url) {
        this._method = 'DELETE';
        this._url = url;
        return this;
    };

    KnockerBuilder.prototype.reply = function reply(code, body) {
        this._reply = { code: code, body: body };
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
        } else if(this._method == 'PUT') {
            return buildPutKnocker.bind(this)();
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

        myNock = nock(parsedUrl.protocol + '//' + parsedUrl.host)
            .filteringRequestBody(function(body) { return '*'; })
            .post(parsedUrl.path, '*');

        if(this._reply.error) {
            myNock = myNock.replyWithError(this._reply.error);
        } else {
            myNock = myNock.reply(this._reply.code, function (uri, requestBody, cb) {
                // this is kind of icky but i can't see any other way to get to the body
                // of the request that nock received.  the reply callback is currently
                // executed after the request even is emitted.  as long as that remains
                // true, this should be ok
                knocker._setLastRequestBody(requestBody);
                cb(null, _this._reply.body);
            });
        }

        knocker.setNock(myNock);

        return knocker;
    }

    function buildPutKnocker() {
        var myNock,
            _this = this,
            parsedUrl = url.parse(this._url),
            knocker = Knocker.build();

        myNock = nock(parsedUrl.protocol + '//' + parsedUrl.host)
            .filteringRequestBody(function(body) { return '*'; })
            .put(parsedUrl.path, '*');

        if(this._reply.error) {
            myNock = myNock.replyWithError(this._reply.error);
        } else {
            myNock = myNock.reply(this._reply.code, function (uri, requestBody, cb) {
                // this is kind of icky but i can't see any other way to get to the body
                // of the request that nock received.  the reply callback is currently
                // executed after the request even is emitted.  as long as that remains
                // true, this should be ok
                knocker._setLastRequestBody(requestBody);
                cb(null, _this._reply.body);
            });
        }

        knocker.setNock(myNock);

        return knocker;
    }

    function buildGetKnocker() {
        var myNock,
            parsedUrl = url.parse(this._url);

        myNock = nock(parsedUrl.protocol + '//' + parsedUrl.host)
            .get(parsedUrl.path);

        if(this._reply.error) {
            myNock = myNock.replyWithError(this._reply.error);
        } else {
            myNock = myNock.reply(this._reply.code, this._reply.body);
        }

        return Knocker.build(myNock);
    }

    function buildDeleteKnocker() {
        var myNock,
            _this = this,
            parsedUrl = url.parse(this._url),
            knocker = Knocker.build();

        myNock = nock(parsedUrl.protocol + '//' + parsedUrl.host)
            .filteringRequestBody(function(body) { return '*'; })
            .delete(parsedUrl.path, '*');

        if(this._reply.error) {
            myNock = myNock.replyWithError(this._reply.error);
        } else {
            myNock = myNock.reply(this._reply.code, function (uri, requestBody, cb) {
                knocker._setLastRequestBody(requestBody);
                cb(null, _this._reply.body);
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