document.addEventListener("DOMContentLoaded", async () => {
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const date_now_check = getCurrentDate();
  document.getElementById("check_date").value = new Date(date_now_check)
    .toISOString()
    .split("T")[0];

  const qrResult = localStorage.getItem("qrResult");
  if (qrResult) {
    try {
      const { unq_id } = JSON.parse(qrResult);
      await fetchAndPopulateFormData(`/api/citizen/${unq_id}`);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    localStorage.removeItem("qrResult");
  }

  const idInput = document.getElementById("idInput");
  const generateButton = document.getElementById("generateButton");
  const searchButton = document.getElementById("searchButton");

  generateButton.addEventListener("click", async () => {
    try {
      const response = await fetch('/api/generate-id');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      idInput.value = data.id;
      document.getElementById("unq_id").value = data.id;
    } catch (error) {
      console.error("Error generating ID:", error);
    }
  });  

  searchButton.addEventListener("click", async () => {
    const searchValue = idInput.value.trim();
    if (searchValue) {
      try {
        await fetchAndPopulateFormData(`/api/search/${searchValue}`);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      alert("Please enter an ID to search.");
    }
  });

  async function fetchAndPopulateFormData(url) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        populateFormFields(data);
      } else if (response.status === 404) {
        console.error("User not found");
      } else {
        console.error("Failed to fetch user data. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  function populateFormFields(data) {
    document.getElementById("last_name").value = data.last_name || '';
    document.getElementById("first_name").value = data.first_name || '';
    document.getElementById("middle_name").value = data.middle_name || '';
    document.getElementById("address").value = data.address || '';
    document.getElementById("barangay").value = data.barangay || '';
    document.getElementById("town").value = data.town || '';
    document.getElementById("birthdate").value = new Date(data.birthdate)
      .toISOString()
      .split("T")[0] || '';
    document.getElementById("gender").value = data.gender || '';
    document.getElementById("phone").value = data.phone || '';
    document.getElementById("email").value = data.email || '';
    document.getElementById("philhealth_no").value = data.philhealth_no || '';
    document.getElementById("occupation").value = data.occupation || '';
    document.getElementById("guardian").value = data.guardian || '';
  }

});

function computeBMI() {
  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);
  if (height && weight) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      document.getElementById('bmi').value = bmi.toFixed(2);
  } else {
      document.getElementById('bmi').value = '';
  }
}

function validateInputs() {
  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);
  const systolic = parseFloat(document.getElementById('systolic').value);
  const diastolic = parseFloat(document.getElementById('diastolic').value);
  const respiratoryRate = parseFloat(document.getElementById('respiratory_rate').value);
  const pulseRate = parseFloat(document.getElementById('pulse_rate').value);

  if (height > 185) {
      alert('Height cannot exceed 185 cm');
      return false;
  }
  if (weight > 400) {
      alert('Weight cannot exceed 400 kg');
      return false;
  }
  if (systolic > 250) {
      alert('Systolic BP cannot exceed 250');
      return false;
  }
  if (diastolic > 150) {
      alert('Diastolic BP cannot exceed 150');
      return false;
  }
  if (respiratoryRate > 60) {
      alert('Respiratory rate cannot exceed 60 breaths per minute');
      return false;
  }
  if (pulseRate > 200) {
      alert('Pulse rate cannot exceed 200 beats per minute');
      return false;
  }

  return true;
}

function toggleDropdown() {
  document.getElementById("dropdownContent").classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function logout() {
  alert("Logging out...");
}