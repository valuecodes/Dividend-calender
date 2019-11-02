var fs = require ('fs');

let fileData= fs.readFileSync('data/finData.json');
var words = JSON.parse(fileData);
let toFile=new Array();
let data={};

class company{
    constructor(name,exDiv,payDate,dividend){
        this.name = name;
        this.exDiv = [exDiv];
        this.payDate = [payDate];
        this.dividend = [dividend];
    }
}

// console.log(company);


for(var i=0;i<words.length;i++){
    // console.log(words[i]);
    if(words[i][0]==''){
        // console.log(words[i]);
        for(var a=words[i][1].length-1;a>0;a--){
            if(words[i][1][a]=='('){
                let fullName=words[i][1].split('(');
                word=fullName[1].split(')');
                let date=words[i][2].split('.')
                
                if(data[word[0]]){
                    data[word[0]].exDiv.push(words[i][2])
                    data[word[0]].payDate.push(words[i][5])
                    data[word[0]].dividend.push(words[i][3])
                }else{
                    data[word[0]] = new company(fullName[0],words[i][2],words[i][5],words[i][3]);
                }

            }
        }
        
    }
}

for(var key in data){
    console.log(key);
}

saveData(data);

function saveData(data){
    data= JSON.stringify(data);
    fs.writeFileSync('data/newData.json',data,finished); 
}

function finished(err){
    console.log('all set.');
}


// console.log(toFile[2].name);

// data[toFile[2].name] = new company(toFile[2].name,toFile[2].name,toFile[2].name);

// data : {
//     'name':'1'
// };

// console.log(data['NOKIA']);

