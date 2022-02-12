const fs= require('fs');

function excelWriter(filePath,json,sheetName){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS,sheetName-1);
    xlsx.writeFile(newWB,filePath);
}


function excelReader(filePath,sheetName){

    if(fs.existsSync(filePath)){
        return[];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return;
}

