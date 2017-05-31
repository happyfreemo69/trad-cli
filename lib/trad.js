var Mustache = require('mustache');
var http = require('http');
function Trad(config){
    this.endpoint = config.endpoint;
    this.proto = this.endpoint.includes('https')?'https':'http';
    this.hostname = this.endpoint.indexOf('//').
    this.path = this.endpoint.substring((this.proto+'://'+this.hostname).length)
    this.dic = {};
}
Trad.prototype.reload = function(){
    var proto = require(self.proto);
    var self = this;
    //TODO test
    return new Promise(function(resolve, reject){
        var req = proto.request({
            method:'GET',
            path:self.path,
            hostname:self.hostname,
            headers:headers
        }, function(res){
            var buff = '';
            res.on('data', function(chunk){
                if(res.statusCode != 200){
                    return reject('fail :'+res.statusCode);
                }
                buff += chunk.toString()
                return resolve();
            });
            res.on('end', function(){
                //rebuild the dic
                var d2 = {};
                buff.split('\n').forEach(x=>{
                    if(x.length){
                        var obj = JSON.parse(x);
                        var k = obj.k;
                        delete obj.k;
                        d2[k] = obj;
                    }
                })
                this.dic = d2;      
            })
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

}
Trad.prototype.getLanguages = function(key){
    return Object.keys(this.dic[key]);
}
Trad.prototype.translate = function(key, lang, data){
    if(data){
        return Mustache.render(this.dic[key][lang], data);     
    }
    return this.dic[key][lang];
}
module.exports = Trad;