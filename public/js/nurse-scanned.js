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
      const { last_name, first_name, middle_name } = JSON.parse(qrResult);
      await fetchAndPopulateFormData(`/api/citizen/${last_name}/${first_name}/${middle_name}`);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    localStorage.removeItem("qrResult");
  }

  const idInput = document.getElementById("idInput");
  const generateButton = document.getElementById("generateButton");
  const searchButton = document.getElementById("searchButton");


  generateButton.addEventListener("click", () => {
    const generatedId = generateId();
    idInput.value = generatedId;
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

  function generateId() {
    const d = new Date().getTime().toString();
    return `${d}`;
  }

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
    document.getElementById("last_name").value = data.last_name;
    document.getElementById("first_name").value = data.first_name;
    document.getElementById("middle_name").value = data.middle_name;
    document.getElementById("address").value = data.address;
    document.getElementById("barangay").value = data.barangay;
    document.getElementById("town").value = data.town;
    document.getElementById("birthdate").value = new Date(data.birthdate)
      .toISOString()
      .split("T")[0];
    document.getElementById("gender").value = data.gender;
    document.getElementById("phone").value = data.phone;
    document.getElementById("email").value = data.email;
    document.getElementById("philhealth_no").value = data.philhealth_no;
    document.getElementById("occupation").value = data.occupation;
    document.getElementById("guardian").value = data.guardian;
  }

});

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