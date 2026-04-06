const API_URL = "https://script.google.com/macros/s/AKfycbxBOyWGNgg4IdDwDcAW8EkOdOcesfugAobts-YLYjmPWXrXTMJearq9xTGb1UrNJeM4/exec";

function trackStatus(){

const email = document.getElementById("trackEmail").value;

if(!email){
alert("Enter Email");
return;
}

fetch(API_URL + "?action=getCandidates")
.then(res=>res.json())
.then(data=>{

let found = false;

data.forEach(row=>{

if(row[2] === email){

found = true;

document.getElementById("resultBox").innerHTML = `
<h3>Status: ${row[9]}</h3>
<p>Resume Score: ${row[8]}</p>
<p>Match Percentage: ${row[8]}%</p>
<p>Applied Job: ${row[6]}</p>
`;

}

});

if(!found){
document.getElementById("resultBox").innerHTML =
"<p>No application found</p>";
}

});

}