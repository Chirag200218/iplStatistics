const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const { data } = require('cheerio/lib/api/attributes');

function processScoreCard(url){
    request(url,cb);;
}

function cb(err,response,html){
    if(err){

    }else if(html){
        extractMatchDetails(html);
    }
}

function extractMatchDetails(html){
    //venue date opponent result runs ball four six sr
     
    let $ = cheerio.load(html);
   // let descElem = $(".event .description");
    let result = $(".event .status-text");
    // let stringArr = descElem.text().split(",");
    // let venue = stringArr[1].trim();
    // let date = stringArr[2].trim();    
    result = result.text();

    let innings= $(".card.content-block.match-scorecard-table>.Collapsible");
    let htmlString="";
    console.log(innings.length);
    for(let i=0;i<innings.length;i++){
        // htmlString = $(innings[i]).html; 
        let teamName = $(innings[i]).find("h5").text();
        teamName = teamName.split("INNINGS")[0].trim();
        let opponentIndex = i==0?1:0;
        let opponentTeamName  = $(innings[opponentIndex]).find("h5").text();
        opponentTeamName = opponentTeamName.split("INNINGS")[0].trim();

        let cInning = $(innings[i]);
        let allRows = cInning.find(".table.batsman tbody tr");
        for(let j=0;j<allRows.length;j++){
            let allCol = $(allRows[j]).find("td");
            let isWorthy = $(allCol[0]).hasClass("batsman-cell");
            if(isWorthy==true){
                let name = $(allCol[0]).text().trim();
                let run = $(allCol[2]).text().trim();
                let ball = $(allCol[3]).text().trim();
                let fours = $(allCol[4]).text().trim();
                let sixes = $(allCol[5]).text().trim();
                let sr = $(allCol[6]).text().trim();


                console.log(name+" "+run+" "+ball+" "+fours+" "+sixes+" "+sr);
                console.log("------------------------------------------------------------------------------");
                processPlayer(teamName,name,run,ball,fours,sixes,sr,opponentTeamName,result);
            }
        }

         
    }
     
}
function processPlayer(teamName,name,run,ball,fours,sixes,sr,opponentTeamName,result){
    let teamPath  = path.join(__dirname,"ipl",teamName);
    dirCreator(teamPath);
    let filePath = path.join(teamPath,name+".xlsx");
    let content = excelReader(filePath,name);
    let playerObj ={
        teamName,
        name,
        run,ball,fours,sixes,sr,
        opponentTeamName,result
    }
    content.push(playerObj);
    excelWriter(filePath,content,name);
}


function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
}


function excelWriter(filePath,json,sheetName){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS,sheetName);
    xlsx.writeFile(newWB,filePath);
}


function excelReader(filePath,sheetName){

    if(fs.existsSync(filePath)==false){
        return[];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}


module.exports={
    ps:processScoreCard
}