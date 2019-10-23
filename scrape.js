const request = require('request');
const cheerio = require('cheerio');

var fs = require ('fs');
let toFile=[];
let companyList=[
    "BA",
    "CAT",
    "CVX",
    "CSCO",
    "KO",
    "DOW",
    "XOM",
    "GS",
    "HD",
    "IBM",
    "INTC",
    "JNJ",
    "JPM",
    "MCD",
    "MRK",
    "MSFT",
    "NKE",
    "PFE",
    "PG",
    "TRV",
    "UNH",
    "UTX",
    "VZ",
    "V",
    "WMT",
    "WBA",
    "DIS"
    ]

function getData(data){

    let divData=[];

    for(var i=0;i<data.length;i++){
        console.log(data[i]);
        divData[i]=requestData(data[i]);
    }
    
    console.log(divData);
        
        // let sortedData = cleanData(rawData);
        // let readyData = dataToConstructor(sortedData);
}

getData(companyList);

function requestData(ticker){

    console.log(ticker);
    request('https://finance.yahoo.com/quote/'+ticker+'/history?period1=1540155600&period2=1571691600&interval=div%7Csplit&filter=div&frequency=1d',(error,response,html) =>{
        if(!error && response.statusCode == 200){
            const $ = cheerio.load(html);   
            let rawData = $("#Col1-1-HistoricalDataTable-Proxy").text();
            let sortedData = cleanData(rawData);
            console.log(sortedData);
            let readyData = dataToConstructor(sortedData,ticker);
            
            toFile.push(readyData);
            
        }
    });

        setTimeout(function(){
            saveData(toFile);
        },20000);
}


// Constructor
function dataToConstructor(data,ticker){
    class company{
        constructor(name,month,monthNum,day){
            this.name = name;
            this.month=[
                month
                ]
            this.monthNum=[
                monthNum
            ]
            this.day=[
                day
            ]
            
        }
    }
    if(data==null){
        return ticker;
    }

    let monthNumber=[]

    for(var i=0;i<data.length;i++){
        monthNumber[i]=toMonth(data[i][0])
    }

    let company1 = new company(ticker,data[0][0],monthNumber[0],data[0][1]);
    for(var i=1;i<data.length;i++){
        company1.month.push(data[i][0]);
        company1.monthNum.push(monthNumber[i]);
        company1.day.push(data[i][1]);  

    }
    return company1;
}

// Turn month to num
function toMonth(month){
    let num;
    switch(month){
        case 'Jan':
            num=0;
            break;
        case 'Feb':
            num=1;
            break;
        case 'Mar':
            num=2;
            break;
        case 'Apr':
            num=3;
            break;
        case 'May':
            num=4;
            break;
        case 'Jun':
            num=5;
            break;
        case 'Jul':
            num=6;
            break;
        case 'Aug':
            num=7;
            break;
        case 'Sep':
            num=8;
            break;
        case 'Oct':
            num=9;
            break;
        case 'Nov':
            num=10;
            break;
        case 'Dec':
            num=11;
            break;
        default:
            num=NaN;
    }
    return num;
}

// Clean data
function cleanData(data){
    let array=[];
        let word="";
        for(var i=67;i<data.length;i++){
           if(data[i]=='*'){
            //    console.log(word);
               break;
           }
           if(data[i]==','){
               continue;
           }

           if(word=="Dividend"){
               word="";
           }

           if(data[i]==" "){
            //    console.log(word);
                array.push(word);
                word="";
           }else{
               word+=data[i];
           }
        }

        let divDates=[];
        let count=0;
        for(var i=0;i<array.length;i=i+3){
            divDates[count]=[array[i],array[i+1],array[i+2].substring(0,4),array[i+2].substring(4)];
            console.log(array[i]+' '+array[i+1]+' '+array[i+2].substring(0,4)+' '+array[i+2].substring(4)
            );
            count++;
        }

        return divDates;
}

// Save data to file
function saveData(data){
    let fileData= fs.readFileSync('data/data.json');
    var words = JSON.parse(fileData);


    let dataToSave=JSON.stringify(data);
    fs.writeFileSync('data/data.json',dataToSave,finished); 
}


function finished(err){
    console.log('all set.');
}

