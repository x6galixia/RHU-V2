document.addEventListener("DOMContentLoaded", function () {
  const openVitalsButtons = document.querySelectorAll(".openVitals");
  const openPrescribeButtons = document.querySelectorAll(".openPrescribe");
  const openLabReqButtons = document.querySelectorAll(".openLabReq");
  const openLabResButtons = document.querySelectorAll(".openLabRes");
  const openDiagnoseButtons = document.querySelectorAll(".openDiagnose");
  const openFindingsButtons = document.querySelectorAll(".openFindings");

  const overlay = document.getElementById('overlay');
  const vitalForm = document.getElementById("vitalForm");
  const prescribeForm = document.getElementById("prescribeForm");
  const labRequestForm = document.getElementById("labRequestForm");
  const labResultForm = document.getElementById("labResultForm");
  const diagnoseForm = document.getElementById("diagnoseForm");
  const findingsForm = document.getElementById("findingsForm");

  const closeVitalsBtn = document.getElementById("closeVitalsBtn");
  const closePrescribeBtn = document.getElementById("closePrescribeBtn");
  const closeLabRequestBtn = document.getElementById("closeLabRequestBtn");
  const closeLabResultBtn = document.getElementById("closeLabResultBtn");
  const closeDiagnoseBtn = document.getElementById("closeDiagnoseBtn");
  const closeFindingsBtn = document.getElementById("closeFindingsBtn");

  // Vitals
  openVitalsButtons.forEach((button) => {
    button.addEventListener("click", function () {
      document.getElementById("unq_id").value = this.dataset.unqId;
      document.getElementById("full_name").value = this.dataset.fullName;
      document.getElementById("height").value = this.dataset.height;
      document.getElementById("weight").value = this.dataset.weight;
      document.getElementById("systolic").value = this.dataset.systolic;
      document.getElementById("diastolic").value = this.dataset.diastolic;
      document.getElementById("temperature").value = this.dataset.temperature;
      document.getElementById("pulse_rate").value = this.dataset.pulseRate;
      document.getElementById("respiratory_rate").value =
        this.dataset.respiratoryRate;
      document.getElementById("bmi").value = this.dataset.bmi;
      document.getElementById("comment").value = this.dataset.comment;
      overlay.style.display = "block";
      vitalForm.style.display = "block";
    });
  });

  closeVitalsBtn.addEventListener("click", function () {
    overlay.style.display = "none";
    vitalForm.style.display = "none";
  });
  overlay.addEventListener("click", function () {
    overlay.style.display = "none";
    vitalForm.style.display = "none";
  });

  // Prescribe
  openPrescribeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      document.getElementById("pres_unq_id").value = this.dataset.unqId;
      document.getElementById("pres_check_date").value = new Date(
        this.dataset.checkDate
      )
        .toISOString()
        .split("T")[0];
      document.getElementById("pres_full_name").value = this.dataset.fullName;
      document.getElementById("pres_age").value = this.dataset.age;
      document.getElementById("pres_gender").value = this.dataset.gender;
      document.getElementById("pres_birthdate").value = new Date(
        this.dataset.birthdate
      )
        .toISOString()
        .split("T")[0];
      document.getElementById("pres_phone").value = this.dataset.contactNumber;
      document.getElementById("pres_full_address").value = this.dataset.fullAddress;
      document.getElementById("pres_occupation").value =
        this.dataset.occupation;
      document.getElementById("pres_guardian").value = this.dataset.guardian;
      document.getElementById("pres_doctor").value = this.dataset.doctor;
      overlay.style.display = "block";
      prescribeForm.style.display = "block";
    });
  });

  closePrescribeBtn.addEventListener("click", function () {
    overlay.style.display = "none";
    prescribeForm.style.display = "none";
  });
  overlay.addEventListener("click", function () {
    overlay.style.display = "none";
    prescribeForm.style.display = "none";
  });

  // Lab Request
  openLabReqButtons.forEach((button) => {
    button.addEventListener("click", function () {
      document.getElementById("req_unq_id").value = this.dataset.unqId;
      document.getElementById("req_check_date").value = new Date(
        this.dataset.checkDate
      )
        .toISOString()
        .split("T")[0];
      document.getElementById("req_full_name").value = this.dataset.fullName;
      document.getElementById("req_age").value = this.dataset.age;
      document.getElementById("req_gender").value = this.dataset.gender;
      document.getElementById("req_birthdate").value = new Date(
        this.dataset.birthdate
      )
        .toISOString()
        .split("T")[0];
      document.getElementById("req_occupation").value = this.dataset.occupation;
      document.getElementById("req_guardian").value = this.dataset.guardian;
      overlay.style.display = "block";
      labRequestForm.style.display = "block";
    });
  });

  closeLabRequestBtn.addEventListener("click", function () {
    overlay.style.display = "none";
    labRequestForm.style.display = "none";
  });
  overlay.addEventListener("click", function () {
    overlay.style.display = "none";
    labRequestForm.style.display = "none";
  });



  //l-----------------lab results--------------
  openLabResButtons.forEach(button => {
    button.addEventListener("click", function () {
      document.getElementById("res_unq_id").value = this.dataset.unqId;
      document.getElementById("res_check_date").value = new Date(this.dataset.checkDate).toISOString().split("T")[0];
      document.getElementById("res_full_name").value = this.dataset.fullName;
      document.getElementById("res_age").value = this.dataset.age;
      document.getElementById("res_gender").value = this.dataset.gender;
      document.getElementById("res_birthdate").value = new Date(this.dataset.birthdate).toISOString().split("T")[0];
      document.getElementById("res_occupation").value = this.dataset.occupation;
      document.getElementById("res_guardian").value = this.dataset.guardian;

      const labResults = this.dataset.labResults ? JSON.parse(this.dataset.labResults) : [];
      const labResultsContainer = document.querySelector("#labResultForm ul");
      labResultsContainer.innerHTML = "";

      if (labResults.length > 0) {
        labResults.forEach(filename => {
          const listItem = document.createElement("li");
          const link = document.createElement("a");
          link.href = `/uploads/${filename}`;
          link.target = "_blank";
          link.textContent = filename;
          listItem.appendChild(link);
          labResultsContainer.appendChild(listItem);
        });
      } else {
        labResultsContainer.innerHTML = "<p>No lab results available.</p>";
      }
      overlay.style.display = "block";
      labResultForm.style.display = "block";
    });
  });

  closeLabResultBtn.addEventListener("click", function () {
    overlay.style.display = "none";
    labResultForm.style.display = "none";
  });
  overlay.addEventListener("click", function () {
    overlay.style.display = "none";
    labResultForm.style.display = "none";
  });

  // Diagnose
  openDiagnoseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      document.getElementById("dia_unq_id").value = this.dataset.unqId;
      document.getElementById("dia_check_date").value = new Date(
        this.dataset.checkDate
      )
        .toISOString()
        .split("T")[0];
      document.getElementById("dia_full_name").value = this.dataset.fullName;
      document.getElementById("dia_age").value = this.dataset.age;
      document.getElementById("dia_gender").value = this.dataset.gender;
      document.getElementById("dia_birthdate").value = new Date(
        this.dataset.birthdate
      )
        .toISOString()
        .split("T")[0];
      document.getElementById("dia_occupation").value = this.dataset.occupation;
      document.getElementById("dia_guardian").value = this.dataset.guardian;
      overlay.style.display = "block";
      diagnoseForm.style.display = "block";
    });
  });

  closeDiagnoseBtn.addEventListener("click", function () {
    overlay.style.display = "none";
    diagnoseForm.style.display = "none";
  });
  overlay.addEventListener("click", function () {
    overlay.style.display = "none";
    diagnoseForm.style.display = "none";
  });

  // Findings
  openFindingsButtons.forEach((button) => {
    button.addEventListener("click", function () {
      document.getElementById("fin_unq_id").value = this.dataset.unqId;
      document.getElementById("fin_check_date").value = new Date(
        this.dataset.checkDate
      )
        .toISOString()
        .split("T")[0];
      document.getElementById("fin_full_name").value = this.dataset.fullName;
      document.getElementById("fin_age").value = this.dataset.age;
      document.getElementById("fin_gender").value = this.dataset.gender;
      document.getElementById("fin_birthdate").value = new Date(
        this.dataset.birthdate
      )
        .toISOString()
        .split("T")[0];
      document.getElementById("fin_occupation").value = this.dataset.occupation;
      document.getElementById("fin_guardian").value = this.dataset.guardian;
      overlay.style.display = "block";
      findingsForm.style.display = "block";
    });
  });

  closeFindingsBtn.addEventListener("click", function () {
    overlay.style.display = "none";
    findingsForm.style.display = "none";
  });
  overlay.addEventListener("click", function () {
    overlay.style.display = "none";
    findingsForm.style.display = "none";
  });

  const addMoreButton = document.getElementById("addMoreButton");
  if (addMoreButton) {
    addMoreButton.addEventListener("click", function () {
      addCategoryFields();
    });
  }

  function addCategoryFields() {
    var container = document.getElementById("category-fields-container");
    var newFields = document.createElement("div");
    newFields.className = "category-fields";
    newFields.innerHTML = `
      <select class="category-dropdown" name="category">
        <option value="default" disabled selected>Select a category</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
        <option value="option4" disabled>Option 4 (Disabled)</option>
      </select>

      <select class="service-dropdown" name="service">
        <option value="default" disabled selected>Select a service</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
        <option value="option4" disabled>Option 4 (Disabled)</option>
      </select>
    `;
    container.appendChild(newFields);
  }
  //=-----------------------search----------------------------///
  document.getElementById('search-box').addEventListener('input', function () {
    const query = this.value;
    if (query.length > 0) {
      fetch(`/search?query=${query}`)
        .then(response => response.json())
        .then(data => {
          const suggestions = document.getElementById('suggestions');
          suggestions.innerHTML = '';
          data.forEach(item => {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.classList.add('suggestion');
            suggestionDiv.textContent = `${item.product_name} - ${item.dosage} QTY: ${item.product_quantity}`;
            suggestionDiv.addEventListener('click', function () {
              document.getElementById('search-box').value = item.product_name + " " + item.dosage;
              suggestions.innerHTML = '';
            });
            suggestions.appendChild(suggestionDiv);
          });
        })
        .catch(error => console.error('Error:', error));
    } else {
      document.getElementById('suggestions').innerHTML = '';
    }
  });

  const alertMessage = document.getElementById("alertMessage");
  const closeAlertBtn = document.getElementById("closeAlertBtn");

  alertMessage.style.display = "block";
  closeAlertBtn.style.display = "block";

  closeAlertBtn.addEventListener("click", function () {
    alertMessage.style.display = "none";
    closeAlertBtn.style.display = "none";
  });

  //-----------------------row clicked handler-------------------------------//

  //----------------------->>end
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

