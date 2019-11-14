let tickerList=[];
let dividendData;
let monthsName=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let isEmpty=true;
let globalX=0;

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
    // create Dividend Lists
    createDividendLists();
    // Create data blocks
    createDataBlocks();
    // Create Month blocks
    createMonthBlocks();
    // Listen to searchbox
    autocomplete();

    let i=0;
    for(var key in data){
      createDivDates(key);
      if(i==40){
        break;
      }
      i++;
    }
    // Listen dividend goal inputs
    dividendTargets();
    calculateTotal();
    createChart(monthTrack.name,monthTrack.sum)
    // Set overflow to start at the bottom
    overFlowBottom();
    
}

let dividendTargets=()=>{
  let monthGoal=document.getElementById('targetMonth');
  let yearGoal=document.getElementById('targetYear');
  // Remove text from input
  monthGoal.addEventListener('focusin',() => {
    yearGoal.value=yearGoal.value.split(' ')[0];
    monthGoal.value=monthGoal.value.split(' ')[0];
  });
  yearGoal.addEventListener('focusin',() => {
    yearGoal.value=yearGoal.value.split(' ')[0];
    monthGoal.value=monthGoal.value.split(' ')[0];
  });
  // Read value from Input and update chart
  monthGoal.addEventListener('input',() => {
    yearGoal.value=monthGoal.value*12;
    createChart(monthTrack.name,monthTrack.sum);
  });
  yearGoal.addEventListener('input',() => {
    monthGoal.value=(yearGoal.value/12).toFixed(2);
    createChart(monthTrack.name,monthTrack.sum);
  });
  // Add text to input
  monthGoal.addEventListener('focusout',() => {
    if(monthGoal.value>0||monthGoal.value==' '){
      yearGoal.value+=' €/Year';
      monthGoal.value+=' €/Month';
    }else{
      yearGoal.value+='';
      monthGoal.value+='';
    }
  });
  yearGoal.addEventListener('focusout',() => {
    if(yearGoal.value>0||yearGoal.value==' '){
      yearGoal.value+=' €/Year';
      monthGoal.value+=' €/Month';
    }else{
      yearGoal.value+='';
      monthGoal.value+='';
    }
  });
}

let testit=(goal)=>{
  console.log(goal)
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
  for(var i=30;i>=0;i--){
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
          let text=document.createTextNode(ticker);
          let month=getMonth(dividendData[ticker].payDate[i]);
          let selectedMonth=document.getElementById('month'+monthTrack.count[month]+','+month);
          dividendData[ticker].position.push(selectedMonth.id);
          selectedMonth.appendChild(text);
          monthTrack.count[month]++;
          addMonthBlockStyle(selectedMonth.id,'on');
        } 
    dividendData[ticker].isOn=true;
    monthTrack.activeList.push(ticker);
    addTickerTolist(ticker);
    getNextDividend();
    // createColors();   
    overFlowBottom();
}

let createDividendLists=()=>{
  for(var i=0;i<10;i++){
    let list=document.createElement('div');
    list.className='tickerList';
    list.id='tickerList.'+i;
    list.style.zIndex=10-i;
    let activeList=document.getElementById('dividendList');
    activeList.appendChild(list);
  } 
}

let addMonthBlockStyle=(selectedMonth,check)=>{
  let monthBlock=document.getElementById(selectedMonth);
  if(check=='on'){  
    monthBlock.style.border='3px solid';
    monthBlock.style.borderRadius = '7px'
    monthBlock.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
  }else{
    monthBlock.style.border='';
    monthBlock.style.borderRadius = ''
    monthBlock.style.backgroundColor = '';
  }
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
    console.log(Math.floor((monthTrack.activeList.length-1)/10));
    let list=document.getElementById('tickerList.'+Math.floor((monthTrack.activeList.length-1)/10));
    list.appendChild(text);
    text.appendChild(input);
    text.appendChild(deleteButton);
    overFlowBottom();
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
        let shareCount=document.getElementById('active,'+ticker).children[0].value;
        if(shareCount!=""){
          let totalSum=perShare*shareCount;
          let month=getMonth(dividendData[ticker].payDate[a]);
          let prev=Number(monthTrack.sum[month]);
          let total=prev+=totalSum;
          total=Math.round(total*100 )/100;
          monthTrack.sum[month]=total.toFixed(2);
        }
      }
    }
    createChart(monthTrack.name,monthTrack.sum);
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
  
  // createColors();
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
      addMonthBlockStyle(currentMonth.id,'off');
      break;
    }
    for(var b=0;b<dividendData[currentMonth.textContent].position.length;b++){
      if(dividendData[currentMonth.textContent].position[b].split(',')[1]==currentMonth.id.split(',')[1]){
        dividendData[currentMonth.textContent].position[b]=currentMonth.id;
        if(topMonth==""){
          addMonthBlockStyle(topMonth.id,'off');
        }
      }
    }
    currentPosiotion++;
  }
  let month=getMonth(dividendData[ticker].payDate[i]);
  monthTrack.count[month]--;
  overFlowBottom();
  console.log(pos);
  updateTickerList();
}

let updateTickerList=()=>{

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

function createChart(name,sum){
  let divTarget=false;
  let targetData=checkTarget();
  let average=getAverage(sum);
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: name,
          
          datasets: [{
            label:'Dividends',
            data: sum,
            backgroundColor:'rgba(55, 199, 132, 0.5)',
          }, {
            label: 'Average',
            data: average,
            borderColor:'rgba(55, 99, 232, 0.9)',
            backgroundColor:'rgba(25, 140, 232, 0.7)',
            type: 'line'
        },
        {
          label:'Target',
          data: targetData,
          borderColor:'rgba(345, 129, 132, 0.9)',
          backgroundColor:'rgba(325, 159, 112, 0.9)',
          type: 'line',
          fill:false,
          hidden:divTarget
      }
        ],
      },
      options: {
        layout: {
        padding: {
            left: 0,
            right: 0,
            top: 38,
            bottom: 0
        }
    },
    tooltips: {enabled: false},
    hover: {mode: null},
        responsive: true, 
  maintainAspectRatio: false,
          legend: {
              display: true,
              position: 'right',
              align:'start',
              labels: { 
              fontSize: 30,
              filter: function(item, chart) {
                if(divTarget!=false){
                  return !item.text.includes('Target');
                }else{
                  return item.text;
                }
                
            }
              }
            
          },
          scales: {
            xAxes: [{
              ticks:{
                fontSize:20
              }
            }],
              yAxes: [{
                  ticks: {
                    margin: 100,
                      fontSize: 20,         
                      maxTicksLimit: 8,
                      beginAtZero: true,
                      callback: function(value,index,values){
                        return value+'€'+' ';
                      },
                  }
              }]
          },
          animation: {
            duration: 500,
            easing: "easeOutQuart",
            onComplete: function () {
                var ctx = this.chart.ctx;
                ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.font = '20px';
                this.data.datasets.forEach(function (dataset) {
                    for (var i = 0; i < dataset.data.length; i++) {
                        var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                            scale_max = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale.maxHeight;
                        ctx.fillStyle = '#444';
                        ctx.font = "30px Helvetica";
                        var y_pos = model.y - 5;
                        if ((scale_max - model.y) / scale_max >= 0.93)
                            y_pos = model.y + 30;
                        if(dataset.data[i]>0 && dataset.data[i]!=average[0]&& dataset.data[i]!=targetData[0]){
                          ctx.fillText(dataset.data[i]+'€', model.x, y_pos);
                        }
                    }
                });               
            }
        }
      }
  });
  
  let xPos=myChart.config.data.datasets[1]._meta[globalX].dataset._children[0]._model.y;
  let targetPos=myChart.config.data.datasets[2]._meta[globalX].dataset._children[0]._model.y;
  globalX++;

  setAverageY(xPos,average[11]);
  setTargetPos(targetPos,targetData[11]);
  calculateAmounts();  
  
  myChart.canvas.parentNode.style.height = '400px';
  myChart.canvas.parentNode.style.width = 1700+'px';
  updateChartWidth(myChart);
}

let updateChartWidth=(myChart)=>{
  let width= window.innerWidth;
  myChart.canvas.parentNode.style.width = width-200+'px';
  window.addEventListener('resize', function(event){
    ;
    let width= window.innerWidth;
    myChart.canvas.parentNode.style.width = width-200+'px';
  });
}

let calculateAmounts=()=>{
  let total=0;
  for(var i=0;i<12;i++){
    total+=parseFloat(monthTrack.sum[i]);
  }
  total=total.toFixed(2);
  document.getElementById('amountYear').textContent='Year:\xa0\xa0\xa0\xa0'+total+
  ' €';
  document.getElementById('amountMonth').textContent='Month:\xa0'+(total/12).toFixed(2)+
  ' €';
  document.getElementById('amountDay').textContent='Day:\xa0\xa0\xa0\xa0\xa0'+(total/365).toFixed(2)+
  ' €';
}

let setTargetPos=(targetPos,targetData)=>{
  let average=document.getElementById('averageDivPoint').textContent;
  let arrow=document.getElementById('targetArrow')
  let percent=average.split(' ')[0]/targetData;
  let targetPoint=document.getElementById('targetPoint');
  
  if((percent*100).toFixed(2)==isNaN||(percent*100).toFixed(2)==Infinity){
    percent=0;
  }else{
    percent=(percent*100).toFixed(2);
  }
  if(targetPos==69||percent==NaN){
    targetPoint.textContent='0%'
    arrow.style.marginTop=344+'px';
  }else{
      if(percent<=100){
        targetPoint.textContent=percent+'%';
        arrow.style.marginTop=targetPos-12+'px';
      }else{
        targetPoint.textContent='Target reached';
        arrow.style.marginTop=targetPos-12+'px';
      }    
  }
  if(targetPoint.textContent=='Target NaN%'||targetData==0){
    targetPoint.textContent='0%';
  }
}

let setAverageY=(xPos,number)=>{
  let average=document.getElementById('average');
  let averageDivPoint=document.getElementById('averageDivPoint');
  if(xPos<200){
    average.style.marginTop=-73+'px';
    averageDivPoint.style.marginTop=10+'px';
    document.getElementById('averageDivPoint').textContent=0+' €';
  }else{
    average.style.marginTop=-429+xPos+'px';
    // averageDivPoint.style.marginTop=-355+xPos+'px';
    if(number.toString().length>7){
      number=Math.round(number);
    }
    document.getElementById('averageDivPoint').textContent=number+' €';
  }
}

// Get average for average line 
let getAverage=(data)=>{
  let total=0;
  for(var i=0;i<12;i++){
    total+=parseFloat(data[i]);
  }
  total=total/12;
  let totalArray=[];
  for(var i=0;i<12;i++){
    totalArray.push(parseFloat(total.toFixed(2)));
  }
  return totalArray;
}

// Check if target is filled and create array for target line
let checkTarget=()=>{
  let target=document.getElementById('targetMonth').value;
  let total=[];
  for(var i=0;i<12;i++){
      if(target==""){
        total.push(0);
      }else{
        total.push(parseFloat(target));
      }
      
  }
  return total;
}

let openActiveMenu=()=>{
  let state=document.getElementById('activeNav').childNodes[1].id;
  let count=((monthTrack.activeList.length-1)/10)+1;
  console.log(monthTrack.activeList.length);
  if(state=='closed'){
    document.getElementById('activeList').style.transition='all 0.6s';
    document.getElementById('activeNav').style.transition='all 0.6s';
    document.getElementsByClassName('openActive')[0].style.transition='all 0.6s';
    document.getElementById('activeList').style.width=count*170+'px';
    document.getElementById('activeNav').style.width=count*170+'px';
    document.getElementsByClassName('openActive')[0].style.marginLeft=(count*170)-170+'px';document.getElementById('activeNav').childNodes[1].id='open';
    for(var i=0;i<count;i++){
      document.getElementById('tickerList.'+i).style.transition='all 0.6s';
      document.getElementById('tickerList.'+i).style.marginLeft=170*i+'px';
    }
  }else{
    document.getElementById('activeList').style.transition='all 0.6s';
    document.getElementById('activeNav').style.transition='all 0.6s';
    document.getElementsByClassName('openActive')[0].style.transition='all 0.6s';
    document.getElementById('activeList').style.width='170px';
    document.getElementById('activeNav').style.width='170px';
    document.getElementsByClassName('openActive')[0].style.marginLeft='0px';
    document.getElementById('activeNav').childNodes[1].id='closed';
    for(var i=0;i<count;i++){
      console.log('tickerList.'+i);
      document.getElementById('tickerList.'+i).style.transition='all 0.6s';
      document.getElementById('tickerList.'+i).style.marginLeft='0px';
    }
  }
}

// Set overflow to bottom
let overFlowBottom=()=>{
  var div = document.getElementById("data");
  div.scrollTop = div.scrollHeight;
}