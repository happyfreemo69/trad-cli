#!/usr/bin/node

//just parse the file as a cli would
var Trad = require('../');
var t = new Trad();
t.reload().then(function(){
    Object.keys(t.dic).forEach(x=>{
        t.getLanguages(x).forEach(y=>{
            try{
                t.translate(x, y);
            }catch(e){
                console.log('e :' , e, x, y);
                throw e;
            }
        })
    });
})