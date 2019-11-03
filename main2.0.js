let tickerList=[];
let dividendData;
let monthsName=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let isEmpty=true;

class monthStack{
  constructor(name,number,count){
    this.name = [name];
    this.number=[number];
    this.count = [count];
  }
}

// create month data
let monthTrack = new monthStack(monthsName[0],0,0);
for(var i=1;i<monthsName.length;i++){
  monthTrack.name.push(monthsName[i]);
  monthTrack.number.push(i);
  monthTrack.count.push(0);
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
    }
    // Create data blocks
    createDataBlocks();
    // Create Month blocks
    createMonthBlocks();
    // Listen to searchbox
    autocomplete();
}

function createDataBlocks(){
  for(var i=0;i<60;i++){
        let newDiv = document.createElement('div');
        newDiv.className = "monthBlock";
        newDiv.id = 'month'+i;
        let dataSection = document.getElementById('data');
        dataSection.appendChild(newDiv);
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
          let text=document.createTextNode(ticker);
          let month=getMonth(dividendData[ticker].payDate[i]);
          let selectedMonth=document.getElementById('month'+(month+48-(monthTrack.count[month]*12)));
          selectedMonth.appendChild(text);
          monthTrack.count[month]++;
        }
    // Create colors for monthNames
    for(var i=0;i<12;i++){ 
      if(monthTrack.count[i]>0){
        let id='monthName'+i;
        document.getElementById(id).style.background='rgb(100, 200,'+50*monthTrack.count[i]+')';
      }
    }
    dividendData[ticker].isOn=true;
    // --------------------------------------------------------------------------
    addTickerTolist(dividendData[ticker]);

    getNextDividend();
}

function addTickerTolist(ticker){
    console.log(ticker.name);
    let text=document.createElement('div');
    text.textContent=ticker.name;
    console.log(text);
    let list=document.getElementById('dividendList');
    list.appendChild(text);
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
  for(var i=month;i!=month-1;i++){
    if(i==12){
      i=0;
      year++;
    }
    if(monthTrack.count[i]>0){
      let companyName=document.getElementById('month'+(i+(4*12))).textContent;
      let date=dividendData[companyName].payDate[0].split('.');  
      let endtime = (date[1]+' '+date[0]+' '+year); 
      getTimeRemaining(endtime)
     break;
    }  
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
    }
    var selected = document.getElementsByClassName("searchResult");
    var listen = function() {
      var ticker = this.firstChild.textContent;
      if(dividendData[ticker].isOn==false){
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