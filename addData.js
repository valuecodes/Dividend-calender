var fs = require ('fs');

let fileData= fs.readFileSync('data/finData.json');
var words = JSON.parse(fileData);
let toFile=new Array();

class company{
    constructor(name,payOut,paydate){
        this.name = name;
        this.payOut = payOut;
        this.payDate = paydate; 
    }
}

console.log(company);


for(var i=0;i<words.length;i++){
    // console.log(words[i]);
    if(words[i][0]==''){
        // console.log(words[i]);
        for(var a=words[i][1].length-1;a>0;a--){
            if(words[i][1][a]=='('){
                let word=words[i][1].split('(');
                word=word[1].split(')');
                // console.log(word[0]);
                let companyData= 
                toFile.push(new company(word[0],words[i][2],words[i][5]));
            }
        }
        
    }
}


console.log(toFile[2]);
