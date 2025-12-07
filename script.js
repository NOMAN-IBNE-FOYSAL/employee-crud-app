// Structure: PO -> Division -> District -> Upazilla -> [Branches array]
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

// ---------------------- Helpers & DOM ----------------------
const el = id => document.getElementById(id);

const poSelect = el('po');
const divisionSelect = el('division');
const districtSelect = el('district');
const upazillaSelect = el('upazilla');
const branchSelect = el('branch');

function clearSelect(sel, placeholderText) {
  sel.innerHTML = '';
  const opt = document.createElement('option');
  opt.value = '';
  opt.textContent = placeholderText;
  sel.appendChild(opt);
}

// safe add option
function addOption(sel, value, label) {
  const opt = document.createElement('option');
  opt.value = value;
  opt.textContent = label ?? value;
  sel.appendChild(opt);
}

// ---------------------- Initialization ----------------------
function init() {
  try {
    // populate PO
    clearSelect(poSelect, 'Select PO');
    Object.keys(data).forEach(po => addOption(poSelect, po));

    // ensure dependent selects are cleared
    clearSelect(divisionSelect, 'Select Division');
    clearSelect(districtSelect, 'Select District');
    clearSelect(upazillaSelect, 'Select Upazilla');
    clearSelect(branchSelect, 'Select Branch');

    // attach listeners
    poSelect.addEventListener('change', onPoChange);
    divisionSelect.addEventListener('change', onDivisionChange);
    districtSelect.addEventListener('change', onDistrictChange);
    upazillaSelect.addEventListener('change', onUpazillaChange);

    document.getElementById('employeeForm').addEventListener('submit', onSubmit);

    // if you want an initial selection for demo, uncomment:
    // poSelect.value = Object.keys(data)[0]; poSelect.dispatchEvent(new Event('change'));
  } catch (err) {
    console.error('Initialization error:', err);
  }
}

// ---------------------- Change handlers ----------------------
function onPoChange() {
  clearSelect(divisionSelect, 'Select Division');
  clearSelect(districtSelect, 'Select District');
  clearSelect(upazillaSelect, 'Select Upazilla');
  clearSelect(branchSelect, 'Select Branch');

  const po = poSelect.value;
  if (!po || !data[po]) return;

  const divisions = data[po];
  Object.keys(divisions).forEach(div => addOption(divisionSelect, div));
}

function onDivisionChange() {
  clearSelect(districtSelect, 'Select District');
  clearSelect(upazillaSelect, 'Select Upazilla');
  clearSelect(branchSelect, 'Select Branch');

  const po = poSelect.value;
  const div = divisionSelect.value;
  if (!po || !div || !data[po] || !data[po][div]) return;

  const districts = data[po][div];
  Object.keys(districts).forEach(d => addOption(districtSelect, d));
}

function onDistrictChange() {
  clearSelect(upazillaSelect, 'Select Upazilla');
  clearSelect(branchSelect, 'Select Branch');

  const po = poSelect.value;
  const div = divisionSelect.value;
  const dist = districtSelect.value;
  if (!po || !div || !dist || !data[po] || !data[po][div] || !data[po][div][dist]) return;

  const upazillas = data[po][div][dist];
  Object.keys(upazillas).forEach(u => addOption(upazillaSelect, u));
}

function onUpazillaChange() {
  clearSelect(branchSelect, 'Select Branch');

  const po = poSelect.value;
  const div = divisionSelect.value;
  const dist = districtSelect.value;
  const upa = upazillaSelect.value;
  if (!po || !div || !dist || !upa ||
      !data[po] || !data[po][div] || !data[po][div][dist] || !data[po][div][dist][upa]) return;

  const branches = data[po][div][dist][upa];
  if (!Array.isArray(branches)) return;
  branches.forEach(b => addOption(branchSelect, b));
}

// ---------------------- Submit (example POST) ----------------------
function onSubmit(evt) {
  evt.preventDefault();

  // Simple validation check
  if (!poSelect.value || !divisionSelect.value || !districtSelect.value
      || !upazillaSelect.value || !branchSelect.value) {
    alert('Please select all location fields.');
    return;
  }

  const payload = {
    po: poSelect.value,
    division: divisionSelect.value,
    district: districtSelect.value,
    upazilla: upazillaSelect.value,
    branch: branchSelect.value,
    name: el('name').value.trim(),
    designation: el('designation').value.trim(),
    age: el('age').value,
    gender: el('gender').value,
    phone: el('phone').value.trim()
  };

  // Replace with your Apps Script URL and ensure Apps Script has CORS headers
  const WEB_APP_URL = 'YOUR_WEB_APP_URL_HERE';

  fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(res => {
    if (res && res.result === 'success') {
      alert('Employee added successfully.');
      document.getElementById('employeeForm').reset();
      // clear selects back to default
      clearSelect(divisionSelect, 'Select Division');
      clearSelect(districtSelect, 'Select District');
      clearSelect(upazillaSelect, 'Select Upazilla');
      clearSelect(branchSelect, 'Select Branch');
    } else {
      console.error('Response:', res);
      alert('Server error: ' + (res && res.message ? res.message : 'unknown'));
    }
  })
  .catch(err => {
    console.error('Fetch error:', err);
    alert('Network or CORS error — check console for details.');
  });
}

// ---------------------- Run init on DOM ready ----------------------
document.addEventListener('DOMContentLoaded', init);
