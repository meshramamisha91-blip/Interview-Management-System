
// =======================================
// 🚀 AI Resume System - Admin JS
// =======================================

// 🔥 IMPORTANT: Your Latest Deploy URL
const API_URL = "https://script.google.com/macros/s/AKfycbxBOyWGNgg4IdDwDcAW8EkOdOcesfugAobts-YLYjmPWXrXTMJearq9xTGb1UrNJeM4/exec";

// =======================================
// 🔐 LOGIN SYSTEM
// =======================================
if (document.getElementById("loginForm")) {

  document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    const btn = document.querySelector(".login-btn");
    const loader = document.querySelector(".loader");
    const text = document.querySelector(".btn-text");

    if(loader){
      loader.style.display = "inline-block";
      text.textContent = "Checking...";
      btn.disabled = true;
    }

    setTimeout(() => {

      if(email === "meshramamisha91@gmail.com" && password === "amisha123"){
        sessionStorage.setItem("adminLoggedIn", "true");
        window.location.href = "admin-dashboard.html";
      } else {
        document.getElementById("loginMessage").textContent = "Invalid Credentials ❌";
      }

      if(loader){
        loader.style.display = "none";
        text.textContent = "Login";
        btn.disabled = false;
      }

    }, 1000);

  });

}


// =======================================
// 👁 SHOW / HIDE PASSWORD
// =======================================
function togglePassword() {
  const passwordInput = document.getElementById("adminPassword");
  if(passwordInput){
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  }
}


// =======================================
// 📊 DASHBOARD PROTECTION + DATA FETCH
// =======================================

// If dashboard page
// =======================================
// 📊 DASHBOARD PROTECTION + DATA FETCH
// =======================================

if (window.location.pathname.includes("admin-dashboard")) {

  // 🔐 Protect dashboard
  if(sessionStorage.getItem("adminLoggedIn") !== "true"){
    window.location.href = "admin-login.html";
  }

  // 📊 Fetch dashboard stats
  fetch(API_URL + "?action=stats")
  .then(res => res.json())
  .then(data => {

    const totalApplicants = data.total;

document.getElementById("appProgress").style.width = "100%";

document.getElementById("shortProgress").style.width =
((data.shortlisted / totalApplicants) * 100) + "%";

document.getElementById("interviewProgress").style.width =
((data.interviews / totalApplicants) * 100) + "%";

document.getElementById("selectProgress").style.width =
((data.selected / totalApplicants) * 100) + "%";
    // Recent Activity

   const activity=document.getElementById("recentActivity");

   if(activity){

   activity.innerHTML=`
   <li>${data.total} candidates applied</li>
  <li>${data.shortlisted} candidates shortlisted</li>
  <li>${data.interviews} interviews scheduled</li>
  <li>${data.selected} candidates selected</li>
`;

}

    const total = document.getElementById("totalCount");
    const shortlisted = document.getElementById("shortlistedCount");
    const rejected = document.getElementById("rejectedCount");
    const interview = document.getElementById("interviewCount");
    const selected = document.getElementById("selectedCount");
    const rate = document.getElementById("selectionRate");

    if(total) total.innerText = data.total;
    if(shortlisted) shortlisted.innerText = data.shortlisted;
    if(rejected) rejected.innerText = data.rejected;
    if(interview) interview.innerText = data.interviews;
    if(selected) selected.innerText = data.selected;

    let selectionRate = 0;

    if(data.total > 0){
      selectionRate = ((data.selected / data.total) * 100).toFixed(1);
    }

    if(rate) rate.innerText = selectionRate + "%";
    
const ctx = document.getElementById("statusChart");

const gradient1 = ctx.getContext("2d").createLinearGradient(0,0,0,400);
gradient1.addColorStop(0,"#38bdf8");
gradient1.addColorStop(1,"#0ea5e9");

new Chart(ctx,{
type:"bar",
data:{
labels:["Shortlisted","Interview","Selected","Rejected"],
datasets:[{
label:"Candidates",
data:[
data.shortlisted,
data.interviews,
data.selected,
data.rejected
],
backgroundColor:gradient1,
borderRadius:10,
barThickness:50
}]
},
options:{
responsive:true,
plugins:{
legend:{display:false},
title:{
display:true,
text:"Candidate Status Overview",
color:"#ffffff",
font:{size:18}
}
},
scales:{
x:{
ticks:{color:"#cbd5f5"}
},
y:{
ticks:{color:"#cbd5f5"}
}
},
animation:{
duration:1500
}
}
});
  
  const pie = document.getElementById("pieChart");

new Chart(pie,{
type:"doughnut",
data:{
labels:["Shortlisted","Interview","Selected","Rejected"],
datasets:[{
data:[
data.shortlisted,
data.interviews,
data.selected,
data.rejected
],
backgroundColor:[
"#38bdf8",
"#a78bfa",
"#4ade80",
"#f87171"
],
borderWidth:0
}]
},
options:{
cutout:"60%",
plugins:{
legend:{
labels:{
color:"#ffffff",
font:{size:14}
}
},
title:{
display:true,
text:"Candidate Distribution",
color:"#ffffff",
font:{size:18}
}
},
animation:{
animateScale:true,
duration:1500
}
}
});
})
  
  .catch(err => console.log("Dashboard Error:", err));

}


// =======================================
// 🚪 LOGOUT FUNCTION
// =======================================
function logout(){
  sessionStorage.removeItem("adminLoggedIn");
  window.location.href = "admin-login.html";
}
// ================= APPLICATION PAGE =================

if (window.location.pathname.includes("admin-applications")) {

  fetch(API_URL + "?action=getCandidates")
    .then(res => res.json())
    .then(data => {
     
      data.sort((a, b) => b[8] - a[8]);   // ⭐ Resume Ranking

     const table = document.getElementById("candidateTable");

      function renderTable(filteredData) {
        table.innerHTML = "";

        filteredData.forEach(row => {

          const tr = document.createElement("tr");

tr.innerHTML = `
<td>${row[1]}</td>
<td>${row[2]}</td>

<td>${row[8]}</td>

<td>
<div class="progress-bar">
<div class="progress-fill" style="width:${row[8]}%">
${row[8]}%
</div>
</div>
</td>

<td>${row[9]}</td>

<td>
<button onclick="openResume('${row[7]}')">
View Resume
</button>
</td>

<td>
<div class="action-buttons">

<button class="shortlist-btn"
onclick="changeStatus('${row[0]}','Shortlisted')">
Shortlist
</button>

<button class="reject-btn"
onclick="changeStatus('${row[0]}','Rejected')">
Reject
</button>

<button class="interview-btn"
onclick="openInterviewModal('${row[0]}')">
Schedule
</button>

<button class="select-btn"
onclick="selectCandidate('${row[0]}')">
Select
</button>

<button class="reject-final-btn"
onclick="rejectAfterInterview('${row[0]}')">
Reject Final
</button>

</div>
</td>
`;
          table.appendChild(tr);
        });
      }

      renderTable(data);

      // 🔍 Search
      document.getElementById("searchInput").addEventListener("input", function() {
        const searchValue = this.value.toLowerCase();
        const filtered = data.filter(row =>
          row[1].toLowerCase().includes(searchValue)
        );
        renderTable(filtered);
      });

      // 🎯 Status Filter
      document.getElementById("statusFilter").addEventListener("change", function() {
        const selectedStatus = this.value;

        if (selectedStatus === "All") {
          renderTable(data);
        } else {
          const filtered = data.filter(row =>
            row[9] === selectedStatus
          );
          renderTable(filtered);
        }
      });

    });

}
let selectedId = "";

function openInterviewModal(id) {
  selectedId = id;
  document.getElementById("interviewModal").style.display = "flex";
}
function changeStatus(id, status){

fetch(API_URL,{
method:"POST",
body: JSON.stringify({
action:"updateStatus",
id:id,
newStatus:status
})
})
.then(res=>res.json())
.then(()=>{
alert("Status Updated ✅");
location.reload();
});

}

function closeModal() {
  document.getElementById("interviewModal").style.display = "none";
}


function saveInterview() {

  const date = document.getElementById("interviewDate").value;
  const time = document.getElementById("interviewTime").value;
  const link = document.getElementById("meetingLink").value;

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "scheduleInterview",
      id: selectedId,
      date: date,
      time: time,
      link: link
    })
  })
  .then(res => res.json())
  .then(() => {

    alert("Interview Scheduled ✅");

    closeModal();
    location.reload();

  });

}
function selectCandidate(id){

  const remarks = prompt("Enter remarks:");

  fetch(API_URL,{
    method:"POST",
    body: JSON.stringify({
      action:"finalResult",
      id:id,
      decision:"Selected",
      remarks:remarks
    })
  })
  .then(res=>res.json())
  .then(()=>{
    alert("Candidate Selected ✅");
    location.reload();
  });

}

function rejectAfterInterview(id){

  const remarks = prompt("Enter reason:");

  fetch(API_URL,{
    method:"POST",
    body: JSON.stringify({
      action:"finalResult",
      id:id,
      decision:"Rejected",
      remarks:remarks
    })
  })
  .then(res=>res.json())
  .then(()=>{
    alert("Candidate Rejected ❌");
    location.reload();
  });

}
// =======================
// JOB MANAGEMENT
// =======================

function createJob(){

const title=document.getElementById("jobTitle").value;
const skills=document.getElementById("jobSkills").value;
const description=document.getElementById("jobDescription").value;
const openDate=document.getElementById("jobOpenDate").value;
const closeDate=document.getElementById("jobCloseDate").value;

let actionType = "createJob";
let jobId = "";

if(window.editingJobId){
actionType = "updateJob";
jobId = window.editingJobId;
}

fetch(API_URL,{
method:"POST",
body:JSON.stringify({
action:actionType,
id:jobId,
title:title,
skills:skills,
description:description,
openDate:openDate,
closeDate:closeDate
})
})
.then(res=>res.json())
.then(()=>{
alert("Job saved successfully");
location.reload();
});

}

if(document.getElementById("jobTable")){

fetch(API_URL + "?action=getJobs")
.then(res => res.json())
.then(data => {

const table = document.getElementById("jobTable");

table.innerHTML = "";

data.forEach(job => {

const tr = document.createElement("tr");

tr.innerHTML = `
<td>${job[0]}</td>
<td>${job[1]}</td>
<td>${job[2]}</td>
<td>${job[3]}</td>
<td>${job[4]}</td>
<td>${job[5]}</td>

<td style="color:${job[6]=='Open'?'#4CAF50':'#f44336'}">
${job[6]}
</td>

<td>

<button class="edit-btn"
onclick="editJob('${job[0]}','${job[1]}','${job[2]}','${job[3]}')">
Edit
</button>

<button class="delete-btn"
onclick="deleteJob('${job[0]}')">
Delete
</button>

<button class="toggle-btn"
onclick="toggleJob('${job[0]}','${job[6]}')">
${job[6]=='Open'?'Close Job':'Open Job'}
</button>

</td>
`;

table.appendChild(tr);

});


})


.catch(err => console.log(err));

}



// Top Candidates

fetch(API_URL + "?action=getCandidates")
.then(res => res.json())
.then(data => {

data.sort((a,b)=>b[8]-a[8]);

const list=document.getElementById("topCandidates");

if(list){

list.innerHTML="";

data.slice(0,5).forEach((c,i)=>{

const li=document.createElement("li");

li.innerHTML=`#${i+1} ${c[1]} — <b>${c[8]}%</b>`;

list.appendChild(li);

});

}

});
// Candidate Ranking Table

fetch(API_URL + "?action=getCandidates")
.then(res => res.json())
.then(data => {

data.sort((a,b)=>b[8]-a[8]);

const table=document.getElementById("rankingTable");

if(table){

table.innerHTML="";

data.slice(0,10).forEach((c,i)=>{

const tr=document.createElement("tr");

tr.innerHTML=`
<td>${i+1}</td>
<td>${c[1]}</td>
<td>${c[2]}</td>
<td>${c[8]}%</td>
<td>${c[9]}</td>
`;

table.appendChild(tr);

});

}

});
// ============================
// Resume Preview Popup
// ============================

function openResume(link){

let previewLink = link.replace("/view","/preview");

document.getElementById("resumeFrame").src = previewLink;

document.getElementById("resumeModal").style.display = "flex";

}

function closeResume(){

document.getElementById("resumeModal").style.display = "none";

document.getElementById("resumeFrame").src = "";

}

fetch(API_URL + "?action=getInterviews")
.then(res => res.json())
.then(data => {
data.sort((a,b)=> new Date(a[1]) - new Date(b[1]));
const list = document.getElementById("interviewList");

if(!list) return;

list.innerHTML = "";

data.forEach(i => {

const date = new Date(i[1]).toLocaleDateString("en-GB");
const time = i[2];

const li = document.createElement("li");

li.innerHTML = `${i[0]} — ${date} | ${time}`;

list.appendChild(li);

});

})
.catch(err => console.log(err));
function editJob(id,title,skills,description){

document.getElementById("jobTitle").value = title;
document.getElementById("jobSkills").value = skills;
document.getElementById("jobDescription").value = description;

window.editingJobId = id;

}
function deleteJob(id){

if(!confirm("Delete this job?")) return;

fetch(API_URL,{
method:"POST",
body:JSON.stringify({
action:"deleteJob",
id:id
})
})
.then(res=>res.json())
.then(()=>{
alert("Job Deleted");
location.reload();
});

}
function toggleJob(id,status){

let newStatus = status === "Open" ? "Closed" : "Open";

fetch(API_URL,{
method:"POST",
body:JSON.stringify({
action:"updateJobStatus",
id:id,
status:newStatus
})
})
.then(res=>res.json())
.then(()=>{
alert("Job status updated");
location.reload();
});

}
setInterval(()=>{
const now=new Date();
document.getElementById("clock").innerHTML=
now.toLocaleTimeString()+"<br>"+now.toDateString();
},1000);
const hrTips = [

"Great hiring builds great companies.",
"Hire character. Train skill.",
"Your company is only as strong as your people.",
"Good recruitment creates great teams.",
"The right hire can change everything.",
"Recruit slowly but choose wisely.",
"Talent attracts talent.",
"Invest in people, they build the future.",
"Smart hiring is the key to company success.",
"People are the most valuable asset of any organization."

];

const tipElement = document.getElementById("quoteText");

if(tipElement){

const today = new Date().getDate();

const tipIndex = today % hrTips.length;

tipElement.innerText = hrTips[tipIndex];

}