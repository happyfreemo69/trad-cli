var assert = require('assert');
var Trad = require('../../');
var FuncTrad = require('../../lib/funcTrad');
describe('funcTrad',function(){

    it('translates', function(){
        var t = new Trad({fname:__dirname+'/../../samples/dic.jsonl'});
        return t.reload().then(function(){
            t.dic['LYYTI_STATE_OPENED'] = {fr:'Lu'};
            var funcTrad = new FuncTrad(t);
            var x = funcTrad.render('NOTIF_LYYTI_STATUS_CHANGED', 'fr', {state:'OPENED', title:'x'});
            assert.equal(x, 'Le statut de x est passé à Lu');
        })
    });
});