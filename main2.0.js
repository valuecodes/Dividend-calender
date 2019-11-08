let tickerList=[];
let dividendData;
let monthsName=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let isEmpty=true;

class monthStack{
  constructor(name,number,count,sum,activeList){
    this.name = [name];
    this.number=[number];
    this.count = [count];
    this.sum = [sum];
    this.activeList = activeList;
  }
}

// create month data
let monthTrack = new monthStack(monthsName[0],0,0,0,[]);

for(var i=1;i<monthsName.length;i++){
  monthTrack.name.push(monthsName[i]);
  monthTrack.number.push(i);
  monthTrack.count.push(0);
  monthTrack.sum.push(0);
}

// Get dat from Git Hub
loadDoc("https://raw.githubusercontent.com/valuecodes/Dividend-calender/master/data/newData.json", loadData);
function loadDoc(url, cFunction) {
  var xhttp;
  xhttp=new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      cFunction(this);
    }
 };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function loadData(xhttp) {
    let data=JSON.parse(xhttp.responseText);
    dividendData=data;
    for(var key in data){
        tickerList.push(key);
        data[key].isOn=false;
        data[key].position=[];
    }
    // Create data blocks
    createDataBlocks();
    // Create Month blocks
    createMonthBlocks();
    // Create Sum Blocks
    createSumBlocks();
    // Listen to searchbox
    autocomplete();
    for(var i=0;i<5;i++){
          let tickers=['CTY1S','INVEST','HOIVA','ROVIO','OLVAS','CTY1S'];
          createDivDates(tickers[i]);
        }
    console.log(monthTrack);

    calculateTotal();
}

// Craete Sum blocks
function createSumBlocks(){
  for(var i=0;i<12;i++){
    let newDiv = document.createElement('h3');
    newDiv.id='sum,'+i;
    let dataSection = document.getElementById('monthSum');
    dataSection.appendChild(newDiv);
  }
}

function createDataBlocks(){
  for(var i=4;i>=0;i--){
    for(var a=0;a<12;a++){
        let newDiv = document.createElement('div');
        newDiv.className = "monthBlock";
        newDiv.id = 'month'+i+','+a;
        let dataSection = document.getElementById('data');
        dataSection.appendChild(newDiv);
    }
  }
}

function createMonthBlocks(){
  for(var i=0;i<12;i++){
    let newDiv = document.createElement('h3');
    newDiv.id='monthName'+i;
    newDiv.textContent=monthTrack.name[i];
    let dataSection = document.getElementById('monthBlocks');
    dataSection.appendChild(newDiv);
  }
}


function createDivDates(ticker){
  // Append data to month Blocks
        for(var i=0;i<dividendData[ticker].payDate.length;i++){
          console.log(dividendData[ticker].payDate[i]);
          let text=document.createTextNode(ticker);
          let month=getMonth(dividendData[ticker].payDate[i]);
          let selectedMonth=document.getElementById('month'+monthTrack.count[month]+','+month);
          dividendData[ticker].position.push(selectedMonth.id);
          selectedMonth.appendChild(text);
          monthTrack.count[month]++;
        } 
    dividendData[ticker].isOn=true;
    monthTrack.activeList.push(ticker);
    addTickerTolist(ticker);
    getNextDividend();
    createColors();   
}

function createColors(){
  for(var i=0;i<12;i++){
    let id='monthName'+i;
    if(monthTrack.count[i]>0){
      document.getElementById(id).style.background='rgb(100, 200,'+50*monthTrack.count[i]+')';
    }
    if(monthTrack.count[i]==0){
      ;
      document.getElementById(id).style.background='rgb(186, 228, 214)';
    }
  }
}

function addTickerTolist(tickerKey){
    let text=document.createElement('div');
    text.textContent=tickerKey;
    text.className='activeTicker';
    text.id='active,'+tickerKey;
    let input=document.createElement('input',text.id);
    input.className='activeInput';
    input.addEventListener('input',()=>{calculateTotal()});

    let deleteButton=document.createElement('div');
    deleteButton.className='deleteButton';
    deleteButton.textContent='X';
    deleteButton.addEventListener('click',()=>{removeTicker(tickerKey)});
    let list=document.getElementById('dividendList');
    list.appendChild(text);
    text.appendChild(input);
    text.appendChild(deleteButton);
}

function calculateTotal(){
  for(var i=0;i<12;i++){
    monthTrack.sum[i]=0;
  }
  for(var i=0;i<monthTrack.activeList.length;i++){
      let ticker=monthTrack.activeList[i];
      let len=dividendData[ticker].dividend.length;
      for(var a=0;a<len;a++){
        let perShare=dividendData[ticker].dividend[a];
        // console.log(perShare);
        let shareCount=document.getElementById('active,'+ticker).children[0].value;
        if(shareCount!=""){
          let totalSum=perShare*shareCount;
          // console.log(totalSum);
          let month=getMonth(dividendData[ticker].payDate[a]);
          let prev=Number(monthTrack.sum[month]);
          let total=prev+=totalSum;
          total=Math.round(total*100 )/100;
          monthTrack.sum[month]=total.toFixed(2);
        }
      }
    }
    createTotal();
    // console.log(monthTrack.sum);
}

function createTotal(){
  for(var i=0;i<12;i++){
    let node = document.getElementById('sum,'+i);
    let sum = monthTrack.sum[i];
    node.textContent=sum;
  }
}

function removeTicker(ticker){
  for(var i=0;i<dividendData[ticker].position.length;i++){
    pushDown(dividendData[ticker].position[i],ticker,i);
  }
  dividendData[ticker].position=[];
  var elem = document.getElementById('active,'+ticker);
  elem.parentNode.removeChild(elem);
  dividendData[ticker].isOn=false;
  monthTrack.activeList=monthTrack.activeList.filter(item => item !== ticker);
  
  createColors();
  getNextDividend();
  calculateTotal();
}


// Push tickers down if there are tickers on top
function pushDown(position,ticker,i){
  document.getElementById(dividendData[ticker].position[i]).textContent="";
  let pos=dividendData[ticker].position[i].split('month')[1].split(',');
  let currentPosiotion=0;

  for(var a=pos[0];a<6;a++){
    let topMonth=document.getElementById('month'+(parseInt(a)+1)+','+pos[1]);
    let currentMonth = document.getElementById('month'+(parseInt(a))+','+pos[1]);
    dividendData[ticker].position
    currentMonth.textContent=topMonth.textContent;
    if(topMonth.textContent==""){
      break;
    }
    for(var b=0;b<dividendData[currentMonth.textContent].position.length;b++){
      if(dividendData[currentMonth.textContent].position[b].split(',')[1]==currentMonth.id.split(',')[1]){
        dividendData[currentMonth.textContent].position[b]=currentMonth.id;
      }
    }
    currentPosiotion++;
  }
  let month=getMonth(dividendData[ticker].payDate[i]);
  monthTrack.count[month]--;
}
 
function getMonth(date){
    month=date.split('.');
    return month[1]-1;
}

function getNextDividend(){
  var currentDate = new Date();
  var date = currentDate.getDate();
  var month = currentDate.getMonth(); 
  let year=2019;
  let flag=false;
  for(var i=month;i!=month-1;i++){
    if(i==12){
      i=0;
      year++;
    }
    if(monthTrack.count[i]>0){
      let companyName=document.getElementById('month0,'+i).textContent;
      let date=dividendData[companyName].payDate[0].split('.');  
      let endtime = (date[1]+' '+date[0]+' '+year); 
      getTimeRemaining(endtime)
      
      flag=true;
     break;
    }
  }
  if(flag==false){
    document.getElementById('countDown').textContent="";
  }
}

function getTimeRemaining(endtime){
  today = new Date();
  BigDay = new Date(endtime);
  msPerDay = 24 * 60 * 60 * 1000 ;
  timeLeft = (BigDay.getTime() - today.getTime());
  e_daysLeft = timeLeft / msPerDay;
  daysLeft = Math.floor(e_daysLeft);
  e_hrsLeft = (e_daysLeft - daysLeft)*24;
  hrsLeft = Math.floor(e_hrsLeft);
  minsLeft = Math.floor((e_hrsLeft - hrsLeft)*60);
  document.getElementById('countDown').textContent=daysLeft;
}


// Autocomplete
function autocomplete(){
  const search = document.getElementById('search');
  const matchList = document.getElementById('results');
  // Search tickerList
  const searchTickers = async searchText =>{
    data=dividendData; 
    let matches = Object.keys(data).filter(tickers =>{
      const regex = new RegExp(`^${searchText}`,'gi');
      return tickers.match(regex) || data[tickers].name.match(regex);
    });
  
    if(searchText.length === 0){
      matches = [];
    }
    clearResults();
    outPutHTML(matches)
  }
  
  // Clear Previous results
  function clearResults(){
    const parent = document.getElementById("result");
      while (parent.firstChild) {
      parent.firstChild.remove();
    }
  }
  
  // Show results in HTML
  const outPutHTML = matches =>{
    for(var i=0;i<matches.length;i++){
      let searchResult=document.createElement('div');
      searchResult.className='searchResult';
      let tickerName=document.createElement('div');
      let companyName=document.createElement('div');
      tickerName.textContent=matches[i];
      companyName.textContent=data[matches[i]].name;
      let results=document.getElementById('result');
      results.appendChild(searchResult); 
      searchResult.appendChild(tickerName);
      searchResult.appendChild(companyName);
      if(i==10){
        break;
      }
    }
    var selected = document.getElementsByClassName("searchResult");
    var listen = function() {
      var ticker = this.firstChild.textContent;
      if(dividendData[ticker].isOn==false){

        // for(var i=0;i<5;i++){
        //   let tickers=['CTY1S','INVEST','HOIVA','ROVIO','OLVAS','CTY1S'];
        //   createDivDates(tickers[i]);
        // }
        createDivDates(ticker);
      }
      document.getElementById('search').value='';
      clearResults();
    }
    for (var i = 0; i < selected.length; i++) {  
      selected[i].addEventListener('click', listen, false);
  }
  };
  search.addEventListener('input', () => searchTickers(search.value));
}


