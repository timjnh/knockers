module.exports = (function() {
    'use strict';

    var nock = require('nock'),
        KnockerBuilder = require('./knocker_builder');

    function Knockers() {
        return KnockerBuilder.build();
    }

    Knockers.cleanAll = function cleanAll() {
        nock.cleanAll();
    };

    return Knockers;
})();