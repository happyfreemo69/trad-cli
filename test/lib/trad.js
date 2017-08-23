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

    it('listens to onload', function(done){
        var t = new Trad({fname:__dirname+'/../../samples/dic.jsonl'});
        t.on('load', function(res){
            assert.equal(res,null);
            return done();
        });
    });

    it('translate without escaping variables', function(done){
        var t = new Trad({fname:__dirname+'/../../samples/dic.jsonl'});
        t.reload().then(function(){
            var str = t.translate('a','fr',{createdAt:1, title:"l'arbre"});
            assert.equal(str, "1: l'arbre");
            return done();
        }).catch(done)
    });

    it('functional translates if defined', function(){
        var t = new Trad({fname:__dirname+'/../../samples/dic.jsonl'});
        return t.reload().then(function(){
            t.dic['NOTIF_LYYTI_STATUS_CHANGED'] = {fr:'ignored', en:'delegated anyway'}
            t.dic['LYYTI_STATE_ANSWERED'] = {fr:'Répondu'}
            var str = t.translate('NOTIF_LYYTI_STATUS_CHANGED','fr',{title:'x', state:"ANSWERED"});
            assert.equal(str, "Le statut de x est passé à Répondu");
            str = t.translate('NOTIF_LYYTI_STATUS_CHANGED','en',{title:'x', state:"ANSWERED"});
            assert.equal(str, "delegated anyway");
        })
    });
});