#!/usr/bin/node
var optimist = require('yargs').usage(
`$0 -o oldDic.jsonl -n oldDic.jsonl`)
    .options('o', {
        alias : 'old',
        describe: 'oldDic'
    })
    .options('n', {
        alias : 'new',
        describe: 'newer dic'
    })
    .demand(['old', 'new'])
var argv = optimist.argv;
if(argv.help){
    optimist.showHelp()
    process.exit(0);
}

var fs = require('fs');
//var Promise = require('bluebird');
var readFile = function(x){
    return new Promise(function(resolve, reject){
        return fs.readFile(x, function(err, data){
            if(err){return reject(err)}
            try{
                var d = data.toString().split('\n').map(x=>JSON.parse(x)).sort((a,b)=>a.k.localeCompare(b.k));
                return resolve(d);
            }catch(e){
                return reject(e);
            }
        })
    })
};
var dfds = [readFile(argv.old), readFile(argv.new), new Promise(function(resolve, reject){
        return fs.readFile('./differ/template.html', function(err, data){
            if(err){return reject(err)}
            return resolve(data.toString());
        })
    })
];
function buildMap(arr){
    var m = {};
    arr.forEach(x=>{
        m[x.k] = x;
    })
    return m;
}
function getDiff(left, right){
    if(!left && !right){
        return false;
    }
    if(!left){
        left = {};
    }
    if(!right){
        right = {};
    }
    var diffKeys = {};
    Object.keys(left).forEach(y=>{
        diffKeys[y] = {left: left[y]}
    })
    Object.keys(right).forEach(y=>{
        if(!diffKeys[y]){
            diffKeys[y] = {right: right[y]}
        }else{
            if(diffKeys[y].left == right[y]){
                delete diffKeys[y];
                return;
            }
            diffKeys[y].right = right[y];
        }
    })
    if(Object.keys(diffKeys).length == 0){
        return false;
    }
    return diffKeys;
}
/**
 * [plotDiffs description]
 * @param  {[type]} diff [description]
 * diff = {
 *   fr:{left:xx, right:xx}
 * }
 * @return {[type]}      [description]
 */
function plotDiff(diffs, template){
    var x = diffs.map((diff,i)=>{
        var id = diff.id;
        delete diff.id;
        var odd = i%2==0?'odd':'even';
        return Object.keys(diff).map((diffKey,j)=>{
            if(j>0){
                id='';
            }
            return `
                <tr class="${odd}">
                    <td>${id}</td>
                    <td>${diffKey}</td>
                    <td>${diff[diffKey].left||''}</td>
                    <td>${diff[diffKey].right||''}</td>
                </tr>
            `;
        }).join('\n');
    }).join('\n');
    var fname = './differ/index.html';
    return new Promise(function(resolve, reject){
        var str = template.replace('{{LIST}}', x);
        console.log('output to ', fname)
        return fs.writeFile(fname, str, function(err){
            if(err){return reject(err)}
            return resolve();
        })
    })
    
}
return Promise.all(dfds).then(([a,b, template])=>{
    var mapA = buildMap(a);
    var mapB = buildMap(b);
    var diffs = [];
    [...new Set(Object.keys(mapA).concat(Object.keys(mapB)))].sort((a,b)=>a.localeCompare(b)).forEach(x=>{
        var [left, right] = [mapA[x], mapB[x]]
        var diff = getDiff(left, right);
        if(diff === false){
            return;
        }
        diff.id = x;
        diffs.push(diff);
    })
    return plotDiff(diffs, template)
}).catch(e=>{
    console.log('n oni i', e)  
})
