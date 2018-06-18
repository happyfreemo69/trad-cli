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
var loco = require('loco-client');

function main(){
    if(!process.env.LOCO_APIKEY){
        throw 'missing export LOCO_APIKEY=something';
    }
    var dic = {};
    return Promise.all(['fr','en','de','nl'].map(locale=>{
        return loco.getExport({loco_apiKey:process.env.LOCO_APIKEY},locale).then(json=>{
            fs.writeFile('tmp_'+locale+'.json', JSON.stringify(json,null,1));
            Object.keys(json).forEach(assetId=>{
                dic[assetId] = dic[assetId]||{fr:'', en:'', de:'', nl:''};
                if(typeof(json[assetId])!='string'){
                    throw 'should never happen, check your assetId '+assetId;
                }
                dic[assetId][locale] = json[assetId];
            });
        }).catch(e=>{
            console.log('e',e)
        })
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
