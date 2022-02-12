const request = require('request');
const cheerio = require('cheerio');

const ScorecardObj = require('./ScoreCard');

function getAllMathchesLink(url){
    request(url,function(err,response,html){
        if(err){
            console.log(err);
        }else if(html){
            getAllLink(html);
        }
    })
}

function getAllLink(html){
    let $ = cheerio.load(html);
    let matchCardLink = $("a[data-hover=Scorecard]") ;
    console.log(matchCardLink.length);
    for(let i=0;i<matchCardLink.length;i++){
        let link = $(matchCardLink[i]).attr('href');
        let fullLink = "https://www.espncricinfo.com"+link;
        //console.log(fullLink);
        ScorecardObj.ps(fullLink);

    }
}

module.exports ={
    //for using getAllMathchesLink() we can call it in any other file with it nickname -->gAlmatches<--.
    gAlmatches: getAllMathchesLink
}