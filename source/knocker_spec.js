describe('Knocker', function() {
    var nock,
        knocker,
        Knocker = require('./knocker');

    beforeEach(function() {
        nock = jasmine.createSpyObj('nock', ['on']);

        knocker = Knocker.build();
    });

    describe('setNock', function() {
        it('should setup a request listener on the nock', function() {
            var callback;

            knocker.setNock(nock);

            expect(nock.on).toHaveBeenCalled();
            expect(nock.on.calls.mostRecent().args[0]).toEqual('request');

            callback = nock.on.calls.mostRecent().args[1];
            callback('aRequest');

            expect(knocker.requests[0]).toEqual('aRequest');
        });

        it('should resolve the received promise', function(done) {
            var callback;

            knocker.setNock(nock);

            callback = nock.on.calls.mostRecent().args[1];
            callback('aRequest');

            knocker.received()
                .then(function(request) {
                    expect(request).toEqual('aRequest');
                })
                .done(done);
        });

        it('should accept false nocks', function() {
            knocker._nock = 'aNock';
            knocker.setNock(null);
            expect(knocker._nock).toBeNull();
        });
    });
});