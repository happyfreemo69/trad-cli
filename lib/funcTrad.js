/**
 * trad uses dic.jsonl and replaces variable as is.
 * funcDic may translate the sentences by hardcoding the sentences based on the variables.
 * see 
 */
var Mustache = require('mustache');
Mustache.escape = function(s){return s;}
function FuncTrad(trad){
    this.trad = trad;
    //type, categ, state
    this.dic = {
        NOTIF_LYYTI_STATUS_CHANGED:{
            fr:(data)=>{
                var mapState = {
                    OPENED: 'LYYTI_STATE_OPENED',
                    READ:'LYYTI_STATE_READ',
                    ANSWERED:'LYYTI_STATE_ANSWERED',
                    STANDBY:'LYYTI_STATE_STANDBY',
                    ONGOING:'LYYTI_STATE_ONGOING',
                    RESOLVED:'LYYTI_STATE_RESOLVED',
                    CLOSED:'LYYTI_STATE_CLOSED',
                }
                var state = mapState[data.state];
                state = this.trad.hasKey(state) && this.trad.translate(state, 'fr');
                return Mustache.render('Le statut de {{title}} est passé à {{state}}', Object.assign({},data,{state: state}))
            }
        }
    }
}
FuncTrad.prototype.handles = function(key, lang){
    return !!(this.dic[key] && this.dic[key][lang])
}
FuncTrad.prototype.render = function(key, lang, data){
    return this.dic[key][lang](data);
}
module.exports = FuncTrad;