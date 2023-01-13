#!/usr/bin/node

var optimist = require('yargs')
    .usage('$0: node app -o outputFileName')
    .options('l', {
        alias : 'language',
        describe: 'fr, en, de or nl'
    })
    .options('o', {
        alias : 'outFile',
        describe: 'trad file',
        default: 'out.txt'
    })
    .options('a', {
        alias : 'all',
        describe: 'export in all languages'
    })
    .demand(['outFile'])
var argv = optimist.argv;
if(argv.help){
    optimist.showHelp()
    process.exit(0);
}

var fs = require('fs');
var path = require('path');
var trad = require('../');
const NS = 'TRADCLINS_';
function main(){
    const defLanguages = ['fr','en','de','nl'];
    var languages = [];
    if(argv.all){
        languages = defLanguages;
    }else{
        if(!defLanguages.includes(argv.language)){
            throw 'expect '+defLanguages+', got '+argv.language+' or use node exportLoco -a';
        }
        languages = [argv.language];
    }
    var dic = {};
    languages.forEach(l=>{
        dic[l] = {};
    })
    fs.readFileSync('../dic.jsonl').toString().split('\n').filter(x=>x.length).map(x=>{
        var o = JSON.parse(x);
        languages.forEach(l=>{
            if(o[l]){
                var key = o.k
                if(!o.k.includes('NS_')){
                    key = trad.key(o.k, NS);
                }
                dic[l][key] = o[l];
            }
        })
    })
    return languages.forEach(locale=>{
        var str = JSON.stringify(dic[locale],null,1);
        var outfile = argv.outFile.replace(path.extname(argv.outFile), '_'+locale+'.json')
        fs.writeFileSync(outfile, str);
        console.log('written to ', outfile);
    });
}
main();
