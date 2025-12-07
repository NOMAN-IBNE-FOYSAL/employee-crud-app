const data = {
  "PO1": {
    "Dhaka": {
      "Dhaka": {
        "Dhanmondi": ["Branch A", "Branch B"],
        "Mirpur": ["Branch C"]
      },
      "Gazipur": {
        "Tongi": ["Branch D"],
        "Kaliakair": ["Branch E"]
      }
    },

    "Chattogram": {
      "Chattogram": {
        "Pahartali": ["Branch F"]
      }
    }
  }
};

// ======== DOM ELEMENTS =========
const poSelect = document.getElementById("po");
const divisionSelect = document.getElementById("division");
const districtSelect = document.getElementById("district");
const upazillaSelect = document.getElementById("upazilla");
const branchSelect = document.getElementById("branch");

// ======== POPULATE PO =========
Object.keys(data).forEach(po => {
  poSelect.innerHTML += <option value="${po}">${po}</option>;
});

// ======== ON PO CHANGE =========
poSelect.addEventListener("change", () => {
  divisionSelect.innerHTML = "<option value=''>Select Division</option>";
  districtSelect.innerHTML = "<option value=''>Select District</option>";
  upazillaSelect.innerHTML = "<option value=''>Select Upazilla</option>";
  branchSelect.innerHTML = "<option value=''>Select Branch</option>";

  const divisions = data[poSelect.value];
  if (!divisions) return;

  Object.keys(divisions).forEach(div => {
    divisionSelect.innerHTML += <option value="${div}">${div}</option>;
  });
});

// ======== ON DIVISION CHANGE =========
divisionSelect.addEventListener("change", () => {
  districtSelect.innerHTML = "<option value=''>Select District</option>";
  upazillaSelect.innerHTML = "<option value=''>Select Upazilla</option>";
  branchSelect.innerHTML = "<option value=''>Select Branch</option>";

  const districts = data[poSelect.value][divisionSelect.value];
  if (!districts) return;

  Object.keys(districts).forEach(dis => {
    districtSelect.innerHTML += <option value="${dis}">${dis}</option>;
  });
});

// ======== ON DISTRICT CHANGE =========
districtSelect.addEventListener("change", () => {
  upazillaSelect.innerHTML = "<option value=''>Select Upazilla</option>";
  branchSelect.innerHTML = "<option value=''>Select Branch</option>";

  const upz = data[poSelect.value][divisionSelect.value][districtSelect.value];
  if (!upz) return;

  Object.keys(upz).forEach(u => {
    upazillaSelect.innerHTML += <option value="${u}">${u}</option>;
  });
});

// ======== ON UPAZILLA CHANGE =========
upazillaSelect.addEventListener("change", () => {
  branchSelect.innerHTML = "<option value=''>Select Branch</option>";

  const branches =
    data[poSelect.value][divisionSelect.value][districtSelect.value][upazillaSelect.value];

  if (!branches) return;

  branches.forEach(b => {
    branchSelect.innerHTML += <option value="${b}">${b}</option>;
  });
});

// ======== FORM SUBMISSION =========
document.getElementById("employeeForm").addEventListener("submit", function (e) {
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

  fetch("https://script.google.com/macros/s/AKfycbz6WowyBXEdiN9iAfHS1fkfCsvyq0Ymaxc2v6LFpEJ4LBcG548RmNgURALpe4BRu8nH/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data.result === "success") {
        alert("Employee added successfully");
        document.getElementById("employeeForm").reset();
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(err => alert("Request failed: " + err));
});
  .catch(err => alert("Fetch error: " + err));
});



