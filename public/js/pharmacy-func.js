document.addEventListener("DOMContentLoaded", function () {
  const alertMessage = document.getElementById("alertMessage");
  const closeAlertBtn = document.getElementById("closeAlertBtn");

  alertMessage.style.display = "block";
  closeAlertBtn.style.display = "block";

  closeAlertBtn.addEventListener("click", function () {
    alertMessage.style.display = "none";
    closeAlertBtn.style.display = "none";
  });
});

