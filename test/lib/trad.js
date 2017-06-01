var assert = require('assert');
var Trad = require('../../');

describe('trad',function(){

    it('getLanguages on existing key', function(done){
        var t = new Trad({fname:__dirname+'/../../samples/dic.jsonl'});
        t.reload().then(function(){
            assert.equal(t.getLanguages('a').join(''), 'frende');
            return done();
        })
    });

    it('getLanguages on non existing key', function(done){
        var t = new Trad({fname:__dirname+'/../../samples/dic.jsonl'});
        t.reload().then(function(){
            assert.equal(t.getLanguages('b').join(''), '');
            return done();
        })
    });

    it('hasKey', function(done){
        var t = new Trad({fname:__dirname+'/../../samples/dic.jsonl'});
        t.reload().then(function(){
            assert(!t.hasKey('b'));
            assert(t.hasKey('a'));
            return done();
        })
    });

    it('translate with variables', function(done){
        var t = new Trad({fname:__dirname+'/../../samples/dic.jsonl'});
        t.reload().then(function(){
            var str = t.translate('a','fr',{createdAt:1, title:'ok ici'});
            assert.equal(str, '1: ok ici');
            return done();
        })
    });

    it('translate with partially missing variables', function(done){
        var t = new Trad({fname:__dirname+'/../../samples/dic.jsonl'});
        t.reload().then(function(){
            var str = t.translate('a','fr',{createdAt:1});
            assert.equal(str, '1: ');
            return done();
        })
    });

    it('translate without data', function(done){
        var t = new Trad({fname:__dirname+'/../../samples/dic.jsonl'});
        t.reload().then(function(){
            var str = t.translate('a','fr');
            assert.equal(str, ': ');
            return done();
        })
    });

    it('translate with missing lang', function(done){
        var t = new Trad({fname:__dirname+'/../../samples/dic.jsonl'});
        t.reload().then(function(){
            var str = t.translate('a','xx',{createdAt:1});
            assert.equal(str, 'a');
            return done();
        })
    });
});