const url = "https://www.espncricinfo.com/series/ipl-2021-1249214";

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const allMatchObj = require("./Allmatch");

//home page //_dirname gives you path of present directory.
const iplPath = path.join(__dirname,"ipl");
dirCreator(iplPath);
request(url,cb);
function cb(err,response,html){
    if(err){

    }else if(html){
        firstPage(html);
    }
}

function firstPage(html){
    let $  = cheerio.load(html);
    let result = $(".cta-link>a");
    console.log(result.length);
    let text = $(result[0]).attr('href'); 

    let fullink = "https://www.espncricinfo.com"+text;
    //console.log(fullink);

    allMatchObj.gAlmatches(fullink);
}


function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
}