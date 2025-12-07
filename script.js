const poList = ["PO1", "PO2"];
const divisions = {
  "Dhaka": ["Dhaka", "Gazipur"],
  "Chattogram": ["Chattogram", "Cox's Bazar"]
};
const districts = {
  "Dhaka": ["Savar", "Dhamrai"],
  "Gazipur": ["Tongi", "Kaliakair"],
  "Chattogram": ["Chattogram Sadar", "Anwara"],
  "Cox's Bazar": ["Cox's Bazar Sadar", "Ukhia"]
};
const upazillas = {
  "Savar": ["Savar Upazilla 1", "Savar Upazilla 2"],
  "Dhamrai": ["Dhamrai Upazilla 1"],
  "Tongi": ["Tongi Upazilla 1"],
  "Kaliakair": ["Kaliakair Upazilla 1"],
  "Chattogram Sadar": ["Sadar Upazilla 1"],
  "Anwara": ["Anwara Upazilla 1"],
  "Cox's Bazar Sadar": ["Sadar Upazilla 1"],
  "Ukhia": ["Ukhia Upazilla 1"]
};
const branches = ["Branch 1", "Branch 2"];

// Populate dropdowns
const poSelect = document.getElementById("po");
poList.forEach(po => poSelect.add(new Option(po, po)));

const divisionSelect = document.getElementById("division");
Object.keys(divisions).forEach(d => divisionSelect.add(new Option(d, d)));

const districtSelect = document.getElementById("district");
const upazillaSelect = document.getElementById("upazilla");
const branchSelect = document.getElementById("branch");

divisionSelect.addEventListener("change", () => {
  districtSelect.innerHTML = "";
  const div = divisionSelect.value;
  divisions[div].forEach(d => districtSelect.add(new Option(d, d)));
  districtSelect.dispatchEvent(new Event("change"));
});

districtSelect.addEventListener("change", () => {
  upazillaSelect.innerHTML = "";
  const dist = districtSelect.value;
  (upazillas[dist] || []).forEach(u => upazillaSelect.add(new Option(u, u)));
});

upazillaSelect.addEventListener("change", () => {
  branchSelect.innerHTML = "";
  branches.forEach(b => branchSelect.add(new Option(b, b)));
});

// Handle form submission
document.getElementById("employeeForm").addEventListener("submit", e => {
  e.preventDefault();

  const payload = {
    po: poSelect.value,
    division: divisionSelect.value,
    district: districtSelect.value,
    upazilla: upazillaSelect.value,
    branch: branchSelect.value,
    name: document.getElementById("name").value,
    designation: document.getElementById("designation").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    phone: document.getElementById("phone").value
  };

  fetch("https://script.google.com/macros/s/AKfycbwKzuwfp1tHdZY39FJtFJquOO6nrRlIW49xv2rtZGe8QfHJxDkBtrXY1jWjISOn66pu/exec", { 
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.result === "success") {
      alert("Employee added successfully!");
      document.getElementById("employeeForm").reset();
    } else {
      alert("Error: " + data.message);
    }
  })
  .catch(err => alert("Fetch error: " + err));
});

