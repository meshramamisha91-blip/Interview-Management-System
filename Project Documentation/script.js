const API_URL = "https://script.google.com/macros/s/AKfycbxBOyWGNgg4IdDwDcAW8EkOdOcesfugAobts-YLYjmPWXrXTMJearq9xTGb1UrNJeM4/exec";

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("candidateForm");
  const button = document.querySelector(".submit-btn");
  const btnText = document.querySelector(".btn-text");
  const loader = document.querySelector(".loader");

  // LOAD JOB LIST

fetch(API_URL + "?action=getJobs")
.then(res => res.json())
.then(data => {

const select = document.getElementById("jobSelect");

select.innerHTML = "<option value=''>Select Job</option>";

data.forEach(job => {

if(job[6].trim().toLowerCase() !== "open") return;

const option = document.createElement("option");

option.value = job[0];
option.textContent = job[1];

select.appendChild(option);

});

})
.catch(err=>{
console.log("Job load error:", err);
});
  // =========================
  // FORM SUBMIT
  // =========================

  form.addEventListener("submit", function (e) {

    e.preventDefault();

    const phone = document.getElementById("phone").value;

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter valid 10 digit mobile number");
      return;
    }

    const file = document.getElementById("resumeFile").files[0];

    if (!file) {
      alert("Please upload resume");
      return;
    }

    button.disabled = true;
    loader.style.display = "inline-block";
    btnText.textContent = "Submitting...";

    const reader = new FileReader();

    reader.onload = function () {

  const base64 = reader.result.split(",")[1];

  const skills = Array.from(
    document.querySelectorAll(".skills-options input:checked")
  ).map(skill => skill.value).join(",");

  const data = {
    action: "registerCandidate",
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: phone,
    skills: skills,
    experience: document.getElementById("experience").value,
    job: document.getElementById("jobSelect").value,
    fileData: base64,
    fileName: file.name
  };

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(response => {

    if(response.status === "duplicate"){
      alert("You already applied with this email ❌");
      button.disabled = false;
      loader.style.display = "none";
      btnText.textContent = "Apply Now";
      return;
    }

    alert("Application Submitted Successfully ✅");

    form.reset();

    button.disabled = false;
    loader.style.display = "none";
    btnText.textContent = "Apply Now";

  })
  .catch(err => {

    console.log(err);
    alert("Submission failed");

    button.disabled = false;
    loader.style.display = "none";
    btnText.textContent = "Apply Now";

  });

};
    

    reader.readAsDataURL(file);

  });

})
function loginCandidate(){

const id = document.getElementById("candidateId").value;
const email = document.getElementById("candidateEmail").value;

fetch(API_URL + "?action=getCandidate&id=" + id + "&email=" + email)
.then(res => res.json())
.then(data => {

if(data.status === "notfound"){

document.getElementById("loginMsg").innerText = "Invalid Login ❌";

}else{

sessionStorage.setItem("candidateData", JSON.stringify(data));

window.location.href = "candidate-dashboard.html";

}

});

}
if(window.location.pathname.includes("candidate-dashboard")){

const data = JSON.parse(sessionStorage.getItem("candidateData"));

document.getElementById("candidateData").innerHTML = `
<p><b>Name:</b> ${data.name}</p>
<p><b>Email:</b> ${data.email}</p>
<p><b>Score:</b> ${data.score}%</p>
<p><b>Status:</b> ${data.status}</p>
<p><b>Interview Date:</b> ${data.date || "Not Scheduled"}</p>
<p><b>Interview Time:</b> ${data.time || "-"}</p>
<p><b>Meeting Link:</b> ${data.link ? `<a href="${data.link}" target="_blank">Join Interview</a>` : "-"}</p>
`;

}