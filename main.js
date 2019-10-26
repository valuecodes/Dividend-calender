let tickerList=[];
let dividendData;
let monthsName=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

class monthStack{
  constructor(name,number,count){
    this.name = [name];
    this.number=[number];
    this.count = [count];
  }
}

let monthTrack = new monthStack(monthsName[0],0,0);
console.log(monthsName);
for(var i=1;i<monthsName.length;i++){
  // console.log(monthsName[i]);
  monthTrack.name.push(monthsName[i]);
  monthTrack.number.push(i);
  monthTrack.count.push(0);
}

console.log(monthTrack);

// Track months
// for(var i=0;i<monthsName.length;i++){
//   console.log(monthsName[i]);
//   // monthStack[i][0]=monthsName[i];
//   monthStack[i].name.push(i;      
// }

// console.log(monthStack);

// Get dat from Git Hub
loadDoc("https://raw.githubusercontent.com/valuecodes/Dividend-calender/master/data/data.json", myFunction1);
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


function myFunction1(xhttp) {

    let data=JSON.parse(xhttp.responseText);
    dividendData=data;
    for(var i=0;i<data.length;i++){
        tickerList.push(data[i].name);
    }
    console.log(tickerList);

    // for(var i=0;i<data.length;i++){
    //     console.log(data[i].name);
    //     console.log(data[i].month);
    // }

    // Display data
    for(var i=0;i<36;i++){
        let newDiv = document.createElement('div');
        newDiv.className = "monthBlock";
        newDiv.id = 'month'+i;
        // let text=document.createTextNode('X');
        let dataSection = document.getElementById('data');
        dataSection.appendChild(newDiv);
        // newDiv.appendChild(text);
    }

 



    console.log(data);
    // let ticker=data[1];
    
    // createDivDates('DIS');
    

}

function createDivDates(companyName){

  let ticker;
  for(var i=0;i<dividendData.length;i++){
    if(dividendData[i].name==companyName){
      ticker=dividendData[i];
      break;
    }
    console.log(dividendData[i].name);
  }

    for(var i=0;i<ticker.month.length;i++){
      console.log((ticker.monthNum[i]+24-(monthTrack.count[ticker.monthNum[i]]*12)));
        let text=document.createTextNode(ticker.name);
        let selectedMonth=document.getElementById('month'+(ticker.monthNum[i]+24-(monthTrack.count[ticker.monthNum[i]]*12)));
        selectedMonth.appendChild(text);
        monthTrack.count[ticker.monthNum[i]]++;
    }
    console.log(monthTrack);
    ticker.isOn=1;
}


// Auto complete

function autocomplete(inp, arr) {

    document.getElementById('button').addEventListener('click',helloworld);

    function helloworld(){
      console.log(document.getElementById('myInput').textContent)
    }

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

    let flag=checkActive(e.target.textContent);
      
      if(flag==false){
        console.log(flag);
        createDivDates(e.target.textContent);
        flag=1;
      }
      
      console.log(e.target.textContent);
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