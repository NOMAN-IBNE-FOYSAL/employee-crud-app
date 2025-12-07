// ---------------------- Data Structure ----------------------
// PO -> Division -> District -> Upazilla -> Branch Array
const data = {
  "PO1": {
    "Dhaka Division": {
      "Dhaka District": {
        "Dhanmondi": ["Branch A", "Branch B"],
        "Mirpur": ["Branch C"]
      },
      "Gazipur District": {
        "Tongi": ["Branch D"],
        "Kaliakair": ["Branch E"]
      }
    },
    "Chattogram Division": {
      "Chattogram District": {
        "Pahartali": ["Branch F"]
      }
    }
  },

  "PO2": {
    "Rajshahi Division": {
      "Rajshahi District": {
        "Boalia": ["Branch G"]
      }
    }
  }
};

// ---------------------- Helper Functions ----------------------
const el = id => document.getElementById(id);

function clearSelect(sel, placeholder) {
  sel.innerHTML = "";
  const opt = document.createElement("option");
  opt.value = "";
  opt.textContent = placeholder;
  sel.appendChild(opt);
}

function addOption(sel, value, label) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = label ?? value;
  sel.appendChild(opt);
}

// ---------------------- DOM Elements ----------------------
const poSelect = el('po');
const divisionSelect = el('division');
const districtSelect = el('district');
const upazillaSelect = el('upazilla');
const branchSelect = el('branch');

// ---------------------- INIT ----------------------
document.addEventListener("DOMContentLoaded", init);

function init() {
  try {
    // Populate PO dropdown
    clearSelect(poSelect, "Select PO");
    Object.keys(data).forEach(po => addOption(poSelect, po));

    // Clear all dependent dropdowns
    clearSelect(divisionSelect, "Select Division");
    clearSelect(districtSelect, "Select District");
    clearSelect(upazillaSelect, "Select Upazilla");
    clearSelect(branchSelect, "Select Branch");

    // Attach listeners
    poSelect.addEventListener("change", onPoChange);
    divisionSelect.addEventListener("change", onDivisionChange);
    districtSelect.addEventListener("change", onDistrictChange);
    upazillaSelect.addEventListener("change", onUpazillaChange);

    // Attach form submit handler
    document.getElementById("employeeForm").addEventListener("submit", onSubmit);

  } catch (err) {
    console.error("Init error:", err);
  }
}

// ---------------------- Dropdown Change Handlers ----------------------
function onPoChange() {
  clearSelect(divisionSelect, "Select Division");
  clearSelect(districtSelect, "Select District");
  clearSelect(upazillaSelect, "Select Upazilla");
  clearSelect(branchSelect, "Select Branch");

  const po = poSelect.value;
  if (!po || !data[po]) return;

  Object.keys(data[po]).forEach(div => addOption(divisionSelect, div));
}

function onDivisionChange() {
  clearSelect(districtSelect, "Select District");
  clearSelect(upazillaSelect, "Select Upazilla");
  clearSelect(branchSelect, "Select Branch");

  const po = poSelect.value;
  const div = divisionSelect.value;

  if (!po || !div || !data[po][div]) return;

  Object.keys(data[po][div]).forEach(dist => addOption(districtSelect, dist));
}

function onDistrictChange() {
  clearSelect(upazillaSelect, "Select Upazilla");
  clearSelect(branchSelect, "Select Branch");

  const po = poSelect.value;
  const div = divisionSelect.value;
  const dist = districtSelect.value;

  if (!po || !div || !dist || !data[po][div][dist]) return;

  Object.keys(data[po][div][dist]).forEach(u => addOption(upazillaSelect, u));
}

function onUpazillaChange() {
  clearSelect(branchSelect, "Select Branch");

  const po = poSelect.value;
  const div = divisionSelect.value;
  const dist = districtSelect.value;
  const upa = upazillaSelect.value;

  if (!po || !div || !dist || !upa) return;

  const branches = data[po][div][dist][upa];
  if (!Array.isArray(branches)) return;

  branches.forEach(b => addOption(branchSelect, b));
}

// ---------------------- Form Submit Handler ----------------------
async function onSubmit(e) {
  e.preventDefault();

  // Validate dropdowns
  if (!poSelect.value || !divisionSelect.value || !districtSelect.value ||
      !upazillaSelect.value || !branchSelect.value) {
    alert("Please select all dropdown fields.");
    return;
  }

  const payload = {
    po: poSelect.value,
    division: divisionSelect.value,
    district: districtSelect.value,
    upazilla: upazillaSelect.value,
    branch: branchSelect.value,
    name: el("name").value.trim(),
    designation: el("designation").value.trim(),
    age: el("age").value,
    gender: el("gender").value,
    phone: el("phone").value.trim()
  };

  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwCybasAX5pDkK1YjLnQhRLZZnoypC-ll0UtrmX7iTnU8BMU_qlYDf38zcNt8k_Ujmx/exec";  // <-- Replace with your deployed /exec URL

  try {
    const response = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    console.log("Raw response:", text);

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON returned: " + text);
    }

    if (result.result === "success") {
      alert("Employee added successfully.");

      document.getElementById("employeeForm").reset();

      clearSelect(divisionSelect, "Select Division");
      clearSelect(districtSelect, "Select District");
      clearSelect(upazillaSelect, "Select Upazilla");
      clearSelect(branchSelect, "Select Branch");

    } else {
      alert("Error: " + result.message);
    }

  } catch (err) {
    console.error("Submit error:", err);
    alert("Network or CORS error — check console.");
  }
}

