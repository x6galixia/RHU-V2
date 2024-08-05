document.addEventListener("DOMContentLoaded", function () {
  const openLabRequestButtons = document.querySelectorAll(".openLabRequests");

  const addLabResultForm = document.getElementById("addLabResultForm");
  const closeAddLabResultBtn = document.getElementById("closeAddLabResultBtn");

  addLabResultForm.style.display = "none";

  openLabRequestButtons.forEach((button) => {
    button.addEventListener("click", function () {
      let checkDate = new Date(this.dataset.checkDate);
      let birthDate = new Date(this.dataset.birthdate);

      document.getElementById("add_check_date").value = checkDate.toISOString().slice(0, 10);
      document.getElementById("add_unq_id").value = this.dataset.unqId;
      document.getElementById("add_full_name").value = this.dataset.fullName;
      document.getElementById("add_age").value = this.dataset.age;
      document.getElementById("add_gender").value = this.dataset.gender;
      document.getElementById("add_birthdate").value = birthDate.toISOString().slice(0, 10);
      document.getElementById("add_occupation").value = this.dataset.occupation;
      document.getElementById("add_guardian").value = this.dataset.guardian;
      document.getElementById("add_category").value = this.dataset.category;
      document.getElementById("add_service").value = this.dataset.service;

      addLabResultForm.style.display = "block";
    });
  });

  closeAddLabResultBtn.addEventListener("click", function () {
    addLabResultForm.style.display = "none";
  });

  const addMoreButton = document.getElementById("addMoreButton");
  if (addMoreButton) {
    addMoreButton.addEventListener("click", function () {
      addImageFields();
    });
  }

  function addImageFields() {
    var container = document.getElementById("imageFieldContainer");
    var newFields = document.createElement("div");
    newFields.className = "imageField";
    newFields.innerHTML = `
        <input type="file" name="lab_result" multiple required>
      `;
    container.appendChild(newFields);
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