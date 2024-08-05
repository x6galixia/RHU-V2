function hideUserType(value) {
  document.getElementById("user_type_input").value = value;
  document.getElementById("user_type").style.display = "none";
  document.getElementById("imahe").style.display = "none";
  document.getElementById("Login-input").style.marginTop = "-100px";
  document.getElementById("rectang").style.display = "none";
  document.getElementById("login-form").style.display = "flex";
}