var Mustache = require('mustache');
var fs = require('fs');
var FuncTrad = require('./funcTrad');
/**
 * hardcoded dic because it simplifies our usecase:
 * just rollback and get the old dic
 */
function Trad(config = {}){
    this.fname = config.fname || __dirname+'/../dic.jsonl';
    this.NS = config.NS;
    this.funcTrad = new FuncTrad(this);
    this.dic = {};
    this.onload = function(){};
    this.reload();
    Mustache.escape = function(s){return s;}
}
Trad.prototype.on = function(evname, fn){
    this.onload = fn;
}
Trad.prototype._reload = function(str){
    var d2 = {};
    str.split('\n').forEach(x=>{
        if(x.length){
            var obj = JSON.parse(x);
            var k = obj.k;
            delete obj.k;
            d2[k] = obj;
        }
    })
    this.dic = d2; 
}

Trad.prototype.reload = function(){
    return new Promise((resolve, reject)=>{
        return fs.readFile(this.fname, (err,str)=>{
            if(err)return reject(err);
            this._reload(str.toString());
            this.onload(null);
            return resolve();
        })  
    })
}
Trad.prototype.getLanguages = function(key){
    var k = Trad.key(key, this.NS);
    return this.dic[k] && Object.keys(this.dic[k]) || [];
}

Trad.prototype.hasKey = function(key){
    var k = Trad.key(key, this.NS);
    return !!this.dic[k];
}

Trad.prototype.hasTrad = function(key, lang){
    var k = Trad.key(key, this.NS);
    return this.hasKey(key) && !!this.dic[k][lang]
}

/**
 * if key not found, returns key
 * if lang not found returns key
 * if data not found, returns the translation without templating
 * @param  {[type]} key  [description]
 * @param  {[type]} lang [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
Trad.prototype.translate = function(key, lang, data={}){
    var k = Trad.key(key, this.NS);
    if(!this.dic[k]){return key;}
    if(!this.dic[k][lang]){return key;}
    if(this.funcTrad.handles(key, lang)){
        return this.funcTrad.render(key, lang, data);
    }
    return Mustache.render(this.dic[k][lang], data);
}
Trad.key = function(x, NS=''){//NS must end by NS_
    return (NS+x.toUpperCase().replace(/^.*NS_/,'')).replace(/[^0-9A-Z_]/g,'');
}
Trad.json = {};
Trad.json.clean = function(x){
    return x.replace(/"/g,'\"');
}
module.exports = Trad;