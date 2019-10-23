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
    for(var i=0;i<data.length;i++){
        console.log(data[i].name);
        console.log(data[i].month);
    }

    // Display data
    for(var i=0;i<12;i++){
        let newDiv = document.createElement('div');
        let text=document.createTextNode(data[i].name);
        let dataSection = document.getElementById('data');
        dataSection.appendChild(newDiv);
        newDiv.appendChild(text);
    }
    
}