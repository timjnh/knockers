module.exports = (function() {
    'use strict';

    var q = require('q');

    function Knocker(nock) {
        this.requests = [];
        this._receivedDeferred = q.defer();

        this.setNock(nock);
    }

    Knocker.prototype.setNock = function setNock(nock) {
        var _this = this;

        this._nock = nock;

        if(this._nock) {
            this._nock.on('request', function(request, interceptor) {
                _this.requests.push(request);

                _this._receivedDeferred.resolve(request);
            });
        }
    };

    Knocker.prototype.received = function received() {
        return this._receivedDeferred.promise;
    };

    Knocker.prototype._setLastRequestBody = function _setLastRequestBody(body) {
        this.requests[this.requests.length - 1].body = body;
    };

    Knocker.build = function build(nock) {
        return new Knocker(nock);
    };

    return Knocker;
})();