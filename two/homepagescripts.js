function ValidateForm() {
  var name = document.getElementById('name').value;
  var num = document.getElementById('number').value;
  var alert1;
  if (name == "") {
    alert("Name can't be empty");
  }

  if (num < 0 || num > 25) {
    alert(" please enter number between 0-25")
  }
  localStorage.setItem("name", name);
  localStorage.setItem("num", num);

}