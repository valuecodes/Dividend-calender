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
loadDoc("https://raw.githubusercontent.com/valuecodes/Dividend-calender/master/data/data.json", loadData);
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
    for(var i=0;i<data.length;i++){
        tickerList.push(data[i].name);
    }

    // Create data blocks
    createDataBlocks();
    // Create Month blocks
    createMonthBlocks();
    
}

function createDataBlocks(){
  for(var i=0;i<36;i++){
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

function createDivDates(companyName){
  // Search data
  let ticker = searchCompany(companyName);
  
  // Append data to month Blocks
    for(var i=0;i<ticker.month.length;i++){
        let text=document.createTextNode(ticker.name);
        let selectedMonth=document.getElementById('month'+(ticker.monthNum[i]+24-(monthTrack.count[ticker.monthNum[i]]*12)));
        selectedMonth.appendChild(text);
        monthTrack.count[ticker.monthNum[i]]++;
    }
    // Create colors for monthNames
    for(var i=0;i<12;i++){ 
      if(monthTrack.count[i]>0){
        let id='monthName'+i;
        document.getElementById(id).style.background='rgb(100, 200,'+50*monthTrack.count[i]+')';
      }
    }
    getNextDividend();
    ticker.isOn=1;
}


// Auto complete

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }

  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {

    // create data for chart
    let flag=checkActive(e.target.textContent);      
      if(flag==false){
        createDivDates(e.target.textContent);
        flag=1;
        isEmpty=false;
      }
      closeAllLists(e.target);
  });
  }
}

// check if ticker is already displayed on the chart
function checkActive(ticker){
  for(var i=0;i<dividendData.length;i++){
    if(dividendData[i].name==ticker && dividendData[i].isOn == undefined){
      return false;
      break;
    }
  }
  return true;
}


// setInterval(function(){
//   if(isEmpty==false){
//     var clock = document.getElementById('countDown');
//     clock.innerHTML = getCurrentTime();
//   }
  
// }, 1000);

// function getCurrentTime() {
//   var currentDate = new Date();
//   var hours = currentDate.getHours() < 10 ? '0' + currentDate.getSeconds() : currentDate.getHours();
//   hours === 0 ? hours = 12 : hours = hours;
//   var minutes = currentDate.getMinutes();
//   var seconds = currentDate.getSeconds() < 10 ? '0' + currentDate.getSeconds() : currentDate.getSeconds();
//   var date = currentDate.getDate();
//   var month = currentDate.getMonth(); 
//   getNextDividend(month,date);
//   var currentTime ='Day '+date+' Month '+month+' Hours '+ hours + ' Min ' + minutes + ' Sec ' + seconds;
//   return currentTime;
// }

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
      let companyName=document.getElementById('month'+(i+(2*12))).textContent;
      let ticker = searchCompany(companyName);
      // console.log(ticker.monthNum.length);
      for(var a=0;a<ticker.monthNum.length;a++){
        // console.log(ticker.monthNum[a]);
        if(ticker.monthNum[a]==i){
          let endtime=(ticker.monthNum[a]+1)+' '+ticker.day[a]+' '+year;
          getTimeRemaining(endtime)
          break;
        }
      }
      // console.log(ticker.monthNum[1]);
     break;
    }
    
  }
  // console.log(month+'  '+date+'  '+'  ');
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
  console.log(daysLeft);

  // console.log(endtime);
  // var t = Date.parse(endtime) - Date.parse(new Date());
  // console.log(t)
  // var seconds = Math.floor( (t/1000) % 60 );
  // var minutes = Math.floor( (t/1000/60) % 60 );
  // var hours = Math.floor( (t/(1000*60*60)) % 24 );
  // var days = Math.floor( t/(1000*60*60*24) );
  // console.log(-days+'   '+-hours);
}

// Search company
function searchCompany(companyName){
  let ticker;
  for(var i=0;i<dividendData.length;i++){
      if(dividendData[i].name==companyName){
        ticker=dividendData[i];
        break;
      }
    }
  return ticker;
}