function ValidateForm() {
  var name = document.getElementById('name').value;
  var num = document.getElementById('number').value;
  var alert1;
  if (name == "") {
    alert("Name can't be empty");
    return false;
  }

  if (num < 2 || num > 25) {
    alert(" please enter number between 0-25")
    return false;
  }
  localStorage.setItem("name", name);
  localStorage.setItem("num", num);

}