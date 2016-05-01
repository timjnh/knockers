describe('knockers', function() {
    var nock = require('nock'),
        knockers = require('./knockers'),
        KnockerBuilder = require('./knocker_builder');

    describe('knockers method', function() {
        it('should create a new KnockerBuilder', function() {
            spyOn(KnockerBuilder, 'build');
            knockers();
            expect(KnockerBuilder.build).toHaveBeenCalled();
        });
    });

    describe('cleanAll method', function() {
        it('should call nock.cleanAll', function() {
            spyOn(nock, 'cleanAll');
            knockers.cleanAll();
            expect(nock.cleanAll).toHaveBeenCalled();
        });
    });
});