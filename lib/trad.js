var Mustache = require('mustache');
var fs = require('fs');
/**
 * 
 * @param {
 *   fname: path to local file. If file not found tries to get it from endpoint
 *       fname is a jsonl (see samples/dic.jsonl), with line {"k":"expected key which should be unique",[lang]:"associated mustache templated trad"}
 * } config 
 */
function Trad(config){
    if(!config.hasOwnProperty('fname')){throw 'expect fname'}
    this.fname = config.fname;
    this.dic = {};
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
            return resolve();
        })  
    })
}
Trad.prototype.getLanguages = function(key){
    return this.dic[key] && Object.keys(this.dic[key]) || [];
}

Trad.prototype.hasKey = function(key){
    return !!this.dic[key];
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
    if(!this.dic[key]){return key;}
    if(!this.dic[key][lang]){return key;}
    return Mustache.render(this.dic[key][lang], data);     
}
module.exports = Trad;