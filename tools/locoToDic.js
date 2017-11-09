#!/usr/bin/node

var optimist = require('optimist')
    .usage('$0: node app -o outputFileName')
var argv = optimist.argv;
if(argv.help){
    optimist.showHelp()
    process.exit(0);
}

var trad = require('../');
var https = require('https');
var fs = require('fs');
function retrieveLoco(locale){
    return new Promise(function(resolve, reject){
        var req = https.request({
            method:'GET',
            path:'/api/export/locale/'+locale+'.json?format=i18next&key='+process.env.LOCO_APIKEY,
            hostname:'localise.biz',
        }, function(res){
            s = '';
            res.on('data', function(chunk){
                if(res.statusCode != 200){
                    return reject(chunk.toString());
                }
                s+=chunk.toString();
            });
            res.on('end', function(){
                try{
                    return resolve(JSON.parse(s));
                }catch(e){
                    console.log('failed for ', locale)
                    return reject(e);
                }
            })
        });
        req.on('error', function(err){
            return reject(err);
        });
        req.end();
    })
}
function main(){
    if(!process.env.LOCO_APIKEY){
        throw 'missing export LOCO_APIKEY=something';
    }
    var dic = {};
    return Promise.all(['fr','en','de'].map(locale=>{
        return retrieveLoco(locale).then(json=>{
            fs.writeFile('tmp_'+locale+'.json', JSON.stringify(json,null,1));
            Object.keys(json).forEach(assetId=>{
                dic[assetId] = dic[assetId]||{fr:'', en:'', de:''};
                if(typeof(json[assetId])!='string'){
                    console.log('WAATF FUCKKKK ', locale, assetId, json[assetId])
                    throw 'should never happen, check your assetId '+assetId;
                }
                dic[assetId][locale] = json[assetId];
            });
        });
    })).then(_=>{
        var lines = Object.keys(dic).sort((a,b)=>a.localeCompare(b)).map(k=>{
            return JSON.stringify(Object.assign({k:k}, dic[k]));
        });
        fs.writeFileSync('dic.jsonl', lines.join('\n'));
        console.log('output to dic.jsonl');
    }).catch(e=>{
        throw e;
    })
}



main();