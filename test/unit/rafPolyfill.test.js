var rafPolyfill = require('../../src/lib/rafPolyfill.js');

describe('rafPolyfill', function () {
    var RAF_KEY = 'requestAnimationFrame';
    var CRAF_KEY = 'cancelAnimationFrame';
    var orgRAF = window[RAF_KEY];
    var orgCRAF = window[CRAF_KEY];
    var clock;
    
    beforeEach(function () {
        window[RAF_KEY] = true;
        window[CRAF_KEY] = true;
        rafPolyfill(true);
        clock = sinon.useFakeTimers();
    });

    afterEach(function () {
        rafPolyfill._reset();
        window[RAF_KEY] = orgRAF;
        window[CRAF_KEY] = orgCRAF;
        clock.restore();
    });

    describe('requestAnimationFrame', function () {
        it('should be a function without native code', function () {
            var raf = window[RAF_KEY];
            expect(typeof raf).to.equal('function');
            expect(raf.toString()).not.to.have.string('[native code]');
        });

        it('should hollaback', function () {
            var done = false;

            window.requestAnimationFrame(function () {
                window.requestAnimationFrame(function(){
                    done = true;
                });
                clock.tick(16);
            });
            clock.tick(16);

            expect(done).to.equal(true);
        });
    });

    describe('cancelRequestAnimationFrame', function () {
        it('should be a function without native code', function () {
            var craf = window[CRAF_KEY];
            expect(craf).to.be.a('function');
            expect(craf.toString()).not.have.string('[native code]');
        });

        it('should cancel when calling cancelAnimationFrame', function(){
            var called = false;

            var req = window.requestAnimationFrame(function(){
                called = true;
            });
            window.cancelAnimationFrame(req);
            clock.tick(16);

            expect(called).to.equal(false);
        });
    });
});
