var fs = require ('fs');

let fileData= fs.readFileSync('data/finData.json');
var words = JSON.parse(fileData);
let toFile=new Array();
let data={};

class companies{
    constructor(name,exDiv,payDate,dividend,country){
        this.name = name;
        this.exDiv = [exDiv];
        this.payDate = [payDate];
        this.dividend = [dividend];
        this.country=country;
    }
}

// console.log(words[0][2].split('\t'));


for(var i=0;i<words.length;i++){
    let company=words[i][0].split('\t')

    // console.log(words[i][1]);
    if(company[0]==''){
        
        let name=company[1].split(' ')[0];
        let ticker=company[1].split('(');
        ticker=ticker[1].split(')')[0];
        let company1= words[i][1].split('\t');
        let company2= words[i][2].split('\t');
        let exDiv=company[2].split(' ')[1]+'.'+(toMonth(company[2].split(' ')[0]))+'.'+company1[0].split(' ')[1];
        let dividend=company1[1];
        let payDate=company1[3].split(' ')[1]+'.'+(toMonth(company1[3].split(' ')[0]))+'.'+company2[0].split(' ')[1];
        
        // console.log(name,exDiv,payDate);
        console.log(ticker,name,exDiv,payDate,dividend,'FIN');
        // data[ticker] = new companies(name,exDiv,payDate,dividend,'FIN');
        if(data[ticker]){
            data[ticker].exDiv.push(exDiv)
            data[ticker].payDate.push(payDate)
            data[ticker].dividend.push(dividend)
        }else{
            data[ticker] = new companies(name,exDiv,payDate,dividend,'FIN');
        }
        
        

        // data[word[0]] = new company(fullName[0],words[i][2],words[i][5],words[i][3]);

    }
    
}

console.log(data);

function toMonth(data){
    let num;
    switch(data){
        case 'Jan':
            num=1;
            break;
        case 'Feb':
            num=2;
            break;
        case 'Mar':
            num=3;
            break;
        case 'Apr':
            num=4;
            break;
        case 'May':
            num=5;
            break;
        case 'Jun':
            num=6;
            break;
        case 'Jul':
            num=7;
            break;
        case 'Aug':
            num=8;
            break;
        case 'Sep':
            num=9;
            break;
        case 'Oct':
            num=10;
            break;
        case 'Nov':
            num=11;
            break;
        case 'Dec':
            num=12;
            break;
        default:
            num=NaN;
    }
    return num;

}


// for(var i=0;i<words.length;i++){
//     // console.log(words[i]);
//     if(words[i][0]==''){
//         // console.log(words[i]);
//         for(var a=words[i][1].length-1;a>0;a--){
//             if(words[i][1][a]=='('){
//                 let fullName=words[i][1].split('(');
//                 word=fullName[1].split(')');
//                 let date=words[i][2].split('.')
                
//                 if(data[word[0]]){
//                     data[word[0]].exDiv.push(words[i][2])
//                     data[word[0]].payDate.push(words[i][5])
//                     data[word[0]].dividend.push(words[i][3])
//                 }else{
//                     data[word[0]] = new company(fullName[0],words[i][2],words[i][5],words[i][3]);
//                 }

//             }
//         }
        
//     }
// }

// console.log(data);

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

